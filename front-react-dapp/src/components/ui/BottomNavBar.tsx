import { MaterialIcon } from './MaterialIcon.tsx';

const navItems = [
    { icon: 'redeem', label: 'Events', active: true },
    { icon: 'featured_play_list', label: 'My Gifts', active: false },
    { icon: 'person', label: 'Profile', active: false },
];

export function BottomNavBar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c0c7d3]/10 bg-[#f9f9fa]/90 pb-safe backdrop-blur-lg">
            <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-around px-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`flex flex-col items-center justify-center transition-opacity active:opacity-70 ${
                            item.active ? 'text-[#005f9e]' : 'text-[#707579]'
                        }`}
                    >
                        <MaterialIcon icon={item.icon} fill={item.active} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
