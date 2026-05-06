import { MaterialIcon } from './MaterialIcon.tsx';

interface SuggestGiftButtonProps {
    onClick?: () => void;
}

export function SuggestGiftButton({ onClick }: SuggestGiftButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-surface-container-low font-medium text-primary transition-colors hover:bg-surface-container-high"
        >
            <MaterialIcon icon="add_circle" fill />
            <span>Suggest a Gift</span>
        </button>
    );
}
