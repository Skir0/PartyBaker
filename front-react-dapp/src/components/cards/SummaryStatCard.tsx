import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { SummaryStatCardProps } from '../../types/ui-common.types.ts';

export function SummaryStatCard({ icon, iconClassName, label, value }: SummaryStatCardProps) {
    return (
        <div className="flex h-32 flex-col justify-between rounded-xl bg-surface-container-low p-4">
            <MaterialIcon icon={icon} fill={true} className={iconClassName} size="text-3xl" />
            <div>
                <p className="text-xs font-medium text-on-surface-variant">{label}</p>
                <p className="text-2xl font-bold text-on-surface">{value}</p>
            </div>
        </div>
    );
}
