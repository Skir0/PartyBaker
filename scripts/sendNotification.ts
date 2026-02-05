import { Address, beginCell, toNano } from '@ton/core';
import { GiftWallet } from '../wrappers/GiftWallet';
import { NetworkProvider } from '@ton/blueprint';
import { CONFIG_ADMIN_ADDRESS, DEPLOYED_CONTRACT_ADDRESS } from './deployGiftWallet';

export async function run(provider: NetworkProvider) {
    const adminAddress = Address.parse('0QBnp25bT_Taj8juEslO0zaHDwLTyIGJq72SFurXwy2pJVh4');
    const adminAddress2 = Address.parse('UQBnp25bT_Taj8juEslO0zaHDwLTyIGJq72SFurXwy2pJePy');
    const adminAddress3 = Address.parse('0QASjy3c_RXjK_Qlb2EaX26GaBRjT07Xft5JzCRI3CCFrTV9');

    const giftWallet = provider.open(GiftWallet.createFromAddress(DEPLOYED_CONTRACT_ADDRESS));

    const data = await giftWallet.getData();

    console.log(adminAddress.toRawString());
    console.log(adminAddress2.toRawString());
    console.log(adminAddress3.toRawString());


    // await giftWallet.sendChangeAdmin(provider.sender(), {
    //     value: toNano(0.01),
    //     newAdminAddress: adminAddress
    // });

}
