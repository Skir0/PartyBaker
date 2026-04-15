import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

WebApp.ready();

const manifestUrl = '/Users/kirill_smychok/CLionProjects/tolk_projects/PartyBaker/front-react-dapp/public/tonconnect-manifest.json';

createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <App />
    </TonConnectUIProvider>
);