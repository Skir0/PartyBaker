
struct (0xf8a7ea5) AskToTransfer  {
    queryId: uint64
    amount: coins
    destination: address
    responseDestination: address?
    customPayload: cell?
    forwardTonAmount: coins
    forwardPayload: RemainingBitsAndRefs
}

struct (0x7362d09c) TransferNotification {
    queryId: uint64
    amount: coins
    senderAddress: address?
    forwardPayload: RemainingBitsAndRefs
}

struct (0x100) CancelGift {
    queryId: uint64

}

struct (0x200) ReturnAmount {
    queryId: uint64,
}

struct (0x300) ChangeAdmin {
    queryId: uint64,
    newAdminAddress: address
}
