package api

import (
	"PartyBaker/internal/api/responses"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (h *Handler) GetRecipientsOfEvent(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside GetGiftRecipientsOfEvent")
	idParam := chi.URLParam(request, "eventId")
	eventID, err := strconv.Atoi(idParam)

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}

	recipients, err := h.repo.GetRecipientsOfEvent(request.Context(), int32(eventID), int32(currentUserID))
	if err != nil {
		http.Error(writer, "failed to load recipients", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(responses.ConvertRecipientsToResponses(recipients))

}

func (h *Handler) GetPayersInfoForRecipient(writer http.ResponseWriter, request *http.Request) {

	fmt.Println("inside GetPayersForRecipient")
	eventParam := chi.URLParam(request, "eventId")
	eventID, err := strconv.Atoi(eventParam)
	if err != nil {
		http.Error(writer, "invalid event id", http.StatusBadRequest)
		return
	}
	recipientParam := chi.URLParam(request, "recipientId")
	recipientID, err := strconv.Atoi(recipientParam)

	fmt.Println("recipientID:", recipientID)
	fmt.Println("eventID:", eventID)

	if err != nil {
		http.Error(writer, "invalid recipient id", http.StatusBadRequest)
		return
	}

	payers, err := h.repo.GetPayersInfoForRecipient(request.Context(), int32(recipientID), int32(eventID))
	fmt.Println("payers:", payers)
	if err != nil {
		return
	}
	json.NewEncoder(writer).Encode(responses.ConvertPayersInfoToResponses(payers))

}

func (h *Handler) GetCurrentPayer(writer http.ResponseWriter, request *http.Request) {

	fmt.Println("inside GetCurrentPayer")
	giftParam := chi.URLParam(request, "giftId")
	giftID, err := strconv.Atoi(giftParam)
	if err != nil {
		fmt.Println("invalid gift id")
		http.Error(writer, "invalid gift id", http.StatusBadRequest)
		return
	}
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)

	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		fmt.Println("unauthorized")
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}

	payer, err := h.repo.GetCurrentPayer(request.Context(), int32(giftID), currentUserID)
	if err != nil {
		fmt.Println("failed to load recipients", err.Error())
		http.Error(writer, "failed to load current payer", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(writer).Encode(responses.ConvertPayerInfoToResponse(payer))
}
