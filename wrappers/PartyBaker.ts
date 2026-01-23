import {
    Address,
    beginCell,
    Cell,
    Contract,
    ContractABI,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode
} from '@ton/core';

export type PartyBakerConfig = {};

export function partyBakerConfigToCell(config: PartyBakerConfig): Cell {
    return beginCell().endCell();
}

export class PartyBaker implements Contract {
    abi: ContractABI = { name: 'PartyBaker' }

    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PartyBaker(address);
    }

    static createFromConfig(config: PartyBakerConfig, code: Cell, workchain = 0) {
        const data = partyBakerConfigToCell(config);
        const init = { code, data };
        return new PartyBaker(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
