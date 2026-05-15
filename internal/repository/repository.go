package repository

import (
	"PartyBaker/internal/db"

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
