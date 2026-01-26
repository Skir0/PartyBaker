import { toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { GiftWallet } from '../wrappers/GiftWallet';

export async function run(provider: NetworkProvider) {
    const partyBaker = provider.open(GiftWallet.createFromConfig({

    }, await compile('PartyBaker')));

    await partyBaker.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(partyBaker.address);

    // run methods on `partyBaker`
}
