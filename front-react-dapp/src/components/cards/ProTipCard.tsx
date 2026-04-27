import { MaterialIcon } from '../ui/MaterialIcon.tsx';

export function ProTipCard() {
    return (
        <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg border-l-4 border-primary/40">
            <MaterialIcon icon="info" size="text-lg" className="text-primary mt-0.5" />
            <p className="text-[13px] text-on-surface-variant leading-snug">
                <span className="font-semibold text-on-surface">Pro Tip:</span> Contributors must complete their
                payment before this date to be included in the group gift list.
            </p>
        </div>
    );
}