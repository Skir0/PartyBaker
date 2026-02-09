package repository

import (
	"PartyBaker/internal/db"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	query *db.Queries
	db    *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		query: db.New(pool),
		db:    pool,
	}
}

func (r *Repository) CancelGift(ctx context.Context, giftContractAddress pgtype.Text) error {

	result, err := r.query.CancelGiftByContract(ctx, giftContractAddress)
	if err != nil {
		return fmt.Errorf("database error: %w", err)
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("gift not found or already cancelled/paid")
	}

	log.Printf("Gift %s marked as cancelled in DB", giftContractAddress.String)
	return nil
}

func (r *Repository) GetAllActiveGiftsAddresses(ctx context.Context) ([]pgtype.Text, error) {
	slice, err := r.query.GetAllActiveGiftsAddresses(ctx)
	if err != nil {
		return nil, err
	}
	return slice, nil
}

//func (r *Repository) ChangeAdmin(ctx context.Context, giftContractAddress pgtype.Text,
//	userWalletAddress pgtype.Text) error {
//
//	userId, err := r.query.GetUserByWallet(ctx, userWalletAddress)
//	if err != nil {
//		return err
//	}
//
//}
