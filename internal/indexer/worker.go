package indexer

import (
	"PartyBaker/internal/core"
	"PartyBaker/internal/repository"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
)

type Worker struct {
	repo        *repository.Repository
	api         ton.APIClientWrapped
	activeGifts map[string]bool
}

func NewWorker(repo *repository.Repository, api ton.APIClientWrapped) *Worker {
	return &Worker{
		repo: repo,
		api:  api,
	}
}

func (worker *Worker) UpdateCache(ctx context.Context) {
	ads, _ := worker.repo.GetAllActiveGiftsAddresses(ctx)
	newCache := make(map[string]bool)
	for _, addr := range ads {
		parsedAddr, err := address.ParseAddr(addr.String)
		log.Println("pgtype:", addr)
		log.Println("CACHE:", parsedAddr.StringRaw())

		if err != nil {
			continue
		}
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

func (worker *Worker) processTransaction(transaction *tlb.Transaction, ctx context.Context, contractAddress pgtype.Text) error {

	fmt.Println("Processing transaction")
	if transaction.IO.In == nil ||
		transaction.IO.In.MsgType != tlb.MsgTypeInternal {
		return fmt.Errorf("failed type of internal message")
	}
	inMsg := transaction.IO.In.AsInternal()
	body := inMsg.Body.BeginParse()

	op, err := body.LoadUInt(32)
	if err != nil {
		return fmt.Errorf("failed to load op")
	}

	switch uint32(op) {
	case core.TRANSFER_NOTIFICATION:
		transferNotification := &core.TransferNotification{}
		err = tlb.LoadFromCell(transferNotification, body)
		if err != nil {
			return err
		}
		fmt.Printf("Получен вклад: %s от %s\n", transferNotification.Amount.Nano().String(),
			transferNotification.SenderAddress.String())

	case core.CANCEL_GIFT:
		err := worker.repo.CancelGift(ctx, contractAddress)
		if err != nil {
			log.Println("DB Error on cancel:", err)
		} else {
			fmt.Println("SUCCESS: Gift marked as cancelled in DB")
		}

	case core.RETURN_AMOUNT:

	case core.CHANGE_ADMIN:
		err := worker.repo.CancelGift(ctx, contractAddress)
		if err != nil {
			log.Println("DB Error on cancel:", err)
		} else {
			fmt.Println("SUCCESS: Gift marked as cancelled in DB")
		}

	case core.CHANGE_TARGET:

	default:
		log.Printf("WARNING: unknown transaction type: %v", transaction.IO.In.MsgType)
	}
	return nil

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

// FYI: You can find more advanced, optimized and parallelized block scanner in payment network implementation:
// https://github.com/xssnick/ton-payment-network/blob/master/tonpayments/chain/block-scan.go

func (worker *Worker) Run(ctx context.Context) {
	worker.UpdateCache(ctx)
	for addr := range worker.activeGifts {
		fmt.Println("active gift", addr)
	}
	log.Println("checking proofs since config init block, it may take near a minute...")

	master, err := worker.api.GetMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
		return
	}

	// TIP: you could save and store last trusted master block (master variable data)
	// for faster initialization later using api.SetTrustedBlock

	log.Println("master proofs chain successfully verified, all data is now safe and trusted!")

	// bound all requests to single lite server for consistency,
	// if it will go down, another lite server will be used
	// ctx := worker.api.Client().StickyContext(context.Background())

	// storage for last seen shard seqno
	// in order not to read too old transactions
	shardLastSeqno := map[string]uint32{}

	// getting information about other work-chains and shards of first master block
	// to init storage of last seen shard seq numbers
	firstShards, err := worker.api.GetBlockShardsInfo(ctx, master)
	if err != nil {
		log.Fatalln("get shards err:", err.Error())
		return
	}
	for _, shard := range firstShards {
		shardLastSeqno[getShardID(shard)] = shard.SeqNo
	}

	for {
		log.Printf("scanning %d master block...\n", master.SeqNo)

		// getting information about other work-chains and shards of master block
		currentShards, err := worker.api.GetBlockShardsInfo(ctx, master)
		if err != nil {
			log.Fatalln("get shards err:", err.Error())
			return
		}

		// shards in master block may have holes, e.g. shard seqno 2756461, then 2756463, and no 2756462 in master chain
		// thus we need to scan a bit back in case of discovering a hole, till last seen, to fill the misses.
		var newShards []*ton.BlockIDExt
		for _, shard := range currentShards {
			notSeen, err := getNotSeenShards(ctx, worker.api, shard, shardLastSeqno)
			if err != nil {
				log.Fatalln("get not seen shards err:", err.Error())
				return
			}
			shardLastSeqno[getShardID(shard)] = shard.SeqNo
			newShards = append(newShards, notSeen...)
		}
		newShards = append(newShards, master)

		// var txList []*tlb.Transaction

		// for each shard block getting transactions
		for _, shard := range newShards {
			log.Printf("scanning block %d of shard %x in workchain %d...", shard.SeqNo, uint64(shard.Shard), shard.Workchain)

			var fetchedIDs []ton.TransactionShortInfo
			var after *ton.TransactionID3
			var more = true

			// load all transactions in batches with 100 transactions in each while exists
			for more {
				fetchedIDs, more, err = worker.api.WaitForBlock(master.SeqNo).GetBlockTransactionsV2(ctx, shard, 100, after)
				if err != nil {
					log.Fatalln("get tx ids err:", err.Error())
					return
				}

				if more {
					// set load offset for next query (pagination)
					after = fetchedIDs[len(fetchedIDs)-1].ID3()
				}

				for _, id := range fetchedIDs {
					addr := address.NewAddress(0, byte(shard.Workchain), id.Account)

					// todo also there are cases with canceled gift
					if !(worker.activeGifts[addr.StringRaw()]) {
						continue
					}
					fmt.Printf("!!! Найдена транзакция с активным подакром на наш контракт: %s\n", addr.StringRaw())
					tx, err := worker.api.GetTransaction(ctx, shard, addr, id.LT)
					if err != nil {
						log.Println("get tx data err:", err.Error())
						continue
					}
					desc, ok := tx.Description.(tlb.TransactionDescriptionOrdinary)
					if !ok {
						continue // Это не обычная транзакция (например, системная), пропускаем
					}
					// 2. Проверяем фазу вычислений (Compute Phase)
					// Если фазы нет или она была пропущена (skipped) - значит код не выполнялся
					if desc.ComputePhase.Phase == nil ||
						desc.Aborted || desc.Destroyed {
						continue
					}
					err = worker.processTransaction(tx, ctx,
						// maybe delete parameter
						pgtype.Text{
							String: addr.Testnet(true).String(),
							Valid:  true,
						})

					if err != nil {
						continue
					}
				}
			}
		}

		master, err = worker.api.WaitForBlock(master.SeqNo+1).LookupBlock(ctx, master.Workchain, master.Shard, master.SeqNo+1)
		if err != nil {
			log.Fatalln("get masterchain info err: ", err.Error())
			return
		}
	}
}
