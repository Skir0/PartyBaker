package api

import (
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func formatInt8(num pgtype.Int8) string {

	if !num.Valid {
		return "0.00"
	}
	val := float64(num.Int64) / 1_000_000.0
	return fmt.Sprintf("%.2f", val)
}

func parseJsonDate(dateStr string, check time.Time) (pgtype.Timestamptz, error) {

	date, _ := time.Parse("2006-01-02", dateStr)
	if date.Before(check) {
		return pgtype.Timestamptz{}, errors.New("date out of range")
	}

	return pgtype.Timestamptz{
		Time:  date,
		Valid: true,
	}, nil
}

func parseJsonInt(num int32) pgtype.Int8 {
	return pgtype.Int8{
		Int64: int64(num),
		Valid: true,
	}
}

func parseJsonString(str string) pgtype.Text {
	return pgtype.Text{
		String: str,
		Valid:  true,
	}
}
