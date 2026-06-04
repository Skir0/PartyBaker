package repository

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/utils"
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
	rows, err := r.db.Query(ctx, `
		select contract_address
		from gifts
		where contract_address is not null
		  and contract_address <> ''
		  and status in ('active', 'selected')
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var addresses []pgtype.Text
	for rows.Next() {
		var addr pgtype.Text
		if err := rows.Scan(&addr); err != nil {
			return nil, err
		}
		addresses = append(addresses, addr)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return addresses, nil
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

func (r *Repository) GetGiftForDeployment(ctx context.Context, giftID int32, adminID int32) (db.GetGiftForDeploymentRow, error) {
	gift, err := r.query.GetGiftForDeployment(ctx, db.GetGiftForDeploymentParams{
		ID:      giftID,
		AdminID: adminID,
	})
	if err != nil {
		return db.GetGiftForDeploymentRow{}, fmt.Errorf("database error: %w", err)
	}

	return gift, nil
}

func (r *Repository) GetUserWalletAddress(ctx context.Context, userID int64) (string, error) {
	walletAddress, err := r.query.GetUserWalletAddress(ctx, userID)
	if err != nil {
		return "", err
	}
	if !walletAddress.Valid || walletAddress.String == "" {
		return "", fmt.Errorf("wallet address is empty for user %d", userID)
	}
	return walletAddress.String, nil
}

func (r *Repository) SaveGiftDeployment(ctx context.Context, giftID int32, adminID int32, contractAddress string) error {
	err := r.query.SaveGiftForDeployment(ctx, db.SaveGiftForDeploymentParams{
		ContractAddress: utils.ParseJsonString(contractAddress),
		ID:              giftID,
		AdminID:         adminID,
	})
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
	for _, gift := range selectedGifts {
		fmt.Println(gift.ContractAddress)
	}
	if err != nil {
		return []db.Gift{}, fmt.Errorf("error of getting all selected gifts of event : %w", err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return selectedGifts, nil

}

func (r *Repository) GetSelectedGiftsOfEvent(ctx context.Context, eventId int32) ([]db.Gift, error) {

	gifts, err := r.query.GetSelectedGiftsOfEvent(ctx, eventId)
	if err != nil {
		return nil, err
	}
	return gifts, nil

}
