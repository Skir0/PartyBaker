package main

import (
	"PartyBaker/internal/api"
	"PartyBaker/internal/blockchain"
	"PartyBaker/internal/repository"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
)

var repo *repository.Repository

func GetUserWallet(api ton.APIClientWrapped) {
	ctx := context.Background()
	// 1. Адрес Мастера токена COOKIE
	masterAddr := address.MustParseAddr("kQBSn8MNUxBnYx2Yj5xjJh9Xk9UU9eqLs4gYPzIgnnkLQ1W_")
	// 2. Адрес владельца (админ из вашего примера)
	// ownerAddr := address.MustParseAddr("0QBnp25bT_Taj8juEslO0zaHDwLTyIGJq72SFurXwy2pJVh4")

	// 3. Создаем клиент для работы с Jetton
	// api — это ваш инициализированный ton.APIClientWrapped
	tokenClient := jetton.NewJettonMasterClient(api, masterAddr)

	// 4. Запрашиваем адрес кошелька
	jwAddress, err := tokenClient.GetJettonWallet(ctx, blockchain.GIFT_WALLET_CONTRACT_ADRESS)
	if err != nil {
		panic(err)
	}

	fmt.Println("Jetton Wallet Address 1:", jwAddress.Address().StringRaw())
	fmt.Println("Jetton Wallet Address original:", address.MustParseAddr("kQDPI6jHrBVjh_y01BSXgDF5bHPYworVuyk1A3pedFgwfszE").StringRaw())

}
func main() {

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Остановит всё при выходе из main

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	fmt.Println("Starting server...", time.Now())

	dbPool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Println("Error connecting to database:", err)
	}
	repo = repository.NewRepository(dbPool)

	fmt.Println("Initializing repository...")

	blockchainApi, err := blockchain.InitAPI(ctx, os.Getenv("TESTNET_TON_CONFIG"))
	if err != nil {
		fmt.Println("Error initializing client API:", err)
	}
	fmt.Println("Initializing client API...")

	// GetUserWallet(blockchainApi)

	//worker := indexer.NewWorker(repo, blockchainApi)
	//go func() {
	//	fmt.Println("Starting indexer...")
	//	worker.Run(ctx)
	//}()
	fmt.Println("Server is running. Press Ctrl+C to stop.")

	// Создаем хендлер и роутер
	h := api.NewHandler(repo, blockchainApi, os.Getenv("BOT_TOKEN"))
	router := api.NewRouter(h)

	fmt.Println("🚀 API Server starting on http://127.0.0.1:8080")

	// ВАЖНО: ListenAndServe блокирует поток. Код после него не выполнится.
	err = http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatal("ListenAndServe Error: ", err)
	}

	// Создаем канал для прослушивания сигналов ОС
	quit := make(chan os.Signal, 1)
	// Указываем, какие сигналы ловить (прерывание или завершение)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Программа будет заблокирована здесь, пока не придет сигнал
	<-quit

	fmt.Println("Shutting down gracefully...")
	cancel() // Сигнализируем всем горутинам, что пора закрываться

}
