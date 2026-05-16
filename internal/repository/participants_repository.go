package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"
)

func (r *Repository) GetRecipientsOfEvent(ctx context.Context, eventID int32) ([]db.GetGiftRecipientsOfCurrentEventRow, error) {
	participants, err := r.query.GetGiftRecipientsOfCurrentEvent(ctx, eventID)
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
