import { MaterialIcon } from '../ui/MaterialIcon.tsx';

interface GiftPriceTonFieldProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GiftPriceTonField({ value, onChange }: GiftPriceTonFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">Price (TON)</label>
            <div className="flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 shadow-sm border border-outline-variant/10">
                <input
                    type="number"
                    inputMode="decimal"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface font-medium placeholder:text-outline-variant/60"
                    placeholder="0.00"
                    min={0}
                    step="any"
                />
                <MaterialIcon icon="payments" size="text-xl" className="text-primary ml-2" />
            </div>
        </div>
    );
}
