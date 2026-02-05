package ton

import "github.com/xssnick/tonutils-go/address"

var GIFT_WALLET_CONTRACT_ADRESS = address.MustParseAddr("kQBF1JjiVsv6iw2JddgjfwqHy2C-IC0Ne8BboT_tO2UUn_BS")

const (
	ask_to_transfer       = 0x0f8a7ea5
	transfer_notification = 0x7362d09c
	cancel_gift           = 0x00000100
	return_amount         = 0x00000200
	change_admin          = 0x00000300
	change_target         = 0x00000400
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
