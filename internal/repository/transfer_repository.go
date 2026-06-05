package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) ReturnAmount(ctx context.Context, contractAddress pgtype.Text,
	userWalletAddress pgtype.Text, amountToReturn pgtype.Int8) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("error begin tx in db: %w", err)
	}
	defer tx.Rollback(ctx)

	err = r.query.DecreaseCollectedAmount(ctx, db.DecreaseCollectedAmountParams{
		CollectedAmount: amountToReturn,
		ContractAddress: contractAddress,
	})
	if err != nil {
		return fmt.Errorf("error decrease collected amount in db: %w", err)
	}

	err = r.query.DeleteParticipantGift(ctx, db.DeleteParticipantGiftParams{
		ContractAddress: contractAddress,
		WalletAddress:   userWalletAddress,
	})
	if err != nil {
		return fmt.Errorf("error delete participant gift contribution: %w", err)
	}

	tx.Commit(ctx)

	return nil
}

func (r *Repository) ProcessTransfer(ctx context.Context, contractAddress pgtype.Text,
	userWallerAddress pgtype.Text, transferAmount pgtype.Int8, txHash pgtype.Text) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("error begin tx in db: %w", err)
	}

	defer tx.Rollback(ctx)

	fmt.Println("user address", userWallerAddress)
	fmt.Println("contract address", contractAddress)

	err = r.query.CreateParticipantGiftRecord(ctx, db.CreateParticipantGiftRecordParams{
		ContractAddress: contractAddress,
		WalletAddress:   userWallerAddress,
		Amount:          transferAmount,
		TransactionHash: txHash,
	})
	if err != nil {
		return fmt.Errorf("error record transfer in db: %w", err)
	}

	err = r.query.IncreaseCollectedAmount(ctx, db.IncreaseCollectedAmountParams{
		CollectedAmount: transferAmount,
		ContractAddress: contractAddress,
	})
	if err != nil {
		return fmt.Errorf("error increase collected amount in db: %w", err)
	}

	tx.Commit(ctx)
	return nil
}
