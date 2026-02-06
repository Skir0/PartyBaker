package repository

import (
	"PartyBaker/internal/db"
	"context"

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

func (r *Repository) IsGiftContractActive(ctx context.Context, contractAddress pgtype.Text) (bool, error) {
	return r.query.IsGiftContractAddress(ctx, contractAddress)
}
