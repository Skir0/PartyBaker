import { MaterialIcon } from '../../components/ui/MaterialIcon.tsx';
import { TonConnectButton } from '@tonconnect/ui-react';

interface HeaderBarProps {
    title: string;
    onBack?: () => void;
}

export function HeaderBar({ title, onBack }: HeaderBarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9fa]/80 backdrop-blur-md border-b border-[#c0c7d3]/10">
            <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-3 px-4">
            <button
                onClick={onBack}
                className="active:opacity-70 transition-opacity active:scale-95 duration-100 flex items-center justify-center shrink-0"
            >
                <MaterialIcon icon="arrow_back" className="text-[#005f9e]" />
            </button>
            <h1 className="min-w-0 flex-1 truncate font-['Inter'] font-semibold text-lg tracking-tight text-[#1a1c1d] text-center">{title}</h1>
            <div className="shrink-0 flex items-center justify-end">
                <TonConnectButton />
            </div>
            </div>
        </header>
    );
}
