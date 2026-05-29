package responses

import (
	"PartyBaker/internal/db"
	"fmt"
)

type RecipientResponse struct {
	Id            int32  `json:"id"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	WalletAddress string `json:"wallet_address"`
}

type PayerResponse struct {
	Id        int32  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	IsPaid    bool   `json:"is_paid"`
	Amount    int32  `json:"amount"`
}

func ConvertRecipientsToResponses(recipients []db.GetRecipientsOfCurrentEventRow) []RecipientResponse {
	recipientResponses := make([]RecipientResponse, len(recipients))
	for i, recipient := range recipients {
		fmt.Println("addr", recipient.WalletAddress.String)
		recipientResponses[i] = RecipientResponse{
			Id:            recipient.ID,
			FirstName:     recipient.FirstName.String,
			LastName:      recipient.LastName.String,
			WalletAddress: recipient.WalletAddress.String,
		}
	}
	return recipientResponses
}

func ConvertPayersInfoToResponses(payers []db.GetPayersInfoForRecipientRow) []PayerResponse {
	recipientResponses := make([]PayerResponse, len(payers))
	for i, payer := range payers {
		recipientResponses[i] = PayerResponse{
			Id:        payer.ID,
			FirstName: payer.FirstName.String,
			LastName:  payer.LastName.String,
			IsPaid:    payer.IsPaid.Bool,
			Amount:    int32(payer.Amount.Int64),
		}
	}
	return recipientResponses
}

func ConvertPayerInfoToResponse(payer db.GetCurrentPayerInfoRow) PayerResponse {
	payerResponse := PayerResponse{
		Id:        payer.ID,
		FirstName: payer.FirstName.String,
		LastName:  payer.LastName.String,
		IsPaid:    payer.IsPaid.Bool,
		Amount:    int32(payer.Amount.Int64),
	}
	return payerResponse
}
