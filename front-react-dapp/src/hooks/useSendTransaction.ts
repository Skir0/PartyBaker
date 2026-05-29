import { useTonConnectUI } from '@tonconnect/ui-react';
import { TonClient } from '@ton/ton';
import { Address, beginCell } from '@ton/core';
import { toNano } from 'ton';
import { useState } from 'react';

const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});


async function resolveJettonWalletAddress(master: string, owner: string): Promise<string> {
    const result = await client.runMethod(
        Address.parse(master),
        'get_wallet_address',
        // `owner` must be the wallet owner address for which you want to derive a jetton-wallet address.
        // Example: user's TON wallet address or the gift contract address.
        [{ type: 'slice', cell: beginCell().storeAddress(Address.parse(owner)).endCell() }]
    );
    const walletAddress = result.stack.readAddress();
    return walletAddress.toString({ urlSafe: true, bounceable: true });
}


export function useSendTransaction(contractAddress: string, jettonAmount: number) {

    const [tonConnectUi] = useTonConnectUI()


    const [payError, setPayError] = useState<string | null>(null);
    const [payConfirmation, setPayConfirmation] = useState(false);




    const handlePay = async () => {

        setPayConfirmation(true);
        setPayError(null);

        const JETTON_MASTER = "kQBSn8MNUxBnYx2Yj5xjJh9Xk9UU9eqLs4gYPzIgnnkLQ1W_";
        console.log("jetton master", JETTON_MASTER)
        console.log("contract address ", contractAddress)


        const account = tonConnectUi.account;
        if (!account?.address) {
            throw new Error('Connect the wallet first');
        }

        const sender = account.address;
        console.log("sender", sender)


        const senderJettonWallet = await resolveJettonWalletAddress(JETTON_MASTER, sender);


        console.log("user_jetton_wallet", senderJettonWallet)

        const transferBody = beginCell()
            .storeUint(0x0f8a7ea5, 32)
            .storeUint(0n, 64) // query_id
            .storeCoins(jettonAmount)
            .storeAddress(Address.parse(contractAddress))
            .storeAddress(Address.parse(sender))
            .storeBit(0)
            .storeCoins(1n)
            .storeBit(0)
            .endCell()
            .toBoc()
            .toString('base64');

        try {
            await tonConnectUi.sendTransaction({
                validUntil: (Date.now() / 1000) + 200,
                network: '-3',
                messages: [
                    {
                        address: senderJettonWallet,
                        amount: toNano('0.05').toString(),
                        payload: transferBody
                    }
                ],
            });
        }
        catch (e) {
            console.log(e);
            setPayError("Error sending transaction " + e)
            setPayConfirmation(false)
            return
        }
    }

    return {
        payError,
        payConfirmation,
        handlePay
    }
}
