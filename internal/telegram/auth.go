package telegram

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"sort"
	"strings"
)

// TelegramUser описывает структуру поля "user" в initData
type TelegramUser struct {
	ID           int64  `json:"id"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Username     string `json:"username"`
	LanguageCode string `json:"language_code"`
}

// Validate проверяет подпись Telegram и возвращает ID пользователя.
// Принимает строку initData от фронтенда и BOT_TOKEN из .env
func Validate(initData string, botToken string) (int64, error) {
	// 1. Парсим строку запроса

	// ВРЕМЕННО для тестов в браузере:
	if initData == "" {
		return 12345678, nil // Твой ID для тестов
	}
	params, err := url.ParseQuery(initData)
	if err != nil {
		return 0, fmt.Errorf("failed to parse initData: %w", err)
	}

	// 2. Извлекаем хеш, который прислал Telegram
	receivedHash := params.Get("hash")
	if receivedHash == "" {
		return 0, errors.New("hash not found in initData")
	}

	// 3. Удаляем хеш, чтобы он не участвовал в проверке подписи
	params.Del("hash")

	// 4. Сортируем ключи по алфавиту
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// 5. Собираем проверочную строку (data_check_string)
	// Формат: key1=value1\nkey2=value2...
	var pairs []string
	for _, k := range keys {
		pairs = append(pairs, fmt.Sprintf("%s=%s", k, params.Get(k)))
	}
	dataCheckString := strings.Join(pairs, "\n")

	// 6. Вычисляем секретный ключ
	// secret_key = HMAC_SHA256("WebAppData", botToken)
	sha256Hasher := hmac.New(sha256.New, []byte("WebAppData"))
	sha256Hasher.Write([]byte(botToken))
	secretKey := sha256Hasher.Sum(nil)

	// 7. Вычисляем финальный хеш (подпись)
	// signature = HMAC_SHA256(secret_key, data_check_string)
	hmacHasher := hmac.New(sha256.New, secretKey)
	hmacHasher.Write([]byte(dataCheckString))
	calculatedHash := hex.EncodeToString(hmacHasher.Sum(nil))

	// 8. Сравниваем хеши
	if calculatedHash != receivedHash {
		return 0, errors.New("invalid signature: data is not authentic")
	}

	// 9. Извлекаем ID пользователя из JSON
	userRaw := params.Get("user")
	if userRaw == "" {
		return 0, errors.New("user data not found in initData")
	}

	var tgUser TelegramUser
	if err := json.Unmarshal([]byte(userRaw), &tgUser); err != nil {
		return 0, fmt.Errorf("failed to decode user json: %w", err)
	}

	return tgUser.ID, nil
}
