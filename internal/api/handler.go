package api

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/repository"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"github.com/xssnick/tonutils-go/ton"
)

type Handler struct {
	repo     *repository.Repository
	api      ton.APIClientWrapped
	botToken string
}

func NewHandler(repo *repository.Repository, api ton.APIClientWrapped, botToken string) *Handler {
	return &Handler{
		repo:     repo,
		api:      api,
		botToken: botToken,
	}
}

func (h *Handler) HealthCheck(writer http.ResponseWriter, request *http.Request) {
	writer.Write([]byte("OK"))
}

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

func (h *Handler) CreateGift(writer http.ResponseWriter, request *http.Request) {

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

	idParam := chi.URLParam(request, "id")
	eventID, err := strconv.Atoi(idParam)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode("invalid event id")
		return
	}

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	eventInfo := &UpdateEventRequest{}
	err = json.NewDecoder(request.Body).Decode(eventInfo)
	if err != nil {
		fmt.Errorf(err.Error())
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	updateParams, err := ConvertUpdateEventToParams(eventInfo, int32(currentUserID), int32(eventID))
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(err.Error())
		return
	}

	err = h.repo.UpdateEvent(request.Context(), updateParams)
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

}

func (h *Handler) DeleteEvent(writer http.ResponseWriter, request *http.Request) {
	idParam := chi.URLParam(request, "id")
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

func (h *Handler) GetGiftDetails(writer http.ResponseWriter, request *http.Request) {

}

func (h *Handler) GetGiftLiveStatus(writer http.ResponseWriter, request *http.Request) {

}

func (h *Handler) GetMyProfile(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside GetMyProfile")
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	userInfo, err := h.repo.GetUserBasicInfo(request.Context(), currentUserID)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
	}
	response := &BasicUserInfoResponse{
		Username:  userInfo.Username.String,
		FirstName: userInfo.FirstName.String,
		LastName:  userInfo.LastName.String,
	}
	json.NewEncoder(writer).Encode(response)
}

func (h *Handler) GetGiftRecipientsOfEvent(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside GetGiftRecipientsOfEvent")
	idParam := chi.URLParam(request, "id")
	eventID, err := strconv.Atoi(idParam)
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	recipients, err := h.repo.GetGiftRecipientsOfEvent(request.Context(), int32(eventID))
	response := ConvertRecipientsToResponses(recipients)

	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(writer).Encode(response)
	writer.WriteHeader(http.StatusCreated)

}

func (h *Handler) GetAllGiftsOfRecipient(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside GetAllGiftsOfRecipient")
	idParam := chi.URLParam(request, "recipient_id")
	recipientId, err := strconv.Atoi(idParam)
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)

	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	gifts, err := h.repo.GetAllGiftsOfRecipient(request.Context(), int32(recipientId))
	response := ConvertGiftsToResponses(gifts)

	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(writer).Encode(response)
	writer.WriteHeader(http.StatusCreated)

}
