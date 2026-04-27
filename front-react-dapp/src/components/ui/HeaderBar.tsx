import { MaterialIcon } from '../../components/ui/MaterialIcon.tsx';

interface HeaderBarProps {
    title: string;
    onBack?: () => void;
    onClose?: () => void;
}

export function HeaderBar({ title, onBack, onClose }: HeaderBarProps) {
    return (
        <header className="fixed top-0 w-full z-50 bg-[#f9f9fa]/80 backdrop-blur-md border-b border-[#c0c7d3]/10 flex items-center justify-between px-4 h-14 w-full">
            <button
                onClick={onBack}
                className="active:opacity-70 transition-opacity active:scale-95 duration-100 flex items-center justify-center"
            >
                <MaterialIcon icon="arrow_back" className="text-[#005f9e]" />
            </button>
            <h1 className="font-['Inter'] font-semibold text-lg tracking-tight text-[#1a1c1d]">{title}</h1>
            <button
                onClick={onClose}
                className="active:opacity-70 transition-opacity active:scale-95 duration-100 flex items-center justify-center"
            >
                <MaterialIcon icon="close" className="text-[#404751]" />
            </button>
        </header>
    );
}
