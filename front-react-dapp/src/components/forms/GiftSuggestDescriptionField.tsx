import { MaterialIcon } from '../ui/MaterialIcon.tsx';

interface GiftSuggestDescriptionFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function GiftSuggestDescriptionField({ value, onChange }: GiftSuggestDescriptionFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1">Description</label>
            <div className="flex items-start bg-surface-container-lowest rounded-lg px-4 py-3.5 shadow-sm border border-outline-variant/10">
                <textarea
                    value={value}
                    onChange={onChange}
                    rows={3}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface font-medium placeholder:text-outline-variant/60 resize-none"
                    placeholder="Why would this be a great gift?"
                />
                <MaterialIcon icon="notes" size="text-xl" className="text-primary ml-2" />
            </div>
        </div>
    );
}
