package indexer

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
)

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
		// log.Printf("scanning %d master block...\n", master.SeqNo)

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
			// log.Printf("scanning block %d of shard %x in workchain %d...", shard.SeqNo, uint64(shard.Shard), shard.Workchain)

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
					if !worker.activeGifts[addr.StringRaw()] {
						log.Printf("address %s not in activeGifts cache, skipping", addr.StringRaw())
						continue
					}
					fmt.Printf("!!! Найдена транзакция с активным подакром на наш контракт: %s\n", addr.StringRaw())
					tx, err := worker.api.GetTransaction(ctx, shard, addr, id.LT)
					if err != nil {
						log.Println("get tx data err:", err.Error())
						continue
					}
					// log src when available
					if tx.IO.In != nil && tx.IO.In.MsgType == tlb.MsgTypeInternal {
						fmt.Println("from gift jetton wallet address: ", tx.IO.In.AsInternal().SrcAddr)
					} else {
						fmt.Println("tx has no internal in-message or it's not internal")
					}

					// TODO

					// desc, ok := tx.Description.(tlb.TransactionDescriptionOrdinary)
					//if !ok {
					//	fmt.Println("continue mode -- skip")
					//	continue // Это не обычная транзакция (например, системная), пропускаем
					//}
					// 2. Проверяем фазу вычислений (Compute Phase)
					// Если фазы нет или она была пропущена (skipped) - значит код не выполнялся
					//if desc.ComputePhase.Phase == nil ||
					//	desc.Aborted ||
					//	desc.Destroyed {
					//	fmt.Println("phase mode -- skip")
					//	fmt.Println(desc.Aborted, desc.Destroyed)
					//	continue
					//}
					err = worker.processTransaction(tx, ctx,
						// maybe delete parameter
						pgtype.Text{
							String: addr.Bounce(true).Testnet(true).String(),
							Valid:  true,
						})

					if err != nil {
						fmt.Println("process tx err:", err.Error())
						continue
					}
					// TODO

					// desc, ok := tx.Description.(tlb.TransactionDescriptionOrdinary)
					//if !ok {
					//	fmt.Println("continue mode -- skip")
					//	continue // Это не обычная транзакция (например, системная), пропускаем
					//}
					// 2. Проверяем фазу вычислений (Compute Phase)
					// Если фазы нет или она была пропущена (skipped) - значит код не выполнялся
					//if desc.ComputePhase.Phase == nil ||
					//	desc.Aborted ||
					//	desc.Destroyed {
					//	fmt.Println("phase mode -- skip")
					//	fmt.Println(desc.Aborted, desc.Destroyed)
					//	continue
					//}
					err = worker.processTransaction(tx, ctx,
						// maybe delete parameter
						pgtype.Text{
							String: addr.Bounce(true).Testnet(true).String(),
							Valid:  true,
						})

					if err != nil {
						fmt.Println("process tx err:", err.Error())
						continue
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
}
