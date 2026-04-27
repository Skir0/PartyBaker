import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import { BrowserRouter } from 'react-router';

WebApp.ready();

const manifestUrl = 'https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json';

createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <BrowserRouter>

            <App />
        </BrowserRouter>

    </TonConnectUIProvider>
);