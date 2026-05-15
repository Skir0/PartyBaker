import { GiftSuggestNameField } from './GiftSuggestNameField.tsx';
import { GiftStoreWebsiteField } from './GiftStoreWebsiteField.tsx';
import { GiftPriceTonField } from './GiftPriceTonField.tsx';
import { GiftSuggestDescriptionField } from './GiftSuggestDescriptionField.tsx';
import { SuggestGiftInfoNote } from './SuggestGiftInfoNote.tsx';
import type { SuggestGiftFormProps } from '../../types/gift-ui.types.ts';

export function SuggestGiftForm({ formData, onChange }: SuggestGiftFormProps) {
    return (
        <div className="space-y-3">
            <GiftSuggestNameField value={formData.giftName} onChange={onChange('giftName')} />
            <GiftStoreWebsiteField value={formData.storeWebsite} onChange={onChange('storeWebsite')} />
            <GiftPriceTonField value={formData.priceTon} onChange={onChange('priceTon')} />
            <GiftSuggestDescriptionField value={formData.description} onChange={onChange('description')} />
            <SuggestGiftInfoNote />
        </div>
    );
}
