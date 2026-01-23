import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { PartyBaker } from '../wrappers/PartyBaker';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('PartyBaker', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PartyBaker');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let partyBaker: SandboxContract<PartyBaker>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        partyBaker = blockchain.openContract(PartyBaker.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await partyBaker.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: partyBaker.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and partyBaker are ready to use
    });
});
