import { Address, beginCell, toNano } from '@ton/core';
import { GiftWallet } from '../wrappers/GiftWallet';
import { NetworkProvider } from '@ton/blueprint';
import { DEPLOYED_CONTRACT_ADDRESS } from './deployGiftWallet';

export async function run(provider: NetworkProvider) {
    const adminAddress = Address.parse('0QASjy3c_RXjK_Qlb2EaX26GaBRjT07Xft5JzCRI3CCFrTV9');

    const giftWallet = provider.open(GiftWallet.createFromAddress(DEPLOYED_CONTRACT_ADDRESS));


    await giftWallet.sendChangeAdmin(provider.sender(), {
        value: toNano(0.01),
        newAdminAddress: adminAddress
    });

}
