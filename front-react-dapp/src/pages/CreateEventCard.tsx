import { HeaderBar } from '../components/ui/HeaderBar.tsx';
import { JoinExistingEventCard } from '../components/cards/JoinExistingEventCard.tsx';
import { OrDivider } from '../components/ui/OrDivider.tsx';
import { CreateNewEventCard } from '../components/cards/CreateNewEventCard.tsx';
import { BottomNavBar } from '../components/ui/BottomNavBar.tsx';


export function CreateEventCard() {
    return (
        <div className="bg-background text-on-surface flex flex-col min-h-screen">
            <HeaderBar title="Group Gift" onBack={() => console.log('Back')} />
            <main className="flex-grow pt-20 px-4 pb-24 max-w-md mx-auto w-full flex flex-col">
                <div className="mb-10 text-left">
                    <h2 className="text-3xl font-semibold text-on-surface mb-2 tracking-tight">Welcome</h2>
                    <p className="text-on-surface-variant font-medium leading-snug">Create a shared gift pool or join an existing celebration with your friends.</p>
                </div>
                <section className="space-y-4">
                    <JoinExistingEventCard />
                    <OrDivider />
                    <CreateNewEventCard to="/eventForm" />
                </section>
                <div className="mt-auto pt-12 opacity-40 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary/20 to-secondary-container/20 rounded-full blur-2xl"></div>
                </div>
            </main>
            <BottomNavBar/>
        </div>
    );
}
