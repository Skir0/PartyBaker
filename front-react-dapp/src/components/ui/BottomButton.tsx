import { MaterialIcon } from './MaterialIcon.tsx';
import type { BottomButtonProps } from '../../types/event.types.ts';

export function BottomButton({ text, icon, onClick }: BottomButtonProps) {
    return (
        <footer className="fixed bottom-0 w-full bg-surface-bright p-4 safe-bottom z-50">
            <button
                onClick={onClick}
                className="w-full bg-[#2481CC] text-white font-semibold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <span>{text}</span>
                {icon && <MaterialIcon icon={icon} size="text-lg" />}
            </button>
        </footer>
    );
}