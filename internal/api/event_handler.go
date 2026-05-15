package api

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/utils"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
)

func (h *Handler) GetEventsByUserID(writer http.ResponseWriter, request *http.Request) {

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	eventsInfo, err := h.repo.GetEventsInfoByUserId(request.Context(), int32(currentUserID))
	if err != nil {
		fmt.Errorf(err.Error())
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	response := ConvertEventsToResponses(eventsInfo, currentUserID)
	json.NewEncoder(writer).Encode(response)
}

func (h *Handler) CreateEvent(writer http.ResponseWriter, request *http.Request) {

	fmt.Println("inside CreateEvent")

	eventInfo := &CreateEventRequest{}
	err := json.NewDecoder(request.Body).Decode(eventInfo)
	if err != nil {
		fmt.Errorf(err.Error())
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println("eventInfo:", eventInfo)

	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	eventParams, err := ConvertEventToParams(eventInfo)
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
	}
	err = h.repo.CreateEvent(request.Context(), eventParams)
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	writer.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(writer).Encode("success")

}

func (h *Handler) UpdateEvent(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside UpdateEvent")
	idStr := chi.URLParam(request, "eventId")
	id, err := strconv.Atoi(idStr)
	currentUserID, _ := request.Context().Value(UserIDKey).(int64)

	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	eventInfo := &UpdateEventRequest{}
	if err := json.NewDecoder(request.Body).Decode(eventInfo); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	params, err := ConvertUpdateEventToParams(eventInfo,
		int32(currentUserID), int32(id))
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	err = h.repo.UpdateEvent(request.Context(), params)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteEvent(writer http.ResponseWriter, request *http.Request) {
	idParam := chi.URLParam(request, "eventId")
	eventID, err := strconv.Atoi(idParam)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode("invalid event id")
		return
	}

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = h.repo.DeleteEvent(request.Context(), db.DeleteEventParams{
		ID:      int32(eventID),
		AdminID: int32(currentUserID),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusForbidden)
			json.NewEncoder(writer).Encode("event not found or access denied")
			return
		}

		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(err.Error())
		return
	}

	writer.WriteHeader(http.StatusNoContent)
}

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

func (h *Handler) JoinEventByCode(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside JoinEventByCode")
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
	}

	joinUserInfo := &JoinEventByCodeRequest{}
	if err := json.NewDecoder(request.Body).Decode(joinUserInfo); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	eventId, err := h.repo.JoinEventByCode(request.Context(), int32(currentUserID),
		utils.ParseJsonString(joinUserInfo.JoinCode),
		utils.ParseJsonString(joinUserInfo.Role))

	if err != nil {
		json.NewEncoder(writer).Encode(JoinEventResponse{eventId, err.Error()})
		return
	}

}
