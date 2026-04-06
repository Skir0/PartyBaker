import { Address, beginCell, toNano, TupleItemSlice } from '@ton/core';
import { calcAddressOfJettonWallet, GiftWallet } from '../wrappers/GiftWallet';
import { NetworkProvider } from '@ton/blueprint';
import {
    ACCEPTED_MINTER_COOKIE_ADDRESS,
    CONFIG_ADMIN_ADDRESS,
    COOKIE_WALLET_CODE,
    DEPLOYED_CONTRACT_ADDRESS
} from './deployGiftWallet';
import { JettonMaster, TonClient } from '@ton/ton';
import { JettonWallet } from '../tolk-jetton-blueprint/wrappers/JettonWallet';

export async function run(provider: NetworkProvider) {

    console.log(COOKIE_WALLET_CODE.hash().toString('hex'))

}
