import { MaterialIcon } from './MaterialIcon.tsx';
import type { TopAppBarProps } from '../../types/event.types.ts';
import { TonConnectButton } from '@tonconnect/ui-react';

export function TopAppBar({ title, onBack, endSlot }: TopAppBarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9fa]/80 dark:bg-[#1a1c1d]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="active:scale-95 transition-transform text-[#005f9e] dark:text-[#40a7e3] shrink-0"
                >
                    <MaterialIcon icon="arrow_back" />
                </button>
                <h1 className="min-w-0 truncate font-semibold text-lg text-[#1a1c1d] dark:text-[#f9f9fa]">{title}</h1>
            </div>
            <div className="shrink-0 flex items-center justify-end">
                {endSlot ?? <TonConnectButton />}
            </div>
            </div>
        </header>
    );
}
