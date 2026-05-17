package api

import (
	"PartyBaker/internal/db"
	"fmt"
	"net/http"
	"time"
)

func FinalizeCheckProblem(event db.GetEventInfoByIdRow, userId int32, writer http.ResponseWriter) bool {

	if !(event.AdminID == userId) {
		writer.WriteHeader(http.StatusForbidden)
		fmt.Println("user is not admin")
		return true
	}
	if event.Deadline.Time.After(time.Now()) {
		writer.WriteHeader(http.StatusConflict)
		fmt.Println("there is no deadline now")
		return true
	}
	return false
}
