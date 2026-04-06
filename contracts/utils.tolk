struct JettonWalletData {
    balance: coins
    owner: address
    minter: address
    code: cell
}

fun calcDeployedJettonWallet(ownerAddress: address, minterAddress: address, walletCode: cell): AutoDeployAddress {
    val data = beginCell()
        .storeUint(0, 4)              // coins(0) = ровно 4 нулевых бита
        .storeAddress(ownerAddress)
        .storeAddress(minterAddress)
        .storeRef(walletCode)
        .endCell();

    return {
        workchain: 0,
        stateInit: {
            code: walletCode,
            data: data
        }
    };
}

fun calcAddressOfJettonWallet(ownerAddress: address, minterAddress: address, jettonWalletCode: cell): address {
    val jwDeployed = calcDeployedJettonWallet(ownerAddress, minterAddress, jettonWalletCode);
    return jwDeployed.calculateAddress();
}