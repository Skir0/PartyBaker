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

func (h *Handler) GetPayersForRecipient(writer http.ResponseWriter, request *http.Request) {

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

	payers, err := h.repo.GetPayersForRecipient(request.Context(), int32(recipientID), int32(eventID))
	fmt.Println("payers:", payers)
	if err != nil {
		return
	}
	json.NewEncoder(writer).Encode(responses.ConvertPayersToResponses(payers))

}
