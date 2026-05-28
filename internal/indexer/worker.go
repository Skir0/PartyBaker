package indexer

import (
	"PartyBaker/internal/repository"

	"github.com/xssnick/tonutils-go/ton"
)

type Worker struct {
	repo        *repository.Repository
	api         ton.APIClientWrapped
	activeGifts map[string]bool
}

func NewWorker(repo *repository.Repository, api ton.APIClientWrapped) *Worker {
	return &Worker{
		repo: repo,
		api:  api,
	}
}
