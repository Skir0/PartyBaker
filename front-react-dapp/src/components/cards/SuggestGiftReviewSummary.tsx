import type { SuggestGiftFormData } from '../../types/event.types.ts';

interface SuggestGiftReviewSummaryProps {
    formData: SuggestGiftFormData;
}

export function SuggestGiftReviewSummary({ formData }: SuggestGiftReviewSummaryProps) {
    const rows = [
        { label: 'Gift Name', value: formData.giftName || '—' },
        { label: 'Store Website', value: formData.storeWebsite || '—' },
        { label: 'Price (TON)', value: formData.priceTon || '—' },
        { label: 'Description', value: formData.description || '—' },
    ];

    return (
        <section className="rounded-xl bg-surface-container-low p-4 space-y-3 text-sm border border-outline-variant/10 shadow-sm">
            {rows.map((row) => (
                <div key={row.label} className="space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{row.label}</p>
                    <p className="text-on-surface font-medium break-words whitespace-pre-wrap">{row.value}</p>
                </div>
            ))}
        </section>
    );
}
