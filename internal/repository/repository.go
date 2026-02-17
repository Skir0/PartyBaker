package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	query *db.Queries
	db    *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		query: db.New(pool),
		db:    pool,
	}
}

func (r *Repository) CancelGift(ctx context.Context, giftContractAddress pgtype.Text) error {

	result, err := r.query.CancelGift(ctx, giftContractAddress)
	if err != nil {
		return fmt.Errorf("database error: %w", err)
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("gift not found or already cancelled/paid")
	}

	log.Printf("Gift %s marked as cancelled in DB", giftContractAddress.String)
	return nil
}

func (r *Repository) GetAllActiveGiftsAddresses(ctx context.Context) ([]pgtype.Text, error) {
	slice, err := r.query.GetAllActiveGiftsAddresses(ctx)
	if err != nil {
		return nil, err
	}
	return slice, nil
}

func (r *Repository) ChangeAdmin(ctx context.Context, giftContractAddress pgtype.Text,
	userWalletAddress pgtype.Text) error {

	err := r.query.ChangeAdmin(ctx, db.ChangeAdminParams{
		WalletAddress:   userWalletAddress,
		ContractAddress: giftContractAddress,
	})
	if err != nil {
		return fmt.Errorf("error change admin in db: %w", err)
	}
	return nil
}

func (r *Repository) ChangeTargetAmount(ctx context.Context, giftContractAddress pgtype.Text, newTargetAmount pgtype.Int8) error {

	err := r.query.ChangeTargetAmount(ctx, db.ChangeTargetAmountParams{
		TargetAmount:    newTargetAmount,
		ContractAddress: giftContractAddress,
	})
	if err != nil {
		return fmt.Errorf("error change target amount in db: %w", err)
	}
	return nil
}

func (r *Repository) ReturnAmount(ctx context.Context, giftContractAddress pgtype.Text,
	userWalletAddress pgtype.Text, amountToReturn pgtype.Int8) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("error begin tx in db: %w", err)
	}
	defer tx.Rollback(ctx)

	err = r.query.DecreaseCollectedAmount(ctx, db.DecreaseCollectedAmountParams{
		CollectedAmount: amountToReturn,
		ContractAddress: giftContractAddress,
	})
	if err != nil {
		return fmt.Errorf("error decrease collected amount in db: %w", err)
	}

	err = r.query.DeleteParticipantGift(ctx, db.DeleteParticipantGiftParams{
		ContractAddress: giftContractAddress,
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

	// maybe create paticipant or gift

	err = r.query.RecordTransfer(ctx, db.RecordTransferParams{
		ContractAddress: contractAddress,
		WalletAddress:   userWallerAddress,
		Amount:          transferAmount,
		TransactionHash: txHash,
	})
	if err != nil {
		return err
	}

	err = r.query.IncreaseCollectedAmount(ctx, db.IncreaseCollectedAmountParams{
		CollectedAmount: transferAmount,
		ContractAddress: contractAddress,
	})

	tx.Commit(ctx)
	return nil
}
