package api

import (
	"PartyBaker/internal/db"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type CreateEventRequest struct {
	Name     string `json:"name"`
	Date     string `json:"date"`
	Deadline string `json:"deadline"`
	AdminId  int32  `json:"admin_id"`
}

func ConvertEventToParams(event *CreateEventRequest) (db.CreateEventParams, error) {
	fmt.Println("inside ConvertEventToParams")
	if event.Name == "" {
		return db.CreateEventParams{}, errors.New("event name is required")
	}

	date, err := parseJsonDate(event.Date, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	deadline, err := parseJsonDate(event.Deadline, time.Now())
	if err != nil {
		return db.CreateEventParams{}, err
	}

	fmt.Println(db.CreateEventParams{
		Name: pgtype.Text{
			String: event.Name,
			Valid:  true,
		},
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId})

	return db.CreateEventParams{
		Name: pgtype.Text{
			String: event.Name,
			Valid:  true,
		},
		Date:     date,
		Deadline: deadline,
		// for test, in general we have to use user profile
		AdminID: event.AdminId,
	}, nil
}
