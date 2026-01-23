enum GiftStatus {
    ACTIVE,
    PAID,
    CANCELLED
}

struct GiftStorage {
    status: GiftStatus
    targetAmount: coins
    collectedAmount: coins
    adminAddress: address
    acceptedMinterAddress: address
    contributors: map<address, coins>
    code: cell
}

fun GiftStorage.load() {
    return GiftStorage.fromCell(contract.getData());
}
fun GiftStorage.save(self) {
    contract.setData(self.toCell());
}

