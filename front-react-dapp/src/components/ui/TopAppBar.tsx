import { MaterialIcon } from './MaterialIcon.tsx';
import type { TopAppBarProps } from '../../types/event.types.ts';

export function TopAppBar({ title, onBack, onNext }: TopAppBarProps) {
    return (
        <header className="fixed top-0 w-full z-50 bg-[#f9f9fa]/80 dark:bg-[#1a1c1d]/80 backdrop-blur-md flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="active:scale-95 transition-transform text-[#005f9e] dark:text-[#40a7e3]"
                >
                    <MaterialIcon icon="arrow_back" />
                </button>
                <h1 className="font-semibold text-lg text-[#1a1c1d] dark:text-[#f9f9fa]">{title}</h1>
            </div>
            <button
                onClick={onNext}
                className="font-semibold text-lg text-[#005f9e] dark:text-[#40a7e3] active:scale-95 transition-transform hover:opacity-80"
            >
                Next
            </button>
        </header>
    );
}