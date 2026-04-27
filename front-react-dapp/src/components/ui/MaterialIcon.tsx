import type { MaterialIconProps } from '../../types/event.types.ts';

export function MaterialIcon({
                                 icon,
                                 fill = false,
                                 className = '',
                                 size = 'text-2xl',
                                 onClick
                             }: MaterialIconProps) {
    return (
        <span
            className={`material-symbols-outlined inline-block flex-shrink-0 leading-none ${size} ${className}`}
            style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
            onClick={onClick}
        >
      {icon}
    </span>
    );
}