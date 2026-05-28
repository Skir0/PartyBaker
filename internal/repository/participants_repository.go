package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"
)

func (r *Repository) GetRecipientsOfEvent(ctx context.Context, eventID int32, userId int32) ([]db.GetRecipientsOfCurrentEventRow, error) {
	participants, err := r.query.GetRecipientsOfCurrentEvent(ctx, db.GetRecipientsOfCurrentEventParams{
		EventID: eventID,
		UserID:  userId,
	})

	if err != nil {
		return nil, err
	}
	return participants, nil
}

func (r *Repository) CheckRecipientParticipantForEvent(ctx context.Context, recipientID int32, eventID int32) (bool, error) {
	ans, err := r.query.CheckRecipientParticipantForEvent(ctx, db.CheckRecipientParticipantForEventParams{
		ID:      recipientID,
		EventID: eventID,
	})
	if err != nil {
		fmt.Println(err)
		return false, err
	}

	return ans, nil
}

// GetPayersForRecipient receive list of payers who pay for recipient gift
func (r *Repository) GetPayersForRecipient(ctx context.Context, recipientID int32, eventID int32) ([]db.GetPayersForRecipientRow, error) {
	payers, err := r.query.GetPayersForRecipient(ctx, db.GetPayersForRecipientParams{
		EventID: eventID,
		ID:      recipientID,
	})
	if err != nil {
		fmt.Println("repo err", err)
		return nil, err
	}
	return payers, nil
}

// GetPayersInfoForRecipient receive list of payers info who pay for recipient gift
func (r *Repository) GetPayersInfoForRecipient(ctx context.Context, recipientID int32, eventID int32) ([]db.GetPayersInfoForRecipientRow, error) {
	payers, err := r.query.GetPayersInfoForRecipient(ctx, db.GetPayersInfoForRecipientParams{
		EventID: eventID,
		ID:      recipientID,
	})
	if err != nil {
		fmt.Println("repo err", err)
		return nil, err
	}
	return payers, nil
}
