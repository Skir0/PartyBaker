package api

import (
	"PartyBaker/internal/db"
)

type GiftResponse struct {
	ID          int32  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"` // omitempty скроет поле, если оно пустое
	Link        string `json:"link"`

	// Блок сумм
	TargetAmount    string  `json:"target_amount"`
	CollectedAmount string  `json:"collected_amount"`
	Progress        float64 `json:"progress"`

	// Блок блокчейна
	ContractAddress string `json:"contract_address"`
	Status          string `json:"status"`

	// Блок участников
	RecipientName string `json:"recipient_name"`
	IsAdmin       bool   `json:"is_admin"`
}

type EventResponse struct {
	ID                 int32  `json:"id"`
	Name               string `json:"name"`
	Date               string `json:"date"`
	Deadline           string `json:"deadline"`
	ParticipantsAmount int32  `json:"participants_amount"`
}

type BasicUserInfoResponse struct {
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

func ConvertGiftsToResponses(gifts []db.Gift, currentUserID int64) []GiftResponse {

	giftResponses := make([]GiftResponse, len(gifts))

	for i, gift := range gifts {

		target := formatInt8(gift.TargetAmount)
		collected := formatInt8(gift.CollectedAmount)

		var progress float64 = 0
		if gift.TargetAmount.Int64 > 0 {
			progress = (float64(gift.CollectedAmount.Int64) / float64(gift.TargetAmount.Int64)) * 100
		}

		giftResponses[i] = GiftResponse{
			ID:              gift.ID,
			Name:            gift.Name.String,
			Description:     "",
			Link:            gift.Link.String,
			TargetAmount:    target,
			CollectedAmount: collected,
			Progress:        progress,
			ContractAddress: gift.ContractAddress.String,
			Status:          gift.Status,
			// test
			RecipientName: "",
			IsAdmin:       int64(gift.AdminID) == currentUserID,
		}
	}
	return giftResponses

}

func ConvertEventsToResponses(events []db.GetEventsInfoByUserIDRow, currentUserID int64) []EventResponse {
	eventResponses := make([]EventResponse, len(events))
	for i, event := range events {

		eventResponses[i] = EventResponse{
			ID:                 event.ID,
			Name:               event.Name.String,
			Date:               event.Date.Time.Format("2006-01-02"),
			Deadline:           event.Deadline.Time.Format("2006-01-02"),
			ParticipantsAmount: event.ParticipantsCount,
		}
	}
	return eventResponses
}
