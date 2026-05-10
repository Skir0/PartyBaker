import { MaterialIcon } from '../ui/MaterialIcon.tsx';

interface GiftStoreWebsiteFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GiftStoreWebsiteField({ value, onChange }: GiftStoreWebsiteFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">Store Website</label>
            <div className="flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 shadow-sm border border-outline-variant/10">
                <input
                    type="url"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface font-medium placeholder:text-outline-variant/60"
                    placeholder="https://amazon.com/..."
                />
                <MaterialIcon icon="link" size="text-xl" className="text-primary ml-2" />
            </div>
        </div>
    );
}
