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

	fmt.Println("inside CreateGift")

	giftInfo := &CreateGiftRequest{}
	err := json.NewDecoder(request.Body).Decode(giftInfo)
	if err != nil {
		fmt.Println(err.Error())
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println("giftInfo:", giftInfo)

	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	idParam := chi.URLParam(request, "eventId")
	eventID, err := strconv.Atoi(idParam)

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	giftParams, err := ConvertGiftToParams(giftInfo, int32(eventID), int32(currentUserID))
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
	}
	err = h.repo.CreateGift(request.Context(), giftParams)
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	writer.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(writer).Encode("success")

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

func (h *Handler) UpdateGift(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside UpdateGift")
	idStr := chi.URLParam(request, "giftId")
	giftID, err := strconv.Atoi(idStr)
	currentUserID, _ := request.Context().Value(UserIDKey).(int64)

	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	giftInfo := &UpdateGiftRequest{}
	if err := json.NewDecoder(request.Body).Decode(giftInfo); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	params, err := ConvertUpdateGiftToParams(giftInfo,
		int32(currentUserID), int32(giftID))
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	err = h.repo.UpdateGift(request.Context(), params)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteGift(writer http.ResponseWriter, request *http.Request) {
	idParam := chi.URLParam(request, "giftId")
	giftID, err := strconv.Atoi(idParam)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode("invalid gift id")
		return
	}

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = h.repo.DeleteGift(request.Context(), db.DeleteGiftParams{
		ID:      int32(giftID),
		AdminID: int32(currentUserID),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusForbidden)
			json.NewEncoder(writer).Encode("gift not found or access denied")
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

func (h *Handler) GetGiftsInfoByRecipient(writer http.ResponseWriter, request *http.Request) {

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}
	recipientParam := chi.URLParam(request, "recipientId")

	recipientID, err := strconv.Atoi(recipientParam)
	if err != nil {
		http.Error(writer, "invalid recipient_id", http.StatusBadRequest)
		return
	}
	info, err := h.repo.GetGiftsInfoByRecipient(request.Context(), int32(currentUserID), int32(recipientID))
	if err != nil {
		return
	}
	json.NewEncoder(writer).Encode(ConvertGiftsInfoToResponses(info))

}

func (h *Handler) AddGiftLike(writer http.ResponseWriter, request *http.Request) {

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}
	giftParam := chi.URLParam(request, "giftId")

	giftID, err := strconv.Atoi(giftParam)
	if err != nil {
		http.Error(writer, "invalid giftID", http.StatusBadRequest)
		return
	}
	err = h.repo.AddGiftLike(request.Context(), int32(currentUserID), int32(giftID))
	if err != nil {
		return
	}
}

func (h *Handler) RemoveGiftLike(writer http.ResponseWriter, request *http.Request) {

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}
	giftParam := chi.URLParam(request, "giftId")

	giftID, err := strconv.Atoi(giftParam)
	if err != nil {
		http.Error(writer, "invalid giftID", http.StatusBadRequest)
		return
	}
	err = h.repo.RemoveGiftLike(request.Context(), int32(currentUserID), int32(giftID))
	if err != nil {
		return
	}
}
