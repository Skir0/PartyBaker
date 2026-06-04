package api

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewRouter(h *Handler) *chi.Mux {
	r := chi.NewRouter()

	// Общие прослойки (Middlewares)
	r.Use(middleware.Logger)    // Логирует все запросы в консоль
	r.Use(middleware.Recoverer) // Чтобы сервер не падал при панике
	// r.Use(CORSConfig())         // Настройка CORS (чтобы React мог достучаться)

	// --- Публичные пути ---
	r.Get("/health", h.HealthCheck)

	// --- Приватные пути (Защищены Telegram Auth) ---
	r.Route("/api", func(r chi.Router) {
		r.Use(h.AuthMiddleware)

		// Работа с пользователем
		r.Get("/user/me", h.GetMyProfile)

		// Работа с подарками
		r.Route("/gifts", func(r chi.Router) {
			r.Route("/{giftId}", func(r chi.Router) {
				r.Get("/currentPayer", h.GetCurrentPayer)

				// for test
				// r.Post("/deploy", h.DeployGiftContract)

				// admin controls
				r.Put("/", h.UpdateGift)
				r.Delete("/", h.DeleteGift)

				r.Get("/", h.GetGiftDetails)        // Детали подарка (из БД)
				r.Get("/live", h.GetGiftLiveStatus) // Прямой запрос в TON
				r.Post("/like", h.AddGiftLike)
				r.Delete("/like", h.RemoveGiftLike)
			})
		})

		// Работа с событиями
		r.Route("/events", func(r chi.Router) {
			r.Post("/join", h.JoinEventByCode)
			r.Post("/create", h.CreateEvent)
			r.Get("/getEvents", h.GetEventsByUserID)

			r.Route("/{eventId}", func(r chi.Router) {

				r.Post("/status", h.ChangeEventStatus)

				// finalize event and it's gifts
				r.Route("/finalize", func(r chi.Router) {
					r.Get("/", h.FinalizeEventGifts)
					r.Get("/selectedGifts", h.GetSelectedGiftsOfEvent)
				})

				// creating gift
				r.Post("/suggestGift", h.CreateGift)

				// admin controls
				r.Put("/", h.UpdateEvent)
				r.Delete("/", h.DeleteEvent)

				// Работа с участниками
				r.Route("/recipients", func(r chi.Router) {
					r.Get("/", h.GetRecipientsOfEvent)
					r.Route("/{recipientId}", func(r chi.Router) {
						r.Get("/gifts", h.GetGiftsInfoByRecipient)
						// работа с плательщиками
						r.Route("/payers", func(r chi.Router) {
							r.Get("/", h.GetPayersInfoForRecipient)
						})
					})
				})
			})

		})
	})

	return r
}
