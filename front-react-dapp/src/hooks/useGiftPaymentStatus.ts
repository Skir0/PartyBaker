import { useEffect, useState } from 'react';
import type { RecipientResponse } from '../types/event-domain.types.ts';
import { getPayersForRecipient } from '../api/participantsService.ts';



export function useGiftPaymentStatus(eventId: number, recipientId: number) {


    const [payers, setPayers] = useState<RecipientResponse[]>();


    useEffect(() => {
        const loadPayers = async () => {
            const response = await getPayersForRecipient(eventId, recipientId) as RecipientResponse[];
            setPayers(response);
        }
        void loadPayers();
    }, [eventId, recipientId]);

    return {
        payers
    }
}

