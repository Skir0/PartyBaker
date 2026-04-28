import { MaterialIcon } from './MaterialIcon.tsx';

export function EventsDashboardHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-[#f9f9fa]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
                <div className="flex items-center gap-2 text-[#1a1c1d]">
                    <MaterialIcon icon="card_giftcard" className="text-[#005f9e]" />
                    <span className="text-lg font-bold tracking-tight">Gift Events</span>
                </div>
                <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold tracking-tight text-on-surface">
                    My Events
                </h1>
                <button className="flex h-10 w-10 items-center justify-center text-[#707579] transition-opacity active:opacity-70">
                    <MaterialIcon icon="settings" />
                </button>
            </div>
        </header>
    );
}
