import './App.css';

import { Route, Routes } from 'react-router';
import { NewEventPage } from './pages/NewEventPage.tsx';
import { CreateEventCard } from './pages/CreateEventCard.tsx';
import { EventsDashboardPage } from './pages/EventsDashboardPage.tsx';

function App() {

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<EventsDashboardPage />} />
                    <Route path="/join" element={<CreateEventCard />} />
                    <Route path="/eventForm" element={<NewEventPage />} />
                </Routes>
            </main>

        </div>
    );

}

export default App;
