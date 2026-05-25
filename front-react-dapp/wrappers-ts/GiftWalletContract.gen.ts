// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a GiftWalletContract contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

type StoreCallback<T> = (obj: T, b: c.Builder) => void
type LoadCallback<T> = (s: c.Slice) => T

export type CellRef<T> = {
    ref: T
}

function makeCellFrom<T>(self: T, storeFn_T: StoreCallback<T>): c.Cell {
    let b = beginCell();
    storeFn_T(self, b);
    return b.endCell();
}

function loadAndCheckPrefix32(s: c.Slice, expected: number, structName: string): void {
    let prefix = s.loadUint(32);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected 0x${expected.toString(16).padStart(8, '0')}, got 0x${prefix.toString(16).padStart(8, '0')}`);
    }
}

function lookupPrefix(s: c.Slice, expected: number, prefixLen: number): boolean {
    return s.remainingBits >= prefixLen && s.preloadUint(prefixLen) === expected;
}

function throwNonePrefixMatch(fieldPath: string): never {
    throw new Error(`Incorrect prefix for '${fieldPath}': none of variants matched`);
}

function storeCellRef<T>(cell: CellRef<T>, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    let b_ref = c.beginCell();
    storeFn_T(cell.ref, b_ref);
    b.storeRef(b_ref.endCell());
}

function loadCellRef<T>(s: c.Slice, loadFn_T: LoadCallback<T>): CellRef<T> {
    let s_ref = s.loadRef().beginParse();
    return { ref: loadFn_T(s_ref) };
}

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
    }
}

// ————————————————————————————————————————————
//   parse get methods result from a TVM stack
//

class StackReader {
    constructor(private tuple: c.TupleItem[]) {
    }

    static fromGetMethod(expectedN: number, getMethodResult: { stack: c.TupleReader }): StackReader {
        let tuple = [] as c.TupleItem[];
        while (getMethodResult.stack.remaining) {
            tuple.push(getMethodResult.stack.pop());
        }
        if (tuple.length !== expectedN) {
            throw new Error(`expected ${expectedN} stack width, got ${tuple.length}`);
        }
        return new StackReader(tuple);
    }

    private popExpecting<ItemT>(itemType: string): ItemT {
        const item = this.tuple.shift();
        if (item?.type === itemType) {
            return item as ItemT;
        }
        throw new Error(`not '${itemType}' on a stack`);
    }

    private popCellLike(): c.Cell {
        const item = this.tuple.shift();
        if (item && (item.type === 'cell' || item.type === 'slice' || item.type === 'builder')) {
            return item.cell;
        }
        throw new Error(`not cell/slice on a stack`);
    }

    readBigInt(): bigint {
        return this.popExpecting<c.TupleItemInt>('int').value;
    }

    readBoolean(): boolean {
        return this.popExpecting<c.TupleItemInt>('int').value !== 0n;
    }

    readCell(): c.Cell {
        return this.popCellLike();
    }

    readSlice(): c.Slice {
        return this.popCellLike().beginParse();
    }

    readDictionary<K extends c.DictionaryKeyTypes, V>(keySerializer: c.DictionaryKey<K>, valueSerializer: c.DictionaryValue<V>): c.Dictionary<K, V> {
        if (this.tuple[0].type === 'null') {
            this.tuple.shift();
            return c.Dictionary.empty<K, V>(keySerializer, valueSerializer);
        }
        return c.Dictionary.loadDirect<K, V>(keySerializer, valueSerializer, this.readCell());
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint64 = bigint

/**
 > struct GiftWalletDataReply {
 >     status: GiftStatus
 >     targetAmount: coins
 >     collectedAmount: coins
 >     adminAddress: address
 >     acceptedMinterAddress: address
 >     contributors: map<address, coins>
 >     code: cell
 > }
 */
export interface GiftWalletDataReply {
    readonly $: 'GiftWalletDataReply'
    status: GiftStatus
    targetAmount: coins
    collectedAmount: coins
    adminAddress: c.Address
    acceptedMinterAddress: c.Address
    contributors: c.Dictionary<c.Address, coins>
    code: c.Cell
}

export const GiftWalletDataReply = {
    create(args: {
        status: GiftStatus
        targetAmount: coins
        collectedAmount: coins
        adminAddress: c.Address
        acceptedMinterAddress: c.Address
        contributors: c.Dictionary<c.Address, coins>
        code: c.Cell
    }): GiftWalletDataReply {
        return {
            $: 'GiftWalletDataReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): GiftWalletDataReply {
        return {
            $: 'GiftWalletDataReply',
            status: GiftStatus.fromSlice(s),
            targetAmount: s.loadCoins(),
            collectedAmount: s.loadCoins(),
            adminAddress: s.loadAddress(),
            acceptedMinterAddress: s.loadAddress(),
            contributors: c.Dictionary.load<c.Address, coins>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4), s),
            code: s.loadRef(),
        }
    },
    store(self: GiftWalletDataReply, b: c.Builder): void {
        GiftStatus.store(self.status, b);
        b.storeCoins(self.targetAmount);
        b.storeCoins(self.collectedAmount);
        b.storeAddress(self.adminAddress);
        b.storeAddress(self.acceptedMinterAddress);
        b.storeDict<c.Address, coins>(self.contributors, c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4));
        b.storeRef(self.code);
    },
    toCell(self: GiftWalletDataReply): c.Cell {
        return makeCellFrom<GiftWalletDataReply>(self, GiftWalletDataReply.store);
    }
}

/**
 > enum GiftStatus { 3 variants }
 */
export type GiftStatus = bigint

export const GiftStatus = {
    ACTIVE: 0n,
    PAID: 1n,
    CANCELLED: 2n,

    fromSlice(s: c.Slice): GiftStatus {
        return s.loadUintBig(4);
    },
    store(self: GiftStatus, b: c.Builder): void {
        b.storeUint(self, 4);
    },
    toCell(self: GiftStatus): c.Cell {
        return makeCellFrom<GiftStatus>(self, GiftStatus.store);
    }
}

/**
 > struct (0x0f8a7ea5) AskToTransfer {
 >     queryId: uint64
 >     amount: coins
 >     destination: address
 >     responseDestination: address?
 >     customPayload: cell?
 >     forwardTonAmount: coins
 >     forwardPayload: cell?
 > }
 */
export interface AskToTransfer {
    readonly $: 'AskToTransfer'
    queryId: uint64
    amount: coins
    destination: c.Address
    responseDestination: c.Address | null
    customPayload: c.Cell | null
    forwardTonAmount: coins
    forwardPayload: c.Cell | null
}

export const AskToTransfer = {
    PREFIX: 0x0f8a7ea5,

    create(args: {
        queryId: uint64
        amount: coins
        destination: c.Address
        responseDestination: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: c.Cell | null
    }): AskToTransfer {
        return {
            $: 'AskToTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): AskToTransfer {
        loadAndCheckPrefix32(s, 0x0f8a7ea5, 'AskToTransfer');
        return {
            $: 'AskToTransfer',
            queryId: s.loadUintBig(64),
            amount: s.loadCoins(),
            destination: s.loadAddress(),
            responseDestination: s.loadMaybeAddress(),
            customPayload: s.loadBoolean() ? s.loadRef() : null,
            forwardTonAmount: s.loadCoins(),
            forwardPayload: s.loadBoolean() ? s.loadRef() : null,
        }
    },
    store(self: AskToTransfer, b: c.Builder): void {
        b.storeUint(0x0f8a7ea5, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.amount);
        b.storeAddress(self.destination);
        b.storeAddress(self.responseDestination);
        storeTolkNullable<c.Cell>(self.customPayload, b,
            (v,b) => b.storeRef(v)
        );
        b.storeCoins(self.forwardTonAmount);
        storeTolkNullable<c.Cell>(self.forwardPayload, b,
            (v,b) => b.storeRef(v)
        );
    },
    toCell(self: AskToTransfer): c.Cell {
        return makeCellFrom<AskToTransfer>(self, AskToTransfer.store);
    }
}

// ————————————————————————————————————————————
//    class GiftWalletContract
//

interface ExtraSendOptions {
    bounce?: boolean                    // default: false
    sendMode?: SendMode                 // default: SendMode.PAY_GAS_SEPARATELY
    extraCurrencies?: c.ExtraCurrency   // default: empty dict
}

interface DeployedAddrOptions {
    workchain?: number                  // default: 0 (basechain)
    toShard?: { fixedPrefixLength: number; closeTo: c.Address }
    overrideContractCode?: c.Cell
}

function calculateDeployedAddress(code: c.Cell, data: c.Cell, options: DeployedAddrOptions): c.Address {
    const stateInitCell = beginCell().store(c.storeStateInit({
        code,
        data,
        splitDepth: options.toShard?.fixedPrefixLength,
        special: null,
        libraries: null,
    })).endCell();

    let addrHash = stateInitCell.hash();
    if (options.toShard) {
        const shardDepth = options.toShard.fixedPrefixLength;
        addrHash = beginCell()
            .storeBits(new c.BitString(options.toShard.closeTo.hash, 0, shardDepth))
            .storeBits(new c.BitString(stateInitCell.hash(), shardDepth, 256 - shardDepth))
            .endCell()
            .beginParse().loadBuffer(32);
    }

    return new c.Address(options.workchain ?? 0, addrHash);
}

export class GiftWalletContract implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECFQEAAxcAART/APSkE/S88sgLAQIBYgIDBO7Q+JHyQCDHAJEw4NcsIAAAOASOFTDtRNDTAyHCAmwS8kXIz4QgzsntVODXLCObFoTk4wLXLCAAAAgEjigw7UTQ0wMhwgLyRSD6ADH6ADH6SDD4kscF8uPzAfLT6cjPhKDOye1U4NcsIAAAEATjAtcsIAAAGATjAgQFBgcCASANDgL87UTQ0wMhwgLyRfoA+gD6SPpI9ATU0fgoyM+EIPpSUjD6UiHPFMkhyM+E0MzM+RbIz4oAQMv/z1D4kiHHBfLgSify0+kI0z/6APpIMFMEgQEL9ApvoZP6ANGSMHDiIqDIAfoCQBWBAQv0QVBjoFMGvpI1N+MNBcjLA1AE+gJYCAkC/u1E0NMDIcIC8kX6APoA+kj6SPQEINdM+CjIz4Qg+lJSQPpSIc8UySjAAvLj6viSJIEBC/QK8uPy+gDR+JJQBYEBC/RZMFF0oQrXCz/4kviSbYIImJaAiMjPkD4p+pYWyz9QCfoCE/pS+lT0AFAF+gIU9ADJyM+JCAFTQsjPhNAKCwCI7UTQ0wMhwgLyRfoA+gD6SPiSWMcF8uPzI/LT6QTTPzH6SDAgyM+FCBL6UnDPC27JgED7AAPIywNY+gIB+gL6Us7J7VQBconXJ44x7UTQ0wMhwgLyRfoAMSD6ADH6SDD4kscF8uPzIfLT6QLTPzH6ADAByMsDAfoCzsntVODyPwwAijdtggiYloDIz5AAAAACyVR5ZsjPkD4p+pYbyz9Y+gL6Uhj6VBL0AAH6AhX0AMnIz4UIGPpScc8LbhfMyYBA+wAQJXEFAwAY+gL6UvpS9ADMye1UAAAAYMzM+RbPC/+BAI3PC3QSzBPMEszJgED7AAXIywNQBPoCUAX6AhT6UvpSEvQAzsntVAAIAAAEAAIB5w8QAgEgERIAI6wX9qJoaYGY/QAY/QAY/SQYQAAxrYF2omhpgZDhAXki/QB9AH0kfSR6AmumQAIBYhMUAB26b+7UTQ0wMx+gAx+gAwgAF61AdqJoaYGY/QAYQAAbrQj2omhrhYGQYQF5IsA=');

    static Errors = {
        'ERROR_NOT_VALID_WALLET': 74,
        'ERROR_NOT_ACTIVE_GIFT': 1001,
        'ERROR_NOT_CANCELLED_GIFT': 1002,
        'ERROR_CONTRIBUTOR_NOT_EXIST': 1010,
        'ERROR_NOT_FROM_ADMIN': 1011,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new GiftWalletContract(address);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async getWalletData(provider: ContractProvider): Promise<GiftWalletDataReply> {
        const r = StackReader.fromGetMethod(7, await provider.get('get_wallet_data', []));
        return ({
            $: 'GiftWalletDataReply',
            status: r.readBigInt(),
            targetAmount: r.readBigInt(),
            collectedAmount: r.readBigInt(),
            adminAddress: r.readSlice().loadAddress(),
            acceptedMinterAddress: r.readSlice().loadAddress(),
            contributors: r.readDictionary<c.Address, coins>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4)),
            code: r.readCell(),
        });
    }

    async getStatus(provider: ContractProvider): Promise<GiftStatus> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_status', []));
        return r.readBigInt();
    }

    async getCollectedAmount(provider: ContractProvider): Promise<coins> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_collected_amount', []));
        return r.readBigInt();
    }

    async getAdminAddress(provider: ContractProvider): Promise<c.Address> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_admin_address', []));
        return r.readSlice().loadAddress();
    }

    async getTargetAmount(provider: ContractProvider): Promise<coins> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_target_amount', []));
        return r.readBigInt();
    }
}
