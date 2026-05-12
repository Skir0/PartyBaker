import { MaterialIcon } from './MaterialIcon.tsx';
import { useLocation, useNavigate } from 'react-router';

const navItems = [
    { icon: 'redeem', label: 'My events', active: true, link: "/" },
    { icon: 'person', label: 'Join event', active: false, link: "/events/join"},
    { icon: 'featured_play_list', label: 'My Gifts', active: false, link: "/events/1/gifts" },
];

export function BottomNavBar() {

    const location = useLocation();
    const navigate = useNavigate();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c0c7d3]/10 bg-[#f9f9fa]/90 pb-safe backdrop-blur-lg">
            <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.link;

                    return (
                        <button
                            key={item.label}
                            className={`flex flex-col items-center justify-center transition-opacity active:opacity-70 ${
                                isActive ? 'text-[#005f9e]' : 'text-[#707579]'
                            }`}
                            onClick={() => navigate(item.link)}
                        >
                            <MaterialIcon icon={item.icon} fill={isActive} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
