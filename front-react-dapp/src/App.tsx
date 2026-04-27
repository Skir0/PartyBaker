import './App.css';

import {
    TonConnectButton,
    // useTonWallet
} from '@tonconnect/ui-react';
import { Route, Routes } from 'react-router';
import { NewEventPage } from './pages/NewEventPage.tsx';
import { CreateEventCard } from './pages/CreateEventCard.tsx';

function App() {

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <header style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '20px',
                height: '60px'
            }}>
                <TonConnectButton />
            </header>

            <main style={{ flex: 1, padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<CreateEventCard />} />
                    <Route path="/eventForm" element={<NewEventPage />} />
                </Routes>
            </main>

        </div>
    );

}

export default App;