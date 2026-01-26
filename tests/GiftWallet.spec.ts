import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { GiftWallet, GiftWalletConfig } from '../wrappers/GiftWallet';


const TARGET_AMOUNT: bigint = toNano(100_000_000);


describe('GiftWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('GiftWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let giftWallet: SandboxContract<GiftWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const admin = await blockchain.treasury('admin');
        const minter = await blockchain.treasury('minter');
        const jettonWalletCode = new Cell();

        const giftWalletConfig: GiftWalletConfig = {
            targetAmount: TARGET_AMOUNT,
            adminAddress: admin.address,
            acceptedMinterAddress: minter.address,
            code: code,
        };

        giftWallet = blockchain.openContract(GiftWallet.createFromConfig(giftWalletConfig, code));

        deployer = await blockchain.treasury('deployer');

        // we don't write provider as a parameter because
        // it is automatically added by opening contract in blockchain
        const deployResult = await giftWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: giftWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
    });
});
