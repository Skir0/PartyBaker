package core

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"
	"time"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

type GiftWallet struct {
	Status                GiftStatus
	TargetAmount          *big.Int
	CollectedAmount       *big.Int
	AdminAddress          *address.Address
	AcceptedMinterAddress *address.Address
	Contributors          map[string]*big.Int
	Code                  *cell.Cell
}

func getResultByMethodStr(ctx context.Context, api ton.APIClientWrapped,
	contractAddress *address.Address, contractMethodStr string) (*ton.ExecutionResult, error) {
	block, err := api.CurrentMasterchainInfo(ctx)
	if err != nil {
		log.Println("get block err:", err)
		return nil, err
	}
	res, err := api.WaitForBlock(block.SeqNo).RunGetMethod(ctx, block, contractAddress, contractMethodStr)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func getWalletBySeedPhrase(seedPhrase string, api ton.APIClientWrapped) (*wallet.Wallet, error) {
	words := strings.Split(seedPhrase, " ")
	w, err := wallet.FromSeedWithOptions(api, words, wallet.V4R2)

	if err != nil {
		return nil, err
	}
	return w, nil
}

func packToCellAndSend(w *wallet.Wallet, msg AllowedInternalMessage,
	targetAddress *address.Address, ctx context.Context) error {
	body, err := tlb.ToCell(msg)
	if err != nil {
		return err
	}

	err = w.Send(ctx, &wallet.Message{
		Mode: 1,
		InternalMessage: &tlb.InternalMessage{
			Bounce:  true,
			DstAddr: targetAddress,
			Amount:  tlb.MustFromTON("0.05"),
			Body:    body,
		},
	})
	return nil
}

func parseCellToMap(ok bool, contributorsCell *cell.Cell, giftWallet *GiftWallet) {

	// создаем объект словаря. 267 - фиксированная длина ключа-адреса в битах
	dict, err := contributorsCell.BeginParse().LoadDict(267)

	if err == nil {
		kvs, err := dict.LoadAll()
		if err == nil {
			for _, kv := range kvs {
				// Ключ - это слайс, в котором лежит адрес
				addr := kv.Key.MustLoadAddr()

				amount := kv.Value.MustLoadBigCoins()

				giftWallet.Contributors[addr.String()] = amount

			}
		}
	}
}

func GetData(ctx context.Context, api ton.APIClientWrapped,
	contractAddress *address.Address) (*GiftWallet, error) {

	res, err := getResultByMethodStr(ctx, api,
		contractAddress, "get_target_amount")
	if err != nil {
		return nil, err
	}
	tuple := res.AsTuple()

	if len(tuple) < 7 {
		return nil, fmt.Errorf("tuple is too short, expected 7 elements, got %d", len(tuple))
	}
	giftWallet := &GiftWallet{
		Contributors: make(map[string]*big.Int),
	}
	if status, ok := tuple[0].(*big.Int); ok {
		giftWallet.Status = GiftStatus(status.Int64())
	}
	if val, ok := tuple[1].(*big.Int); ok {
		giftWallet.TargetAmount = val
	} else {
		giftWallet.TargetAmount = big.NewInt(0)
	}
	giftWallet.CollectedAmount, _ = tuple[2].(*big.Int)

	if adminSlice, ok := tuple[3].(*cell.Slice); ok {
		giftWallet.AdminAddress = adminSlice.MustLoadAddr()
	}
	if minterSlice, ok := tuple[4].(*cell.Slice); ok {
		giftWallet.AcceptedMinterAddress = minterSlice.MustLoadAddr()
	}

	contributorsCell, ok := tuple[5].(*cell.Cell)
	giftWallet.Contributors = make(map[string]*big.Int)
	if ok && contributorsCell != nil {
		parseCellToMap(ok, contributorsCell, giftWallet)
	}
	if codeCell, ok := tuple[6].(*cell.Cell); ok {
		giftWallet.Code = codeCell
	}
	return giftWallet, nil
}

func GetStatus(ctx context.Context, api ton.APIClientWrapped, contractAddress *address.Address) (GiftStatus, error) {
	res, err := getResultByMethodStr(ctx, api,
		contractAddress, "get_status")

	if err != nil {
		// maybe not zero
		return 0, err
	}
	status := GiftStatus(res.MustInt(0).Int64())

	return status, nil
}

func GetCollectedAmount(ctx context.Context, api ton.APIClientWrapped, contractAddress *address.Address) (*big.Int, error) {
	res, err := getResultByMethodStr(ctx, api,
		contractAddress, "get_collected_amount")
	if err != nil {
		return nil, err
	}
	collectedAmount, err := res.Int(0)
	if err != nil {
		return nil, err
	}
	return collectedAmount, nil
}

func GetTargetAmount(ctx context.Context, api ton.APIClientWrapped,
	contractAddress *address.Address) (*big.Int, error) {
	res, err := getResultByMethodStr(ctx, api,
		contractAddress, "get_target_amount")
	if err != nil {
		return nil, err
	}

	targetAmount, err := res.Int(0)
	if err != nil {
		return nil, err
	}
	return targetAmount, nil
}

func GetAdminAddress(ctx context.Context, api ton.APIClientWrapped, contractAddress *address.Address) (*address.Address, error) {
	res, err := getResultByMethodStr(ctx, api,
		contractAddress, "get_admin_address")
	if err != nil {
		return nil, err
	}
	adminAddress, err := res.Slice(0)
	if err != nil {
		return nil, err
	}
	return adminAddress.MustLoadAddr(), nil
}

// SendTestActiveGift only for test
func SendTestActiveGift(ctx context.Context, api ton.APIClientWrapped,
	seed string, targetAddress *address.Address) (string, error) {
	w, err := getWalletBySeedPhrase(seed, api)

	msg := TestActiveGift{
		QueryId: uint64(time.Now().UnixNano()),
	}

	err = packToCellAndSend(w, &msg, targetAddress, ctx)

	if err != nil {
		return "failed to send test active gift", err
	}

	return "send test active gift to smart contract", nil
}

func SendCancelGift(ctx context.Context, api ton.APIClientWrapped,
	seed string, targetAddress *address.Address) (string, error) {

	w, err := getWalletBySeedPhrase(seed, api)

	msg := CancelGift{
		QueryId: uint64(time.Now().UnixNano()),
	}
	err = packToCellAndSend(w, &msg, targetAddress, ctx)

	if err != nil {
		return "failed to send cancel gift", err
	}

	return "send cancel gift to smart contract", nil
}

func SendChangeAdmin(ctx context.Context, api ton.APIClientWrapped,
	seed string, targetAddress *address.Address, newAdminAddress *address.Address) (string, error) {

	w, err := getWalletBySeedPhrase(seed, api)

	msg := ChangeAdmin{
		QueryId:         uint64(time.Now().UnixNano()),
		NewAdminAddress: newAdminAddress,
	}

	err = packToCellAndSend(w, &msg, targetAddress, ctx)

	if err != nil {
		return "failed to send change admin", err
	}

	return "send change admin to smart contract", nil
}

func SendChangeTargetAmount(ctx context.Context, api ton.APIClientWrapped,
	seed string, targetAddress *address.Address, newTargetAmount tlb.Coins) (string, error) {

	w, err := getWalletBySeedPhrase(seed, api)

	msg := ChangeTargetAmount{
		QueryId:         uint64(time.Now().UnixNano()),
		NewTargetAmount: newTargetAmount,
	}
	err = packToCellAndSend(w, &msg, targetAddress, ctx)

	if err != nil {
		return "failed to send change target amount", err
	}

	return "send change target amount", nil
}

func SendReturnAmount(ctx context.Context, api ton.APIClientWrapped,
	seed string, targetAddress *address.Address) (string, error) {

	w, err := getWalletBySeedPhrase(seed, api)

	msg := ReturnAmount{
		QueryId: uint64(time.Now().UnixNano()),
	}
	err = packToCellAndSend(w, &msg, targetAddress, ctx)

	if err != nil {
		return "failed to send return amount", err
	}

	return "send return amount", nil
}

// for test
func SendJettonTransfer(ctx context.Context, api ton.APIClientWrapped, minterAddress *address.Address,
	targetAddress *address.Address, seed string) (*tlb.Transaction, error) {

	w, err := getWalletBySeedPhrase(seed, api)
	if err != nil {
		return nil, err
	}

	tokenClient := jetton.NewJettonMasterClient(api, minterAddress)
	jettonWallet, err := tokenClient.GetJettonWallet(ctx, w.WalletAddress())
	if err != nil {
		return nil, fmt.Errorf("failed to get jetton wallet: %w", err)
	}

	// 1. Сумма USDT (6 знаков)
	amountUSDT := tlb.MustFromDecimal("0.5", 6) // 0.5 USDT

	// 2. Сумма уведомления для контракта (9 знаков!)
	// Это те деньги, которые придут вашему контракту GiftWallet вместе с уведомлением
	forwardAmount := tlb.MustFromTON("0.02")

	// 3. Общая сумма TON на всю операцию (9 знаков!)
	// Должна быть больше чем forwardAmount + комиссии (~0.05-0.1 TON)
	totalTonGas := tlb.MustFromTON("0.07")

	comment, _ := wallet.CreateCommentCell("hello")

	// responseAddress ставим w.WalletAddress(), чтобы сдача вернулась нам
	transferPayload, err := jetton.BuildTransferPayload(targetAddress, w.WalletAddress(),
		amountUSDT, forwardAmount, comment, nil)
	if err != nil {
		return nil, err
	}

	msg := wallet.SimpleMessage(jettonWallet.Address(), totalTonGas, transferPayload)

	transaction, _, err := w.SendWaitTransaction(ctx, msg)
	if err != nil {
		return nil, err
	}

	return transaction, nil
}
