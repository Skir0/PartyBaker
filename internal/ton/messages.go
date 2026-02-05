package ton

import (
	"fmt"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

type AllowedInternalMessage interface {
	Info()
}

type AskToTransfer struct {
	_                   tlb.Magic        `tlb:"#0f8a7ea5"`
	QueryId             uint64           `tlb:"## 64"`
	Amount              tlb.Coins        `tlb:"."`
	Destination         *address.Address `tlb:"addr"`
	ResponseDestination *address.Address `tlb:"addr"`
	CustomPayload       *cell.Cell       `tlb:"maybe ^"`
	ForwardTonAmount    tlb.Coins        `tlb:"."`
	ForwardPayload      *cell.Cell       `tlb:"maybe ^"`
}

func (msg *AskToTransfer) Info() {
	fmt.Println("AskToTransfer", msg)
}

type TransferNotification struct {
	_              tlb.Magic        `tlb:"#7362d09c"`
	QueryId        uint64           `tlb:"## 64"`
	Amount         tlb.Coins        `tlb:"."`
	SenderAddress  *address.Address `tlb:"addr"`
	ForwardPayload *cell.Cell       `tlb:"maybe ^"`
}

func (msg *TransferNotification) Info() {
	fmt.Println("TransferNotification", msg)
}

type CancelGift struct {
	_       tlb.Magic `tlb:"#00000100"`
	QueryId uint64    `tlb:"## 64"`
}

func (msg *CancelGift) Info() {
	fmt.Println("CancelGift", msg)
}

type ReturnAmount struct {
	_       tlb.Magic `tlb:"#00000200"`
	QueryId uint64    `tlb:"## 64"`
}

func (msg *ReturnAmount) Info() {
	fmt.Println("ReturnAmount", msg)
}

type ChangeAdmin struct {
	_               tlb.Magic        `tlb:"#00000300"`
	QueryId         uint64           `tlb:"## 64"`
	NewAdminAddress *address.Address `tlb:"addr"`
}

func (msg *ChangeAdmin) Info() {
	fmt.Println("ChangeAdmin", msg)
}

type ChangeTargetAmount struct {
	_               tlb.Magic `tlb:"#00000400"`
	QueryId         uint64    `tlb:"## 64"`
	NewTargetAmount tlb.Coins `tlb:"."`
}

func (msg *ChangeTargetAmount) Info() {
	fmt.Println("ChangeTargetAmount", msg)
}
