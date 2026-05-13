package repository

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/utils"

	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
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

func (r *Repository) GetEventJoinCode(ctx context.Context) (pgtype.Text, error) {
	for i := 0; i < 5; i++ {
		code, err := utils.GenerateCode()
		if err != nil {
			fmt.Println(err)
		}
		exists, _ := r.query.CheckEventJoinCodeExists(ctx, utils.ParseJsonString(code))
		if !exists {
			return utils.ParseJsonString(code), nil
		}
	}
	return pgtype.Text{}, fmt.Errorf("could not generate event code")
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

func (r *Repository) CreateEvent(ctx context.Context, params db.CreateEventParams) error {
	fmt.Println("inside repo CreateEvent:", params)

	joinCode, err := r.GetEventJoinCode(ctx)
	if err != nil {
		return err
	}
	params.JoinCode = joinCode
	_, err = r.query.CreateEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)
	}
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

func (r *Repository) GetUserBasicInfo(ctx context.Context, id int64) (db.GetUserBasicInfoRow, error) {
	userInfo, err := r.query.GetUserBasicInfo(ctx, id)
	if err != nil {
		return db.GetUserBasicInfoRow{}, err
	}
	return userInfo, nil
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

func (r *Repository) GetEventsInfoByUserId(ctx context.Context, userId int32) ([]db.GetEventsInfoByUserIDRow, error) {
	eventsInfo, err := r.query.GetEventsInfoByUserID(ctx, userId)
	if err != nil {
		return nil, err
	}

	return eventsInfo, nil

}

func (r *Repository) UpdateEvent(ctx context.Context, params db.UpdateEventParams) error {
	_, err := r.query.UpdateEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)

	}
	return nil
}

func (r *Repository) DeleteEvent(ctx context.Context, params db.DeleteEventParams) error {
	rowsAffected, err := r.query.DeleteEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("error deleting event in db: %w", err)
	}
	if rowsAffected == 0 {
		return pgx.ErrNoRows
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

func (r *Repository) GetRecipientsOfEvent(ctx context.Context, eventID int32) ([]db.GetGiftRecipientsOfCurrentEventRow, error) {
	participants, err := r.query.GetGiftRecipientsOfCurrentEvent(ctx, eventID)
	if err != nil {
		return nil, err
	}
	return participants, nil
}

func (r *Repository) GetGiftsInfoByRecipient(ctx context.Context, userID int32, recipientID int32) ([]db.GetGiftsInfoByRecipientRow, error) {

	response, err := r.query.GetGiftsInfoByRecipient(ctx, db.GetGiftsInfoByRecipientParams{
		UserID:      userID,
		RecipientID: recipientID,
	})
	if err != nil {
		return nil, err
	}
	return response, nil

}

func (r *Repository) AddGiftLike(ctx context.Context, userID int32, giftID int32) error {
	err := r.query.AddGiftLike(ctx, db.AddGiftLikeParams{
		UserID: userID,
		GiftID: giftID,
	})
	if err != nil {
		return fmt.Errorf("error add gift like in db: %w", err)
	}
	return nil
}

func (r *Repository) RemoveGiftLike(ctx context.Context, userID int32, giftID int32) error {
	err := r.query.RemoveGiftLike(ctx, db.RemoveGiftLikeParams{
		UserID: userID,
		GiftID: giftID,
	})
	if err != nil {
		return fmt.Errorf("error remove gift like in db: %w", err)
	}
	return nil
}
