package main

import (
	"PartyBaker/internal/core"
	"PartyBaker/internal/indexer"
	"PartyBaker/internal/repository"
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var repo *repository.Repository

func main() {

	//s := "kQC54WrttsCmxNgJMEFfof8RF4S8wjVwT4Egee2yDaEtlKF5"
	//addr := address.NewAddress(0, 0, []byte(s))
	//fmt.Println(addr.StringRaw())
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Остановит всё при выходе из main

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	fmt.Println("Starting server...")

	dbPool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Println("Error connecting to database:", err)
	}
	repo = repository.NewRepository(dbPool)

	fmt.Println("Initializing repository...")

	api, err := core.InitAPI(ctx, os.Getenv("TESTNET_TON_CONFIG"))
	if err != nil {
		fmt.Println("Error initializing client API:", err)
	}
	fmt.Println("Initializing client API...")

	worker := indexer.NewWorker(repo, api)

	go func() {
		fmt.Println("Starting indexer...")
		worker.Run(ctx)
	}()
	fmt.Println("Server is running. Press Ctrl+C to stop.")

	status1, _ := core.GetStatus(ctx, api, core.GIFT_WALLET_CONTRACT_ADRESS)
	fmt.Println("Status at start", status1)
	str, err := core.SendCancelGift(ctx, api, os.Getenv("SEED"), core.GIFT_WALLET_CONTRACT_ADRESS)
	// str, err := core.SendTestActiveGift(ctx, api, os.Getenv("SEED"), core.GIFT_WALLET_CONTRACT_ADRESS)
	if err != nil {
		return
	}
	fmt.Println(str)

	time.Sleep(5 * time.Second)
	status2, _ := core.GetStatus(ctx, api, core.GIFT_WALLET_CONTRACT_ADRESS)
	fmt.Println("Status at end", status2)

	// Создаем канал для прослушивания сигналов ОС
	quit := make(chan os.Signal, 1)
	// Указываем, какие сигналы ловить (прерывание или завершение)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Программа будет заблокирована здесь, пока не придет сигнал
	<-quit

	fmt.Println("Shutting down gracefully...")
	cancel() // Сигнализируем всем горутинам, что пора закрываться

}
