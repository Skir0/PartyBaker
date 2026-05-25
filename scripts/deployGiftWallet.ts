import { Address, Cell, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { GiftWallet, type GiftWalletConfig } from '../wrappers/GiftWallet';

export const ACCEPTED_MINTER_COOKIE_ADDRESS = Address.parse('0:529fc30d531067631d988f9c63261f5793d514f5ea8bb388183f32209e790b43');

export const COOKIE_WALLET_CODE = Cell.fromHex(
    'b5ee9c7201020b01000251000114ff00f4a413f4bcf2c80b01020162020303bcd0f8918e34d31f31d72c20bc6a28cc96d33f31fa00308e11d72c23deecbef492f23fe1d33f31fa0030e2ed44d0fa0002a0c801fa02cec9ed54e020d72c20bc6a28cce302d72c207c53f52ce302d72c22caf83de4e30230840f01c700f2f4040506001da0f605da89a1f401f491f49061f05503f831ed44d001d33ffa00fa50fa50fa0006fa0020fa48fa4830f89221c70591308e26f892f82a28c8cf8420fa5213fa52c958c8cf84d0ccccf916c8cf8a0040cbffcf50c705f2e2c3e25126a0c801fa02cec9ed54f897f8276f1021a1820898968066b608a18208e4e1c0a0a12294375b6c21e30d206eb323c200b0e30f07080901fe31d33ffa00fa48fa50f401fa0020d749f2e2c423fa4430f2d14ded44d0fa0020fa48fa4830f89222c705f2e2c15338bef2e2c25138a1c801fa0212cec9ed54237271e304f897f89370f83a12a825a0820a625a00a0bcf2e2c5f82ac8cf842017fa5212fa52c9c8cf905e35146618cb3f5006fa0215fa5412fa5401fa0212ce0a00a031ed44d0fa0020fa48fa4830f89222c705f2e2c104d33ffa00fa50305351bef2e2c25151a1c801fa0214cec9ed54c8cf91ef765f7acb3f58fa02fa52fa54c9c8cf858812fa5271cf0b6eccc98050fb000064f89370f83a23a0a1c8cf91cd8b427227cf0b3f5006fa0214fa5416cec9c8cf850813fa525005fa0271cf0b6accc971fb00020030c8cf8508fa5258fa028210d53276dbcf0b8acb3fc972fb0000045f030044c9c8cf8988015dc8cf84d0ccccf916cf0bff81008dcf0b7412cc12ccccc98040fb00',
);

const CONFIG_ADMIN_ADDRESS = Address.parse('0QBnp25bT_Taj8juEslO0zaHDwLTyIGJq72SFurXwy2pJVh4');

export async function run(provider: NetworkProvider) {
    const code = await compile('GiftWallet');

    const config: GiftWalletConfig = {
        targetAmount: toNano('500'),
        adminAddress: CONFIG_ADMIN_ADDRESS,
        acceptedMinterAddress: ACCEPTED_MINTER_COOKIE_ADDRESS,
        code: COOKIE_WALLET_CODE,
    };

    const giftWallet = provider.open(GiftWallet.createFromConfig(config, code));

    console.log('GiftWallet address:', giftWallet.address.toString());

    if (await provider.isContractDeployed(giftWallet.address)) {
        console.log('GiftWallet is already deployed');
        return;
    }

    await giftWallet.sendDeploy(provider.sender(), toNano('0.3'));
    await provider.waitForDeploy(giftWallet.address);

    console.log('GiftWallet deployed at:', giftWallet.address.toString());
}
