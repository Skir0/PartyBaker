package main

//
//import (
//	"PartyBaker/internal/core"
//	"PartyBaker/internal/indexer"
//	"PartyBaker/internal/repository"
//	"context"
//	"fmt"
//	"os"
//	"os/signal"
//	"syscall"
//	"time"
//
//	"github.com/jackc/pgx/v5/pgxpool"
//	"github.com/joho/godotenv"
//	"github.com/xssnick/tonutils-go/address"
//)
//
//var Repo2 *repository.Repository
//
//func main() {
//
//	//s := "kQC54WrttsCmxNgJMEFfof8RF4S8wjVwT4Egee2yDaEtlKF5"
//	//addr := address.NewAddress(0, 0, []byte(s))
//	//fmt.Println(addr.StringRaw())
//	//fmt.Println(pgtype.Text{
//	//	String: s,
//	//	Valid:  true,
//	//})
//
//	ctx, cancel := context.WithCancel(context.Background())
//	defer cancel() // Остановит всё при выходе из main
//
//	err := godotenv.Load(".env")
//	if err != nil {
//		fmt.Println("Error loading .env file:", err)
//	}
//	fmt.Println("Starting server...", time.Now())
//
//	dbPool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
//	if err != nil {
//		fmt.Println("Error connecting to database:", err)
//	}
//	Repo2 = repository.NewRepository(dbPool)
//
//	fmt.Println("Initializing repository...")
//
//	api, err := core.InitAPI(ctx, os.Getenv("TESTNET_TON_CONFIG"))
//	if err != nil {
//		fmt.Println("Error initializing client API:", err)
//	}
//	fmt.Println("Initializing client API...")
//
//	worker := indexer.NewWorker(Repo2, api)
//	go func() {
//		fmt.Println("Starting indexer...")
//		worker.Run(ctx)
//	}()
//	fmt.Println("Server is running. Press Ctrl+C to stop.")
//
//	admin1, _ := core.GetAdminAddress(ctx, api, core.GIFT_WALLET_CONTRACT_ADRESS)
//	fmt.Println("admin at start", address.NewAddress(0, 0, admin1.Data()), time.Now())
//
//	time.Sleep(10 * time.Second)
//
//	// newAddr, _ := address.ParseAddr("0QAwvy9IwdBtTZTGuDRNuA5Karet_IA72gFv-lquc3-va5XA")
//	newAddr, _ := address.ParseAddr("0QBnp25bT_Taj8juEslO0zaHDwLTyIGJq72SFurXwy2pJVh4")
//
//	// str, err := core.SendChangeAdmin(ctx, api, os.Getenv("SEED"), core.GIFT_WALLET_CONTRACT_ADRESS, newAddr)
//	str, err := core.SendChangeAdmin(ctx, api, os.Getenv("SEED2"), core.GIFT_WALLET_CONTRACT_ADRESS, newAddr)
//
//	if err != nil {
//		return
//	}
//	fmt.Println(str, time.Now())
//	time.Sleep(10 * time.Second)
//
//	admin2, _ := core.GetAdminAddress(ctx, api, core.GIFT_WALLET_CONTRACT_ADRESS)
//	fmt.Println("admin at end", admin2.Bounce(false).String(), time.Now())
//
//	// Создаем канал для прослушивания сигналов ОС
//	quit := make(chan os.Signal, 1)
//	// Указываем, какие сигналы ловить (прерывание или завершение)
//	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
//
//	// Программа будет заблокирована здесь, пока не придет сигнал
//	<-quit
//
//	fmt.Println("Shutting down gracefully...")
//	cancel() // Сигнализируем всем горутинам, что пора закрываться
//
//}
