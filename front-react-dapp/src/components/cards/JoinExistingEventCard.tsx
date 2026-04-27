import { MaterialIcon } from '../../components/ui/MaterialIcon.tsx';

export function JoinExistingEventCard() {
    return (
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <MaterialIcon icon="group_add" className="text-primary" fill={true} />
                <h3 className="text-on-surface font-semibold text-base">Join Existing Event</h3>
            </div>
            <div className="relative mb-4">
                <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary text-lg font-medium tracking-widest uppercase"
                    placeholder="Enter 6-digit code"
                    type="number"
                />
            </div>
            <button className="w-full h-[52px] bg-primary text-on-primary font-semibold rounded-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                Join Event
                <MaterialIcon icon="arrow_forward" className="text-sm" />
            </button>
        </div>
    );
}
