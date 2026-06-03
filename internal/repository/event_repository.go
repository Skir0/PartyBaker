package repository

import (
	"PartyBaker/internal/db"
	"PartyBaker/internal/utils"
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) GetEventJoinCode(ctx context.Context) (pgtype.Text, error) {
	for i := 0; i < 5; i++ {
		code, err := utils.GenerateCode()
		if err != nil {
			fmt.Println(err)
		}
		exists, _ := r.query.CheckEventJoinCodeExists(ctx, utils.ParseJsonString(code))
		if !exists {
			return utils.ParseJsonString(code), nil
		}
	}
	return pgtype.Text{}, fmt.Errorf("could not generate event code")
}

func (r *Repository) CreateEvent(ctx context.Context, params db.CreateEventParams) error {
	fmt.Println("inside repo CreateEvent:", params)

	joinCode, err := r.GetEventJoinCode(ctx)
	if err != nil {
		return err
	}
	params.JoinCode = joinCode
	_, err = r.query.CreateEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)
	}
	return nil

}

func (r *Repository) GetEventsInfoByUserId(ctx context.Context, userId int32) ([]db.GetEventsInfoByUserIDRow, error) {
	eventsInfo, err := r.query.GetEventsInfoByUserID(ctx, userId)
	if err != nil {
		return nil, err
	}

	return eventsInfo, nil

}

func (r *Repository) GetEventInfoById(ctx context.Context, eventId int32) (db.GetEventInfoByIdRow, error) {
	eventInfo, err := r.query.GetEventInfoById(ctx, eventId)
	if err != nil {
		return db.GetEventInfoByIdRow{}, err
	}

	return eventInfo, nil
}

func (r *Repository) UpdateEvent(ctx context.Context, params db.UpdateEventParams) error {
	_, err := r.query.UpdateEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("database error: %w", err)

	}
	return nil
}

func (r *Repository) DeleteEvent(ctx context.Context, params db.DeleteEventParams) error {
	rowsAffected, err := r.query.DeleteEvent(ctx, params)
	if err != nil {
		return fmt.Errorf("error deleting event in db: %w", err)
	}
	if rowsAffected == 0 {
		return pgx.ErrNoRows
	}

	return nil
}

func (r *Repository) ChangeEventStatus(ctx context.Context, params db.ChangeEventStatusParams) error {

	err := r.query.ChangeEventStatus(ctx, db.ChangeEventStatusParams{
		ID:     params.ID,
		Status: params.Status,
	})
	if err != nil {
		return err
	}
	return nil
}
