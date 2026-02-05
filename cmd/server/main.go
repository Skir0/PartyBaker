package main

import (
	"PartyBaker/internal/ton"
	"context"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	fmt.Println("Starting server...")

	err = ton.InitAPI(context.Background(), os.Getenv("TESTNET_TON_CONFIG"))
	if err != nil {
		return
	}

	res, err := ton.GetTargetAmount(context.Background(), ton.Api, ton.GIFT_WALLET_CONTRACT_ADRESS)
	fmt.Println(res)

}
