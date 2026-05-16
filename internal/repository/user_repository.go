package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) GetUserBasicInfo(ctx context.Context, id int64) (db.GetUserBasicInfoRow, error) {
	userInfo, err := r.query.GetUserBasicInfo(ctx, id)
	if err != nil {
		return db.GetUserBasicInfoRow{}, err
	}
	return userInfo, nil
}

func (r *Repository) GetGiftsInfoByRecipient(ctx context.Context, userID int32, eventID int32, recipientID int32) ([]db.GetGiftsInfoByRecipientRow, error) {

	response, err := r.query.GetGiftsInfoByRecipient(ctx, db.GetGiftsInfoByRecipientParams{
		UserID:      userID,
		EventID:     eventID,
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

func (r *Repository) JoinEventByCode(ctx context.Context, userId int32, eventCode pgtype.Text, role pgtype.Text) (int32, error) {
	eventId, err := r.query.GetEventIdByJoinCode(ctx, eventCode)
	if err != nil {
		return -1, fmt.Errorf("event with this join code does not exist: %w", err)
	}
	exists, err := r.query.CheckParticipantExists(ctx, db.CheckParticipantExistsParams{
		UserID:  userId,
		EventID: eventId,
	})
	if err != nil {
		return -1, fmt.Errorf("error checking participant exists: %w", err)
	}
	if exists {

		return -1, fmt.Errorf("user is already a participant of this event: %w", err)
	}
	_, err = r.query.CreateParticipant(ctx, db.CreateParticipantParams{
		Role:    role,
		UserID:  userId,
		EventID: eventId,
	})
	if err != nil {
		return -1, fmt.Errorf("error create participant in db: %w", err)
	}
	return eventId, nil
}
