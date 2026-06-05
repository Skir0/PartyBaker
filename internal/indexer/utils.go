package indexer

import (
	"PartyBaker/internal/blockchain"
	"context"
	"fmt"
	"log"
	"math/big"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
)

func (worker *Worker) UpdateCache(ctx context.Context) {
	ads, _ := worker.repo.GetAllActiveGiftsAddresses(ctx)
	newCache := make(map[string]bool)
	for _, addr := range ads {
		parsedAddr, err := address.ParseAddr(addr.String)
		if err != nil {
			log.Println("skip invalid contract address:", addr.String, err)
			continue
		}
		log.Println("pgtype:", addr)
		log.Println("CACHE:", parsedAddr.StringRaw())

		tokenClient := jetton.NewJettonMasterClient(worker.api, blockchain.ACCEPTED_MINTER_COOKIE_ADDRESS)

		jwAddress, err := tokenClient.GetJettonWallet(ctx, parsedAddr)
		if err != nil {
			log.Println("GetJettonWallet error for", parsedAddr.String(), err)
			continue
		}
		if jwAddress == nil {
			log.Println("jwAddress is nil for", parsedAddr.String())
			continue
		}
		fmt.Println("jwAddress:", jwAddress.Address())
		newCache[parsedAddr.StringRaw()] = true
	}
	worker.activeGifts = newCache
}

func parseBytesToText(accountAddr []byte) pgtype.Text {
	// 1. Превращаем 32 байта в нормальную строку TON (User-friendly)
	// Шард (Workchain) обычно 0
	addr := address.NewAddress(0, 0, accountAddr)

	textValue := pgtype.Text{
		String: addr.String(),
		Valid:  true,
	}
	return textValue
}

func parseCoinsToInt8(amount *big.Int) pgtype.Int8 {
	val := pgtype.Int8{
		Int64: amount.Int64(),
		Valid: true,
	}
	return val
}

func getAmountFromOutMsg(transaction *tlb.Transaction) (pgtype.Int8, error) {
	outMessages, err := transaction.IO.Out.ToSlice()
	if err != nil {
		// TODO
		return pgtype.Int8{}, err
	}
	for _, out := range outMessages {

		if out.MsgType != tlb.MsgTypeInternal {
			continue
		}
		if out.AsInternal().Body == nil {
			continue
		}

		outBodySlice := out.AsInternal().Body.BeginParse()
		op, err := outBodySlice.PreloadUInt(32)
		if err != nil {
			continue
		}
		if uint32(op) == blockchain.ASK_TO_TRANSFER {
			askToTransfer := &blockchain.AskToTransfer{}
			err := tlb.LoadFromCell(askToTransfer, outBodySlice)
			if err != nil {
				continue
			}
			val := parseCoinsToInt8(askToTransfer.Amount.Nano())
			return val, nil
		}

	}
	return pgtype.Int8{}, fmt.Errorf("сообщение AskToTransfer не найдено")
}

// func to get storage map key
func getShardID(shard *ton.BlockIDExt) string {
	return fmt.Sprintf("%d|%d", shard.Workchain, shard.Shard)
}

func getNotSeenShards(ctx context.Context, api ton.APIClientWrapped, shard *ton.BlockIDExt, shardLastSeqno map[string]uint32) (ret []*ton.BlockIDExt, err error) {
	if no, ok := shardLastSeqno[getShardID(shard)]; ok && no == shard.SeqNo {
		return nil, nil
	}

	b, err := api.GetBlockData(ctx, shard)
	if err != nil {
		return nil, fmt.Errorf("get block data: %w", err)
	}

	parents, err := ton.GetParentBlocks(&b.BlockInfo)
	if err != nil {
		return nil, fmt.Errorf("get parent blocks (%d:%x:%d): %w", shard.Workchain, uint64(shard.Shard), shard.Shard, err)
	}

	for _, parent := range parents {
		ext, err := getNotSeenShards(ctx, api, parent, shardLastSeqno)
		if err != nil {
			return nil, err
		}
		ret = append(ret, ext...)
	}

	ret = append(ret, shard)
	return ret, nil
}
