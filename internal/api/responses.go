package api

import (
	"PartyBaker/internal/db"
)

type JoinEventResponse struct {
	EventID int32  `json:"event_id"`
	Error   string `json:"error"`
}
type EventResponse struct {
	ID                 int32  `json:"id"`
	Name               string `json:"name"`
	Date               string `json:"date"`
	Deadline           string `json:"deadline"`
	ParticipantsAmount int32  `json:"participants_amount"`
	IsAdmin            bool   `json:"is_admin"`
}

type BasicUserInfoResponse struct {
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type RecipientResponse struct {
	Id        int32  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type GiftInfoResponse struct {
	Id                 int32  `json:"id"`
	Name               string `json:"name"`
	Link               string `json:"link"`
	Status             string `json:"status"`
	ContractAddress    string `json:"contract_address"`
	AdminId            int32  `json:"admin_id"`
	TargetAmount       int32  `json:"target_amount"`
	CollectedAmount    int32  `json:"collected_amount"`
	RecipientId        int32  `json:"recipient_id"`
	Description        string `json:"description"`
	ImageUrl           string `json:"image_url"`
	LikesAmount        int32  `json:"likes_amount"`
	LikedByCurrentUser bool   `json:"liked_by_user"`
}

type GiftResponse struct {
	Id              int32  `json:"id"`
	Name            string `json:"name"`
	Link            string `json:"link"`
	Status          string `json:"status"`
	ContractAddress string `json:"contract_address"`
	AdminId         int32  `json:"admin_id"`
	TargetAmount    int32  `json:"target_amount"`
	CollectedAmount int32  `json:"collected_amount"`
	RecipientId     int32  `json:"recipient_id"`
	Description     string `json:"description"`
	ImageUrl        string `json:"image_url"`
}

func ConvertGiftsInfoToResponses(gifts []db.GetGiftsInfoByRecipientRow) []GiftInfoResponse {

	giftResponses := make([]GiftInfoResponse, len(gifts))

	for i, gift := range gifts {

		giftResponses[i] = GiftInfoResponse{
			Id:                 gift.ID,
			Name:               gift.Name.String,
			Link:               gift.Link.String,
			TargetAmount:       int32(gift.TargetAmount.Int64),
			CollectedAmount:    int32(gift.CollectedAmount.Int64),
			ContractAddress:    gift.ContractAddress.String,
			Status:             gift.Status,
			RecipientId:        gift.RecipientID,
			AdminId:            gift.AdminID,
			Description:        gift.Description.String,
			ImageUrl:           gift.ImageUrl.String,
			LikesAmount:        int32(gift.LikesAmount),
			LikedByCurrentUser: gift.Exists,
		}
	}
	return giftResponses

}

func ConvertGiftsToResponses(gifts []db.Gift) []GiftResponse {

	giftResponses := make([]GiftResponse, len(gifts))

	for i, gift := range gifts {

		giftResponses[i] = GiftResponse{
			Id:              gift.ID,
			Name:            gift.Name.String,
			Link:            gift.Link.String,
			TargetAmount:    int32(gift.TargetAmount.Int64),
			CollectedAmount: int32(gift.CollectedAmount.Int64),
			ContractAddress: gift.ContractAddress.String,
			Status:          gift.Status,
			RecipientId:     gift.RecipientID,
			AdminId:         gift.AdminID,
			Description:     gift.Description.String,
			ImageUrl:        gift.ImageUrl.String,
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
			IsAdmin:            int64(event.AdminID) == currentUserID,
		}
	}
	return eventResponses
}

func ConvertRecipientsToResponses(recipients []db.GetGiftRecipientsOfCurrentEventRow) []RecipientResponse {
	recipientResponses := make([]RecipientResponse, len(recipients))
	for i, recipient := range recipients {
		recipientResponses[i] = RecipientResponse{
			Id:        recipient.ID,
			FirstName: recipient.FirstName.String,
			LastName:  recipient.LastName.String,
		}
	}
	return recipientResponses
}

func ConvertEventToResponse(event db.GetEventInfoByIdRow, currentUserID int64) EventResponse {
	return EventResponse{
		ID:                 event.ID,
		Name:               event.Name.String,
		Date:               event.Date.Time.Format("2006-01-02"),
		Deadline:           event.Deadline.Time.Format("2006-01-02"),
		ParticipantsAmount: event.ParticipantsCount,
		IsAdmin:            int64(event.AdminID) == currentUserID,
	}
}
