package api

import (
	"PartyBaker/internal/telegram"
	"context"
	"fmt"
	"net/http"
	"os"
)

// Определяем уникальный ключ для хранения ID пользователя в контексте
type contextKey string

const UserIDKey contextKey = "user_id"

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("inside AuthMiddleware")

		if os.Getenv("APP_ENV") == "development" {
			ctx := context.WithValue(r.Context(), UserIDKey, int64(12345678))
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// 1. Достаем строку авторизации из заголовка, который мы настроили в React
		tgData := r.Header.Get("X-TG-Data")

		if tgData == "" {
			http.Error(w, "Unauthorized: No Telegram data provided", http.StatusUnauthorized)
			return
		}
		fmt.Println("RECEIVED DATA:", tgData)

		// 2. Вызываем логику проверки (которую мы написали в internal/telegram/auth.go)
		// Передаем токен бота, который должен быть в структуре Handler
		userID, err := telegram.Validate(tgData, h.botToken)

		if err != nil {
			// Если подпись неверна или данные устарели — возвращаем 401
			http.Error(w, "Unauthorized: Invalid signature", http.StatusUnauthorized)
			return
		}

		// 3. Если всё ок, создаем новый контекст с ID пользователя
		ctx := context.WithValue(r.Context(), UserIDKey, userID)

		// 4. Передаем запрос дальше по цепочке, но уже с ID внутри контекста
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
