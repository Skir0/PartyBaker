package responses

import (
	"PartyBaker/internal/db"
)

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
