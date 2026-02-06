package main

import (
	"PartyBaker/internal/repository"
	"PartyBaker/internal/ton"
	"context"
	"fmt"
	"os"

	"PartyBaker/internal/indexer"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Repo *repository.Repository

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	fmt.Println("Starting server...")

	dbPool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Println("Error connecting to database:", err)
	}

	Repo = repository.NewRepository(dbPool)

	api, err := ton.InitAPI(context.Background(), os.Getenv("TESTNET_TON_CONFIG"))
	if err != nil {
		return
	}

	go indexer.Run(Repo, api)
	res, err := ton.SendJettonTransfer(context.Background(), api, ton.ACCEPTED_MINTER_USDT_ADDRESS,
		ton.GIFT_WALLET_CONTRACT_ADRESS, os.Getenv("SEED"))
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(res)

}
