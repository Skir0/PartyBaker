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

func (h *Handler) DeployGiftContract(writer http.ResponseWriter, request *http.Request, giftID int32) {
	// giftID, err := strconv.Atoi(chi.URLParam(request, "giftId"))

	currentUserID, ok := request.Context().Value(UserIDKey).(int64)
	if !ok {
		http.Error(writer, "unauthorized", http.StatusUnauthorized)
		return
	}

	gift, err := h.repo.GetGiftForDeployment(request.Context(), int32(giftID), int32(currentUserID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(writer, "gift not found or not deployable", http.StatusNotFound)
			return
		}
		http.Error(writer, "failed to load gift", http.StatusInternalServerError)
		return
	}

	if gift.ContractAddress.Valid && gift.ContractAddress.String != "" {
		http.Error(writer, "gift contract is already deployed", http.StatusConflict)
		return
	}

	adminAddress, err := h.repo.GetUserWalletAddress(request.Context(), int64(gift.AdminID))
	if err != nil {
		http.Error(writer, "failed to load admin wallet address", http.StatusBadRequest)
		return
	}

	w, err := getWallet(h.api)
	if err != nil {
		http.Error(writer, "failed to load deployer wallet", http.StatusInternalServerError)
		return
	}

	log.Println("Deploy wallet:", w.WalletAddress().String())

	// Safely decode HEX BOC
	codeCellBytes, err := hex.DecodeString(os.Getenv("HEX_BOC"))
	if err != nil {
		http.Error(writer, "Failed to decode HEX_BOC", http.StatusInternalServerError)
		return
	}

	codeCell, err := cell.FromBOC(codeCellBytes)
	if err != nil {
		http.Error(writer, "Failed to parse code cell BOC", http.StatusInternalServerError)
		return
	}

	dataCell, err := getContractData(adminAddress, gift.TargetAmount.Int64, gift.CollectedAmount.Int64, codeCell)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	msgBody := cell.BeginCell().EndCell()

	// Deploy using your preferred method!
	addr, _, _, err := w.DeployContractWaitTransaction(
		context.Background(),
		tlb.MustFromTON("0.02"),
		msgBody,
		codeCell,
		dataCell,
	)

	if err != nil {
		log.Println("Deployment error:", err)
		http.Error(writer, "Failed to deploy contract to blockchain", http.StatusInternalServerError)
		return
	}

	log.Println("Deployed Gift Contract addr:", addr.String())

	if err := h.repo.SaveGiftDeployment(request.Context(), int32(giftID), int32(currentUserID), addr.String()); err != nil {
		http.Error(writer, "contract deployed but failed to persist address", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	json.NewEncoder(writer).Encode(map[string]string{
		"address": addr.String(),
		"status":  "success",
	})
}
