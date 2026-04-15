package api

import (
	"PartyBaker/internal/repository"
	"encoding/json"
	"fmt"
	"net/http"

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

func (h *Handler) GetGifts(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("inside GetGifts")
	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	fmt.Println("currentUserID:", currentUserID)
	if !ok {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	gifts, err := h.repo.GetGifts(request.Context())
	if err != nil {
		fmt.Errorf(err.Error())
		writer.WriteHeader(http.StatusInternalServerError)
	}

	response := ConvertGiftsToResponses(gifts, currentUserID)
	json.NewEncoder(writer).Encode(response)
}

func (h *Handler) CreateGift(writer http.ResponseWriter, request *http.Request) {

}

func (h *Handler) CreateEvent(writer http.ResponseWriter, request *http.Request) {

	fmt.Println("inside CreateEvent")

	eventInfo := &CreateEventRequest{}
	err := json.NewDecoder(request.Body).Decode(eventInfo)
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
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(writer).Encode("success")

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
