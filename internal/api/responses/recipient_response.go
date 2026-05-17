package responses

import "PartyBaker/internal/db"

type RecipientResponse struct {
	Id        int32  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type PayerResponse struct {
	Id        int32  `json:"id"`
	UserId    int32  `json:"user_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	EventID   int32  `json:"event_id"`
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

func ConvertPayersToResponses(payers []db.GetPayersForRecipientRow) []RecipientResponse {
	recipientResponses := make([]RecipientResponse, len(payers))
	for i, payer := range payers {
		recipientResponses[i] = RecipientResponse{
			Id:        payer.ID,
			FirstName: payer.FirstName.String,
			LastName:  payer.LastName.String,
		}
	}
	return recipientResponses
}
