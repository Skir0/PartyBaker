package api

import (
	"PartyBaker/internal/db"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func formatInt8(num pgtype.Int8) string {

	if !num.Valid {
		return "0.00"
	}
	val := float64(num.Int64) / 1_000_000.0
	return fmt.Sprintf("%.2f", val)
}

func parseJsonDate(dateStr string, check time.Time) (pgtype.Timestamptz, error) {

	date, _ := time.Parse("2006-01-02", dateStr)
	if date.Before(check) {
		return pgtype.Timestamptz{}, errors.New("date out of range")
	}

	return pgtype.Timestamptz{
		Time:  date,
		Valid: true,
	}, nil
}

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

type BasicUserInfoResponse struct {
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type CreateEventRequest struct {
	Name     string `json:"name"`
	Date     string `json:"date"`
	Deadline string `json:"deadline"`
	AdminId  int32  `json:"admin_id"`
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

func ConvertEventToParams(event *CreateEventRequest) (db.CreateEventParams, error) {
	fmt.Println("inside ConvertEventToParams")
	if event.Name == "" {
		return db.CreateEventParams{}, errors.New("event name is required")
	}

	date, err := parseJsonDate(event.Date, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	deadline, err := parseJsonDate(event.Deadline, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	fmt.Println(db.CreateEventParams{
		Name: pgtype.Text{
			String: event.Name,
			Valid:  true,
		},
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId})

	return db.CreateEventParams{
		Name: pgtype.Text{
			String: event.Name,
			Valid:  true,
		},
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId,
	}, nil
}
