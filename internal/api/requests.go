package api

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/utils"
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

type ChangeStatusRequest struct {
	Status string `json:"status"`
}
type UpdateEventRequest struct {
	Name     string `json:"name"`
	Date     string `json:"date"`
	Deadline string `json:"deadline"`
}

type UpdateGiftRequest struct {
	Name         string `json:"name"`
	TargetAmount int32  `json:"target_amount"`
	Description  string `json:"description"`
	Url          string `json:"url"`
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

type GiftContractRequest struct {
	Status          int32            `json:"status"`
	TargetAmount    int32            `json:"target_amount"`
	CollectedAmount int32            `json:"collected_amount"`
	AdminAddress    string           `json:"admin_address"`
	Contributors    map[string]int32 `json:"contributors"`
}

type JoinEventByCodeRequest struct {
	JoinCode string `json:"join_code"`
	Role     string `json:"role"`
}

func ConvertEventToParams(event *CreateEventRequest) (db.CreateEventParams, error) {
	fmt.Println("inside ConvertEventToParams")
	if event.Name == "" {
		return db.CreateEventParams{}, errors.New("event name is required")
	}

	date, err := utils.ParseJsonDate(event.Date, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	deadline, err := utils.ParseJsonDate(event.Deadline, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	fmt.Println(db.CreateEventParams{
		Name:     utils.ParseJsonString(event.Name),
		Date:     date,
		Deadline: deadline,
		AdminID:  event.AdminId,
	})

	return db.CreateEventParams{
		Name:     utils.ParseJsonString(event.Name),
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

	date, err := utils.ParseJsonDate(event.Date, time.Now())
	if err != nil {
		return db.UpdateEventParams{}, err
	}

	deadline, err := utils.ParseJsonDate(event.Deadline, time.Now())
	if err != nil {
		return db.UpdateEventParams{}, err
	}

	return db.UpdateEventParams{
		Name:     utils.ParseJsonString(event.Name),
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
		Name:            utils.ParseJsonString(gift.Name),
		Link:            utils.ParseJsonString(gift.Link),
		TargetAmount:    utils.ParseJsonInt(gift.TargetAmount),
		ContractAddress: utils.ParseJsonString(gift.ContractAddress),
		JettonAddress:   utils.ParseJsonString(gift.JettonAddress),
		EventID:         eventId,
		RecipientID:     gift.RecipientId,
		AdminID:         adminId,
		Description:     utils.ParseJsonString(gift.Description),
		ImageUrl:        utils.ParseJsonString(gift.ImageUrl),
	}, nil
}

func ConvertUpdateGiftToParams(gift *UpdateGiftRequest, adminID int32, giftID int32) (db.UpdateGiftParams, error) {
	if gift.Name == "" {
		return db.UpdateGiftParams{}, errors.New("event name is required")
	}

	if gift.TargetAmount <= 0 {
		fmt.Println(gift.TargetAmount)
		return db.UpdateGiftParams{}, errors.New("target amount has to be greater than zero")
	}

	return db.UpdateGiftParams{
		Name:         utils.ParseJsonString(gift.Name),
		TargetAmount: utils.ParseJsonInt(gift.TargetAmount),
		Description:  utils.ParseJsonString(gift.Description),
		Link:         utils.ParseJsonString(gift.Url),
		AdminID:      adminID,
		ID:           giftID,
	}, nil
}
