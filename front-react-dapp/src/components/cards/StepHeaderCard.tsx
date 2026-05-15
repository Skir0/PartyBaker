import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { StepHeaderCardProps } from '../../types/ui-common.types.ts';

export function StepHeaderCard({ step, title, description }: StepHeaderCardProps) {
    return (
        <div className="mb-8 rounded-xl bg-surface-container-low p-6 overflow-hidden relative">
            <div className="relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
          {step}
        </span>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">{title}</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-[240px]">
                    {description}
                </p>
            </div>
            <div className="absolute -right-1 -bottom-4 opacity-10">
                <MaterialIcon icon="redeem" fill={true} size="!text-9xl" />
            </div>
        </div>
    );
}
