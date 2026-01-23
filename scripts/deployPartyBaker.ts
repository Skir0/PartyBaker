import { toNano } from '@ton/core';
import { PartyBaker } from '../wrappers/PartyBaker';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const partyBaker = provider.open(PartyBaker.createFromConfig({}, await compile('PartyBaker')));

    await partyBaker.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(partyBaker.address);

    // run methods on `partyBaker`
}
