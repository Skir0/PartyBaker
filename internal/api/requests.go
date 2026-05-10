package api

import (
	"PartyBaker/internal/db"
	"errors"
	"fmt"
	"time"
)

type CreateEventRequest struct {
	Name     string `json:"name"`
	Date     string `json:"date"`
	Deadline string `json:"deadline"`
	AdminId  int32  `json:"admin_id"`
}

type UpdateEventRequest struct {
	Name     string `json:"name"`
	Date     string `json:"date"`
	Deadline string `json:"deadline"`
}

type CreateGiftRequest struct {
	Name            string `json:"name"`
	Link            string `json:"link"`
	TargetAmount    int32  `json:"target_amount"`
	ContractAddress string `json:"contract_address"`
	JettonAddress   string `json:"jetton_address"`
	RecipientId     int32  `json:"recipient_id"`
	Description     string `json:"description"`
	ImageUrl        string `json:"image_url"`
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
		Name:     parseJsonString(event.Name),
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId})

	return db.CreateEventParams{
		Name:     parseJsonString(event.Name),
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId,
	}, nil
}

func ConvertUpdateEventToParams(event *UpdateEventRequest, adminID int32, eventID int32) (db.UpdateEventParams, error) {
	if event.Name == "" {
		return db.UpdateEventParams{}, errors.New("event name is required")
	}

	date, err := parseJsonDate(event.Date, time.Now())
	if err != nil {
		return db.UpdateEventParams{}, err
	}

	deadline, err := parseJsonDate(event.Deadline, time.Now())
	if err != nil {
		return db.UpdateEventParams{}, err
	}

	return db.UpdateEventParams{
		Name:     parseJsonString(event.Name),
		Date:     date,
		Deadline: deadline,
		ID:       eventID,
		AdminID:  adminID,
	}, nil
}

func ConvertGiftToParams(gift *CreateGiftRequest, eventId int32, adminId int32) (db.CreateGiftParams, error) {
	if gift.Name == "" {
		return db.CreateGiftParams{}, errors.New("event name is required")
	}

	return db.CreateGiftParams{
		Name:            parseJsonString(gift.Name),
		Link:            parseJsonString(gift.Link),
		TargetAmount:    parseJsonInt(gift.TargetAmount),
		ContractAddress: parseJsonString(gift.ContractAddress),
		JettonAddress:   parseJsonString(gift.JettonAddress),
		EventID:         eventId,
		RecipientID:     gift.RecipientId,
		AdminID:         adminId,
		Description:     parseJsonString(gift.Description),
		ImageUrl:        parseJsonString(gift.ImageUrl),
	}, nil
}
