package api

import (
	"PartyBaker/internal/repository"
	"net/http"

	"github.com/xssnick/tonutils-go/ton"
)

type Handler struct {
	repo     *repository.Repository
	api      ton.APIClientWrapped
	botToken string
}

func NewHandler(repo *repository.Repository, api ton.APIClientWrapped, botToken string) *Handler {
	return &Handler{
		repo:     repo,
		api:      api,
		botToken: botToken,
	}
}

func (h *Handler) HealthCheck(writer http.ResponseWriter, request *http.Request) {
	writer.Write([]byte("OK"))
}
