import type { SuggestGiftFormData, GiftFormData } from './form.types.ts';

export interface SuggestGiftFormProps {
    formData: SuggestGiftFormData;
    onChange: (
        field: keyof SuggestGiftFormData
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface ChangeGiftFormProps {
    formData: GiftFormData;
    onChange: (field: keyof GiftFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}
