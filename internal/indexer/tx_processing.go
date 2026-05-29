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

	fmt.Println("Processing transaction:", contractAddress)
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
	case blockchain.TRANSFER_NOTIFICATION:
		transferNotification := &blockchain.TransferNotification{}
		err = tlb.LoadFromCell(transferNotification, body)
		if err != nil {
			return err
		}

		fmt.Printf("Получен вклад: %s от %s\n", transferNotification.Amount.Nano().String(),
			transferNotification.SenderAddress.Bounce(true).Testnet(true).String())

		// userWalletAddress := inMsg.SrcAddr

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
		log.Printf("WARNING: unknown transaction type: %v", transaction.IO.In.MsgType)
	}
	return nil

}
