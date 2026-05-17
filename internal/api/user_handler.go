package api

import (
	"PartyBaker/internal/api/responses"
	"encoding/json"
	"fmt"
	"net/http"
)

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
	response := &responses.BasicUserInfoResponse{
		Username:  userInfo.Username.String,
		FirstName: userInfo.FirstName.String,
		LastName:  userInfo.LastName.String,
	}
	json.NewEncoder(writer).Encode(response)
}
