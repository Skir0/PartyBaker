
struct (0x0f8a7ea5) AskToTransfer  {
    queryId: uint64
    amount: coins
    destination: address
    responseDestination: address?
    customPayload: cell?
    forwardTonAmount: coins
    forwardPayload: cell?
}

struct (0x7362d09c) TransferNotification {
    queryId: uint64
    amount: coins
    senderAddress: address
    forwardPayload: cell?
}

struct (0x00000100) CancelGift {
    queryId: uint64

}

struct (0x00000200) ReturnAmount {
    queryId: uint64,
}

struct (0x00000300) ChangeAdmin {
    queryId: uint64,
    newAdminAddress: address
}

struct (0x00000400) ChangeTargetAmount {
    queryId: uint64,
    newTargetAmount: coins
}
