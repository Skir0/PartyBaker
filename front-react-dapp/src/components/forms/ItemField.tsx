import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { SheetType } from '../ui/AdminSheet.tsx';

export interface ItemNameFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    propertyName?: string;
    item: SheetType;
    type?: string;
}

export function ItemField({ value, onChange, propertyName, item, type = "text"}: ItemNameFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">
                {item.valueOf()} {propertyName}
            </label>
            <div className="group flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 transition-all focus-within:ring-1 focus-within:ring-primary shadow-sm border border-outline-variant/10">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline/60 font-medium"
                    placeholder={"Enter " + propertyName?.toLowerCase()}
                />
                <MaterialIcon icon="edit" size="text-lg" className="text-outline ml-2" />
            </div>
        </div>
    );
}
