package responses

import "PartyBaker/internal/db"

type EventResponse struct {
	ID                 int32  `json:"id"`
	Name               string `json:"name"`
	Date               string `json:"date"`
	Deadline           string `json:"deadline"`
	ParticipantsAmount int32  `json:"participants_amount"`
	IsAdmin            bool   `json:"is_admin"`
	Status             string `json:"status"`
}

func ConvertEventsToResponses(events []db.GetEventsInfoByUserIDRow, currentUserID int64) []EventResponse {
	eventResponses := make([]EventResponse, len(events))
	for i, event := range events {
		eventResponses[i] = EventResponse{
			ID:                 event.ID,
			Name:               event.Name.String,
			Date:               event.Date.Time.Format("2006-01-02"),
			Deadline:           event.Deadline.Time.Format("2006-01-02"),
			ParticipantsAmount: event.ParticipantsCount,
			IsAdmin:            int64(event.AdminID) == currentUserID,
			Status:             event.Status.String,
		}
	}
	return eventResponses
}

func ConvertEventToResponse(event db.GetEventInfoByIdRow, currentUserID int64) EventResponse {
	return EventResponse{
		ID:                 event.ID,
		Name:               event.Name.String,
		Date:               event.Date.Time.Format("2006-01-02"),
		Deadline:           event.Deadline.Time.Format("2006-01-02"),
		ParticipantsAmount: event.ParticipantsCount,
		IsAdmin:            int64(event.AdminID) == currentUserID,
	}
}

type JoinEventResponse struct {
	EventID int32  `json:"event_id"`
	Error   string `json:"error"`
}
