import './App.css'

import {
    TonConnectUIProvider,
    TonConnectButton,
    useTonConnectUI,
    useTonWallet,
    CHAIN,
} from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { createEvent, getGifts, getUserProfile, healthCheck } from './api/giftService.ts';
import type { CreateEventRequest } from './api/requests.ts';
import CreateEventCard from './pages/components/CreateEventCard.tsx';

function App() {

    const wallet = useTonWallet();

    let event: CreateEventRequest = {
        name: "Dasha's birthday",
        date: "2030-04-10",
        deadline: "2030-04-10",
        admin_id: 12345678
    }
    useEffect(() => {
        healthCheck().then(data => console.log("Server:", data))
        getGifts().then(data => console.log("Gifts:", data))
        getUserProfile().then(data => console.log("Gifts:", data))
        createEvent(event).then(data => console.log("Created event", data))

    }, []);

    return (

        <TonConnectUIProvider
            manifestUrl="https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json">
            <TonConnectButton />

            <CreateEventCard></CreateEventCard>
        </TonConnectUIProvider>
    );
}
export default App