package core

import "github.com/xssnick/tonutils-go/address"

var GIFT_WALLET_CONTRACT_ADRESS = address.MustParseAddr("kQAIhkQjIX9Q6oVt7rrewIeRJvVDmHg_a8nT_ladybHU1M_3")
var ACCEPTED_MINTER_USDT_ADDRESS = address.MustParseAddr("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs")
var ACCEPTED_MINTER_COOKIE_ADDRESS = address.MustParseAddr("kQBSn8MNUxBnYx2Yj5xjJh9Xk9UU9eqLs4gYPzIgnnkLQ1W_")

type OpCodes = uint32

const (
	ASK_TO_TRANSFER       OpCodes = 0x0f8a7ea5
	TRANSFER_NOTIFICATION OpCodes = 0x7362d09c
	CANCEL_GIFT           OpCodes = 0x00000100
	RETURN_AMOUNT         OpCodes = 0x00000200
	CHANGE_ADMIN          OpCodes = 0x00000300
	CHANGE_TARGET         OpCodes = 0x00000400
)

const (
	not_valid_wallet      = 74
	not_active_gift       = 1001
	not_cancelled_gift    = 1002
	contributor_not_exist = 35
	not_from_admin        = 1011
)

type GiftStatus int

const (
	ACTIVE    GiftStatus = 0
	PAID      GiftStatus = 1
	CANCELLED GiftStatus = 2
)
