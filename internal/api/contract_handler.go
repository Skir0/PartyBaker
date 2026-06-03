package api

import (
	"PartyBaker/internal/blockchain"
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func getWallet(api ton.APIClientWrapped) (*wallet.Wallet, error) {
	seed := os.Getenv("SEED")
	if seed == "" {
		return nil, fmt.Errorf("SEED environment variable is empty")
	}

	words := strings.Split(seed, " ")
	w, err := wallet.FromSeedWithOptions(api, words, wallet.V4R2)
	if err != nil {
		return nil, err
	}
	return w, nil
}

func getContractData(adminAddress string, targetAmount int64, collectedAmount int64, codeCell *cell.Cell) (*cell.Cell, error) {
	adminAddr, err := address.ParseAddr(adminAddress)
	if err != nil {
		return nil, fmt.Errorf("invalid admin address: %v", err)
	}

	data := cell.BeginCell().
		MustStoreUInt(uint64(blockchain.ACTIVE), 4).
		MustStoreCoins(uint64(targetAmount)).
		MustStoreCoins(uint64(collectedAmount)).
		MustStoreAddr(adminAddr).
		MustStoreAddr(blockchain.ACCEPTED_MINTER_COOKIE_ADDRESS).
		MustStoreDict(nil).
		MustStoreBuilder(codeCell.ToBuilder()).
		EndCell()

	return data, nil
}

func (h *Handler) DeployGiftContract(writer http.ResponseWriter, request *http.Request, giftID int32) error {
	// giftID, err := strconv.Atoi(chi.URLParam(request, "giftId"))

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	if !ok {
		return errors.New("unauthorized")
	}

	gift, err := h.repo.GetGiftForDeployment(request.Context(), int32(giftID), int32(currentUserID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return err
		}
		http.Error(writer, "failed to load gift", http.StatusInternalServerError)
		return err
	}

	if gift.ContractAddress.Valid && gift.ContractAddress.String != "" {
		return errors.New("gift contract already exists")
	}

	adminAddress, err := h.repo.GetUserWalletAddress(request.Context(), int64(gift.AdminID))
	if err != nil {
		return err
	}

	w, err := getWallet(h.api)
	if err != nil {
		return err
	}

	log.Println("Deploy wallet:", w.WalletAddress().String())

	// Safely decode HEX BOC
	codeCellBytes, err := hex.DecodeString(os.Getenv("HEX_BOC"))
	if err != nil {
		return err
	}

	codeCell, err := cell.FromBOC(codeCellBytes)
	if err != nil {
		return err
	}

	dataCell, err := getContractData(adminAddress, gift.TargetAmount.Int64, gift.CollectedAmount.Int64, codeCell)
	if err != nil {
		return err
	}

	msgBody := cell.BeginCell().EndCell()

	addr, _, _, err := w.DeployContractWaitTransaction(
		context.Background(),
		tlb.MustFromTON("0.02"),
		msgBody,
		codeCell,
		dataCell,
	)

	if err != nil {
		log.Println("Deployment error:", err)
		return err
	}

	log.Println("Deployed Gift Contract addr:", addr.String())

	if err := h.repo.SaveGiftDeployment(request.Context(), int32(giftID), int32(currentUserID), addr.String()); err != nil {
		return err
	}

	writer.Header().Set("Content-Type", "application/json")
	json.NewEncoder(writer).Encode(map[string]string{
		"address": addr.String(),
		"status":  "success",
	})
	return nil
}
