import "storage"

struct JettonWalletData {
    balance: coins
    owner: address
    minter: address
    code: cell
}

fun calcDeployedJettonWallet(ownerAddress: address, minterAddress: address, walletCode: cell): AutoDeployAddress {
    val standardWalletData: JettonWalletData = {
        balance: 0,
        owner: ownerAddress,
        minter: minterAddress,
        code: walletCode
    };

    return {
        workchain: 0,
        stateInit: {
            code: walletCode,
            data: standardWalletData.toCell()
        }
    };
}