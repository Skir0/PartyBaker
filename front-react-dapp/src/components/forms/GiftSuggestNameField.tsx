import { MaterialIcon } from '../ui/MaterialIcon.tsx';

interface GiftSuggestNameFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GiftSuggestNameField({ value, onChange }: GiftSuggestNameFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">Gift Name</label>
            <div className="group flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 transition-all focus-within:ring-1 focus-within:ring-primary shadow-sm border border-outline-variant/10">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline/60 font-medium"
                    placeholder="e.g. Mechanical Keyboard"
                />
                <MaterialIcon icon="edit" size="text-lg" className="text-outline ml-2" />
            </div>
        </div>
    );
}
