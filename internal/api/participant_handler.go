package api

import (
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
	if err != nil {
		http.Error(writer, "invalid event id", http.StatusBadRequest)
		return
	}
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}

	recipients, err := h.repo.GetRecipientsOfEvent(request.Context(), int32(eventID))
	if err != nil {
		http.Error(writer, "failed to load recipients", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(ConvertRecipientsToResponses(recipients))

}
