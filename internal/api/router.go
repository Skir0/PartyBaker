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
			r.Get("/", h.GetGifts)                   // Список всех подарков
			r.Post("/", h.CreateGift)                // Создать (зарегистрировать деплой)
			r.Get("/{id}", h.GetGiftDetails)         // Детали подарка (из БД)
			r.Get("/{id}/live", h.GetGiftLiveStatus) // Прямой запрос в TON
		})

		// Работа с событиями
		r.Route("/events", func(r chi.Router) {
			r.Post("/create", h.CreateEvent)
			r.Get("/getEvents", h.GetEventsByUserID)
		})
	})

	return r
}
