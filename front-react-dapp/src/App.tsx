import './App.css'

import {
    TonConnectUIProvider,
    TonConnectButton,
    useTonConnectUI,
    useTonWallet,
    CHAIN,
} from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { getGifts, getUserProfile, healthCheck } from './api/giftService.ts';

function App() {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    const sendToncoin = async (amount: string) => {
        if (!wallet) return;

        // Once the user has connected,
        // you can prepare and send a message from the wallet:
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300,
                network: CHAIN.TESTNET,
                messages: [{ address: wallet.account.address, amount }],
            });
        }
        catch (error) {

        }
    };

    useEffect(() => {
        healthCheck().then(data => console.log("Server:", data))
        getGifts().then(data => console.log("Gifts:", data))
        getUserProfile().then(data => console.log("Gifts:", data))

    }, []);

    return (
        <TonConnectUIProvider

            manifestUrl="https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json"
        >
            <TonConnectButton />
            <button

                onClick={() => sendToncoin(String(100_000_000))}
            >
                Send 0.1 TON
            </button>
        </TonConnectUIProvider>
    );
}
export default App