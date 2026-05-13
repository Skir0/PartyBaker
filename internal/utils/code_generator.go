package utils

import (
	"crypto/rand"
	"math/big"
)

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

func GenerateCode() (string, error) {
	length := 6
	code := make([]byte, length)

	for i := 0; i < length; i++ {
		index, err := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		if err != nil {
			return "", err
		}
		symbol := alphabet[index.Int64()]

		code[i] = symbol
	}

	return string(code), nil
}
