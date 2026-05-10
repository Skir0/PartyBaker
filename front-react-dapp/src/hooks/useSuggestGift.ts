import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { SuggestGiftFormData } from '../types/event.types.ts';
import { createGift } from '../api/giftService.ts';
import type { CreateGiftRequest } from '../api/requests.ts';

const initialForm: SuggestGiftFormData = {
    giftName: '',
    storeWebsite: '',
    priceTon: 0,
    description: '',
};

export function useSuggestGift() {
    const navigate = useNavigate();
    const location = useLocation();
    const recipientIdFromState = (location.state as { recipientId?: number } | null)?.recipientId;
    const eventIdFromState = (location.state as { eventId?: number } | null)?.eventId;

    const [formData, setFormData] = useState<SuggestGiftFormData>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange =
        (field: keyof SuggestGiftFormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleToolbarBack = () => {

        navigate(-1);
    };


    const handlePostSuggestion = async () => {
        setIsSubmitting(true);
        try {
            // Wire to POST /api/... when the backend endpoint is available.
            console.info('Post suggestion', { recipientIdFromState, formData });

            const req: CreateGiftRequest = {
                name: formData.giftName,
                link: formData.storeWebsite,
                target_amount: Number(formData.priceTon),
                contract_address: "smth_for_test",
                jetton_address: "smth_for_test",
                recipient_id: recipientIdFromState!,
                // for test
                description: formData.description,
                image_url: "smth_for_test",
            };
            await createGift(req, eventIdFromState!);
            navigate(-1);
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        handleChange,
        handleToolbarBack,
        handlePostSuggestion,
    };
}
