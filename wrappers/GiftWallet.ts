import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary,
    Sender,
    SendMode
} from '@ton/core';

export type GiftWalletConfig = {
    targetAmount: bigint;
    adminAddress: Address;
    acceptedMinterAddress: Address;
    code: Cell;
}
function parseCellToMap(contributorsCell: Cell | null) {
    return Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigVarUint(16), contributorsCell);
}

export function giftWalletConfigToCell(config: GiftWalletConfig) {
    return beginCell()
        .storeUint(0, 4)
        .storeCoins(config.targetAmount)
        .storeCoins(0)
        .storeAddress(config.adminAddress)
        .storeAddress(config.acceptedMinterAddress)
        .storeDict(null)
        .storeRef(config.code)
        .endCell();
}

export const Opcodes = {
    ask_to_transfer: 0xf8a7ea5,
    transfer_notification: 0x7362d09c,
    cancel_gift: 0x100,
    return_amount: 0x200,
    change_admin: 0x300
};

export const ErrorCodes = {
    not_valid_wallet: 74,
    not_active_gift: 1001,
    not_cancelled_gift: 1002,
    contributor_not_exist: 35,
    not_from_admin: 1011,
};


export class GiftWallet implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    // deploy
    static createFromAddress(address: Address) {
        return new GiftWallet(address);
    }

    // use with existing address
    static createFromConfig(config: GiftWalletConfig, code: Cell, workchain = 0) {
        const data = giftWalletConfigToCell(config);
        const init = { data, code };
        return new GiftWallet(contractAddress(workchain, init), init);
    }
    async getData(provider: ContractProvider) {
        const { stack } = await provider.get('get_wallet_data', []);
        return {
            targetAmount: stack.readBigNumber(),
            collectedAmount: stack.readBigNumber(),
            adminAddress: stack.readAddress(),
            minterAddress: stack.readAddress(),
            contributors: parseCellToMap(stack.readCellOpt()),
            code: stack.readCell(),
        };
    }
    async getStatus(provider: ContractProvider) {
        const result = await provider.get('get_status', []);
        return result.stack.readNumber();
    }
    async getCollectedAmount(provider: ContractProvider) {
        const result = await provider.get('get_collected_amount', []);
        return result.stack.readBigNumber();
    }

    async sendCancelGift(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.cancel_gift, 32)
                .storeUint(opts.queryId || 0, 64)
                .endCell(),
        });
    }

    async sendChangeAdmin(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
            newAdminAddress: Address;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.change_admin, 32)
                .storeUint(opts.queryId || 0, 64)
                .storeAddress(opts.newAdminAddress)
                .endCell(),
        });
    }
    async sendReturnAmount(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.return_amount, 32)
                .storeUint(opts.queryId || 0, 64)
                .endCell(),
        });
    }

    async sendTransferNotification(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
            amount: bigint;
            senderAddress: Address;
            forwardPayload: Cell;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.transfer_notification, 32)
                .storeUint(opts.queryId || 0, 64)
                .storeCoins(opts.amount)
                .storeAddress(opts.senderAddress)
                .storeSlice(opts.forwardPayload.asSlice())
                .endCell(),
        });
    }
}

