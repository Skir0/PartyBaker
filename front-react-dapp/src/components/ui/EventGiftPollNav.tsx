import { MaterialIcon } from './MaterialIcon.tsx';

const navItems = [
    { icon: 'poll', label: 'Poll', active: true },
    { icon: 'analytics', label: 'Status', active: false },
    { icon: 'settings', label: 'Settings', active: false }
];

export function EventGiftPollNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/10 bg-background">
            <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-around px-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className={`flex flex-col items-center justify-center transition-opacity active:opacity-70 ${
                            item.active ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                    >
                        <MaterialIcon icon={item.icon} fill={item.active} />
                        <span className="mt-1 text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
