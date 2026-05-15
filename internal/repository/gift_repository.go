package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

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

func (r *Repository) CreateGift(ctx context.Context, params db.CreateGiftParams) error {
	_, err := r.query.CreateGift(ctx, params)
	fmt.Println("inside repo CreateGift:", params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)
	}
	return nil

}

func (r *Repository) GetAllActiveGiftsAddresses(ctx context.Context) ([]pgtype.Text, error) {
	slice, err := r.query.GetAllActiveGiftsAddresses(ctx)

	if err != nil {
		return nil, err
	}
	return slice, nil
}

func (r *Repository) GetGifts(ctx context.Context) ([]db.Gift, error) {
	slice, err := r.query.GetGifts(ctx)
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

func (r *Repository) UpdateGift(ctx context.Context, params db.UpdateGiftParams) error {
	_, err := r.query.UpdateGift(ctx, params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)

	}
	return nil
}

func (r *Repository) DeleteGift(ctx context.Context, params db.DeleteGiftParams) error {
	rowsAffected, err := r.query.DeleteGift(ctx, params)
	if err != nil {
		return fmt.Errorf("error deleting event in db: %w", err)
	}
	if rowsAffected == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// FinalizeGiftStatusesOfEvent update all most liked gifts of selected event on status 'selected', return it
func (r *Repository) FinalizeGiftStatusesOfEvent(ctx context.Context, eventId int32) ([]db.Gift, error) {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return []db.Gift{}, fmt.Errorf("error begin tx in db: %w", err)
	}
	defer tx.Rollback(ctx)
	qtx := r.query.WithTx(tx)

	err = qtx.FinalizeGiftStatusesOfEvent(ctx, eventId)
	if err != nil {
		return []db.Gift{}, fmt.Errorf("error of finalizing gift statuses of event : %w", err)
	}

	selectedGifts, err := qtx.GetSelectedGiftsOfEvent(ctx, eventId)
	if err != nil {
		return []db.Gift{}, fmt.Errorf("error of getting all selected gifts of event : %w", err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return selectedGifts, nil

}
