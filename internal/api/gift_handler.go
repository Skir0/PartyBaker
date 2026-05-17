package api

import (
	"PartyBaker/internal/db"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
)

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

	// does current gift recipient participate in event
	ans, err := h.repo.CheckRecipientParticipantForEvent(request.Context(), giftInfo.RecipientId, int32(eventID))
	if err != nil {
		fmt.Println(err)
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !ans {
		fmt.Println("eventID not found in repo")
		http.Error(writer, "invalid recipient for event", http.StatusBadRequest)
		return
	}

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

func (h *Handler) GetGiftsInfoByRecipient(writer http.ResponseWriter, request *http.Request) {

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}

	eventParam := chi.URLParam(request, "eventId")

	eventID, err := strconv.Atoi(eventParam)

	recipientParam := chi.URLParam(request, "recipientId")

	recipientID, err := strconv.Atoi(recipientParam)
	if err != nil {
		http.Error(writer, "invalid recipient_id", http.StatusBadRequest)
		return
	}
	info, err := h.repo.GetGiftsInfoByRecipient(request.Context(), int32(currentUserID), int32(eventID), int32(recipientID))
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

func (h *Handler) FinalizeEventGifts(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside finalizeEventGifts")
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}
	eventParam := chi.URLParam(request, "eventId")
	eventId, err := strconv.Atoi(eventParam)
	if err != nil {
		http.Error(writer, "invalid eventId", http.StatusBadRequest)
		return
	}

	// get and convert event info
	eventInfo, err := h.repo.GetEventInfoById(request.Context(), int32(eventId))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(writer, "event not found", http.StatusNotFound)
			return
		}
		fmt.Println(err)
		http.Error(writer, "failed to load event", http.StatusInternalServerError)
		return
	}

	// finalize check
	if FinalizeCheckProblem(eventInfo, int32(currentUserID), writer) {
		return
	}

	// finalizing event and get most liked gifts
	selectedGiftsInfo, err := h.repo.FinalizeGiftStatusesOfEvent(request.Context(), int32(eventId))
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "failed to finalize event gifts", http.StatusInternalServerError)
		return
	}
	writer.Header().Set("Content-Type", "application/json")
	json.NewEncoder(writer).Encode(ConvertGiftsToResponses(selectedGiftsInfo))
}
