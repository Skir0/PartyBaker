import { Blockchain, createShardAccount, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Cell, internal, Message, Sender, SenderArguments, toNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import {
    calcAddressOfJettonWallet,
    ErrorCodes,
    GiftStatus,
    GiftWallet,
    GiftWalletConfig,
    Opcodes,
} from '../wrappers/GiftWallet';
import { flattenTransaction } from '@ton/test-utils';



describe('GiftWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('GiftWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let giftWallet: SandboxContract<GiftWallet>;
    let admin: SandboxContract<TreasuryContract>;
    let minter: SandboxContract<TreasuryContract>;
    let jettonWalletCode: Cell;
    let target_amount: bigint;
    let result: any = undefined;


    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity.vmLogs = 'vm_logs';

        admin = await blockchain.treasury('admin');
        minter = await blockchain.treasury('minter');
        jettonWalletCode = jettonWalletCode = new Cell();
        target_amount = toNano(100);

        const giftWalletConfig: GiftWalletConfig = {
            targetAmount: target_amount,
            adminAddress: admin.address,
            acceptedMinterAddress: minter.address,
            code: jettonWalletCode,
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

        const topUpResult = await giftWallet.sendSimple(admin.getSender(), {
            value: toNano('123000'),
        });

        expect(topUpResult.transactions).toHaveTransaction({
            from: admin.address,
            to: giftWallet.address,
            success: true,
        });
        expect(topUpResult.transactions.length).toBe(2);
    });

    afterEach(async () => {
        if (result && result.transactions) {
            console.log('--- Transaction Fees Report ---');
            printTransactionFees(result.transactions);

            result = undefined;
        }
        // blockchain.verbosity.vmLogs = 'vm_logs';
        // for (const tx of result.transactions) {
        //     console.log(flattenTransaction(tx));
        // }
    })

    it('should deploy', async () => {
        // the check is done inside beforeEach
    });

    describe("getters", () => {
        it('get data wallet', async () => {
            const data = await giftWallet.getData();

            expect(data.status).toBe(GiftStatus.ACTIVE);
            expect(data.adminAddress.equals(admin.address)).toBe(true);
            expect(data.minterAddress.equals(minter.address)).toBe(true);
            expect(data.targetAmount).toBe(target_amount);
            expect(data.collectedAmount).toBe(0n);
            expect(data.contributors).toEqual(new Map());
            expect(data.code.equals(jettonWalletCode)).toBe(true);
        });

        it('get status', async () => {
            const status = await giftWallet.getStatus();
            expect(status).toBe(GiftStatus.ACTIVE);
        });

        it('get target amount', async () => {
            const targetAmount = await giftWallet.getTargetAmount();
            expect(targetAmount).toBe(target_amount);
        });
    });


    describe("change target amount", () => {
        it('change target amount by admin', async () => {
            result = await giftWallet.sendChangeTargetAmount(admin.getSender(), {
                value: toNano(0.05),
                newTargetAmount: toNano(500),
            });
            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: giftWallet.address,
                success: true,
            });

            target_amount = toNano(500);
            const newTarget = await giftWallet.getTargetAmount();
            expect(newTarget).toBe(target_amount);
        });
        it('change target amount not by admin', async () => {
            const randomUser = await blockchain.treasury('random_user');
            result = await giftWallet.sendChangeTargetAmount(randomUser.getSender(), {
                value: toNano(0.05),
                newTargetAmount: toNano(500),
            });
            expect(result.transactions).toHaveTransaction({
                from: randomUser.address,
                to: giftWallet.address,
                exitCode: ErrorCodes.not_from_admin,
                success: false,
            });
        });
    });

    describe("change admin", () => {
        it('change admin by admin', async () => {
            const newAdmin = await blockchain.treasury('new_admin');
            result = await giftWallet.sendChangeAdmin(admin.getSender(), {
                value: toNano(0.05),
                newAdminAddress: newAdmin.address,
            });
            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: giftWallet.address,
                success: true,
            });
            expect(result.transactions).toHaveTransaction({
                from: giftWallet.address,
                to: newAdmin.address,
                success: true,
            });

            const { adminAddress } = await giftWallet.getData();

            expect(adminAddress).toEqualAddress(newAdmin.address);
        });

        it('change admin not by admin', async () => {
            const newAdmin = await blockchain.treasury('new_admin');
            const randomUser = await blockchain.treasury('random_user');
            result = await giftWallet.sendChangeAdmin(randomUser.getSender(), {
                value: toNano(0.05),
                newAdminAddress: newAdmin.address,
            });
            expect(result.transactions).toHaveTransaction({
                from: randomUser.address,
                to: giftWallet.address,
                success: false,
                exitCode: ErrorCodes.not_from_admin,
            });
        });
    });

    describe("cancel gift", () => {
        it('cancel gift by admin', async () => {
            result = await giftWallet.sendCancelGift(admin.getSender(), {
                value: toNano(0.05),
            });

            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: giftWallet.address,
                success: true,
            });

            const { status } = await giftWallet.getData();

            expect(status).toBe(GiftStatus.CANCELLED);
        });
        it('cancel gift not by admin', async () => {
            const randomUser = await blockchain.treasury('random_user');
            result = await giftWallet.sendCancelGift(randomUser.getSender(), {
                value: toNano(0.05),
            });

            expect(result.transactions).toHaveTransaction({
                from: randomUser.address,
                to: giftWallet.address,
                success: false,
                exitCode: ErrorCodes.not_from_admin,
            });
        });
    });

    describe("transfer notification", () => {

        it('standard transfer notification', async () => {
            const jwAddress = calcAddressOfJettonWallet(giftWallet.address, minter.address, jettonWalletCode);

            result = await giftWallet.sendTransferNotification(blockchain.sender(jwAddress), {
                value: toNano(0.05),
                amount: toNano(40),
                senderAddress: admin.address,
                forwardPayload: beginCell().endCell(),
            });

            expect(result.transactions).toHaveTransaction({
                from: jwAddress,
                to: giftWallet.address,
                success: true,
                op: Opcodes.transfer_notification
            });
            expect(await giftWallet.getCollectedAmount()).toBe(toNano(40));
        });
        it('transfer notification with ask to transfer to admin', async () => {
            const jwAddress = calcAddressOfJettonWallet(giftWallet.address, minter.address, jettonWalletCode);

            await blockchain.setShardAccount(
                jwAddress,
                createShardAccount({
                    address: jwAddress,
                    code: jettonWalletCode,
                    data: beginCell().endCell(),
                    balance: toNano('1'),
                    workchain: 0,
                }),
            );


            result = await giftWallet.sendTransferNotification(blockchain.sender(jwAddress), {
                value: toNano(0.1),
                amount: toNano(200),
                senderAddress: admin.address,
                forwardPayload: beginCell().endCell(),
            });

            expect(result.transactions).toHaveTransaction({
                from: jwAddress,
                to: giftWallet.address,
                success: true,
                op: Opcodes.transfer_notification
            });
            expect(result.transactions).toHaveTransaction({
                from: giftWallet.address,
                to: jwAddress,
                success: true,
                op: Opcodes.ask_to_transfer
            });

            expect(await giftWallet.getStatus()).toBe(GiftStatus.PAID);
            // const data = await giftWallet.getData();
            // expect(data.contributors).toEqual(new Map());

        });

    });


});
