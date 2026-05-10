import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { ItemNameFieldProps } from '../../types/event.types.ts';

export function ItemNameField({ value, onChange, placeholder, item }: ItemNameFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">
                {item.valueOf()[0].toUpperCase()+item.valueOf().substring(1)} Name
            </label>
            <div className="group flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 transition-all focus-within:ring-1 focus-within:ring-primary shadow-sm border border-outline-variant/10">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline/60 font-medium"
                    placeholder={placeholder}
                />
                <MaterialIcon icon="edit" size="text-lg" className="text-outline ml-2" />
            </div>
        </div>
    );
}