package indexer

import (
	"PartyBaker/internal/blockchain"
	"PartyBaker/internal/utils"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xssnick/tonutils-go/tlb"
)

func (worker *Worker) processTransaction(transaction *tlb.Transaction, ctx context.Context, contractAddress pgtype.Text) error {
	fmt.Printf("Processing transaction: %s, hash: %x\n", contractAddress.String, transaction.Hash)

	// Try to parse incoming internal message first
	if transaction.IO.In != nil && transaction.IO.In.MsgType == tlb.MsgTypeInternal {
		inMsg := transaction.IO.In.AsInternal()
		body := inMsg.Body.BeginParse()

		op, err := body.LoadUInt(32)
		if err != nil {
			log.Println("failed to load op from in message:", err)
		} else {
			switch uint32(op) {
			case blockchain.TRANSFER_NOTIFICATION:
				transferNotification := &blockchain.TransferNotification{}
				err = tlb.LoadFromCell(transferNotification, body)
				if err != nil {
					return err
				}

				fmt.Printf("Получен вклад: %s от %s\n", transferNotification.Amount.Nano().String(),
					transferNotification.SenderAddress.Bounce(true).Testnet(true).String())

				err := worker.repo.ProcessTransfer(ctx, contractAddress,
					utils.ParseJsonString(transferNotification.SenderAddress.Bounce(true).Testnet(true).String()),
					parseCoinsToInt8(transferNotification.Amount.Nano()),
					parseBytesToText(transaction.Hash))
				if err != nil {
					return err
				}

			case blockchain.CANCEL_GIFT:
				err := worker.repo.CancelGift(ctx, contractAddress)
				if err != nil {
					log.Println("DB Error on cancel:", err)
				} else {
					fmt.Println("SUCCESS: Gift marked as cancelled in DB")
				}

			case blockchain.RETURN_AMOUNT:
				amountToReturn, err := getAmountFromOutMsg(transaction)
				if err != nil {
					return err
				}

				userWalletAddress := inMsg.SrcAddr
				err = worker.repo.ReturnAmount(ctx, contractAddress,
					parseBytesToText(userWalletAddress.Data()), amountToReturn)

				if err != nil {
					log.Println("DB Error on return:", err)
				} else {
					fmt.Println("SUCCESS: Gift marked as returning amount")
				}

			case blockchain.CHANGE_ADMIN:
				newAdminAddress, _ := body.LoadAddr()
				err := worker.repo.ChangeAdmin(ctx, contractAddress,
					parseBytesToText(newAdminAddress.Data()))

				if err != nil {
					log.Println("DB Error on cancel:", err)
				} else {
					fmt.Println("SUCCESS: Gift changed it's admin")
				}

			case blockchain.CHANGE_TARGET:
				newTargetAmount, _ := body.LoadBigCoins()
				err := worker.repo.ChangeTargetAmount(ctx, contractAddress,
					parseCoinsToInt8(newTargetAmount))

				if err != nil {
					log.Println("DB Error on cancel:", err)
				} else {
					fmt.Println("SUCCESS: Gift changed it's target_amount")
				}

			default:
				log.Printf("INFO: unknown in-message op: %v", op)
			}
		}
	} else {
		log.Println("in message is nil or not internal, inspecting out messages for transfer payloads")
	}

	// Fallback: inspect out messages for AskToTransfer (jetton forwards) and process transfer
	//if val, err := getAmountFromOutMsg(transaction); err == nil {
	//	var src pgtype.Text
	//	if transaction.IO.In != nil && transaction.IO.In.MsgType == tlb.MsgTypeInternal {
	//		src = parseBytesToText(transaction.IO.In.AsInternal().SrcAddr.Data())
	//	} else {
	//		// best-effort: try to get src from transaction metadata
	//		if transaction.IO.In != nil {
	//			src = parseBytesToText(transaction.IO.In.AsInternal().SrcAddr.Data())
	//		}
	//	}
	//
	//	if src.Valid {
	//		err := worker.repo.ProcessTransfer(ctx, contractAddress, src, val, parseBytesToText(transaction.Hash))
	//		if err != nil {
	//			return fmt.Errorf("failed processing transfer from out messages: %w", err)
	//		}
	//		fmt.Println("Processed transfer via out message fallback")
	//		return nil
	//	}
	//}

	return nil
}
