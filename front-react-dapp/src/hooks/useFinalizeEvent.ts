import { finalizeEvent } from '../api/eventService.ts';
import { useState, useCallback } from 'react';
import type { GiftInfoResponse } from '../types/gift.types.ts';

export interface FinalizeResult {
    isFinalized: boolean;
    selectedGiftsByRecipient: Record<number, GiftInfoResponse> | null;
}

export function useFinalizeEvent(eventId: number) {
    const [finalizeError, setFinalizeError] = useState<string | null>(null);
    const [isFinalizeLoading, setIsFinalizeLoading] = useState<boolean>(false);
    const [finalizeResult, setFinalizeResult] = useState<FinalizeResult | null>(null);

    const handleFinalizeEvent = useCallback(async (): Promise<FinalizeResult> => {
        setFinalizeError(null);
        setIsFinalizeLoading(true);
        setFinalizeResult(null);

        try {
            const response = await finalizeEvent(eventId);

            if (!Array.isArray(response)) {
                throw new Error('Invalid finalizeEvent response: expected array');
            }

            const selectedGiftsByRecipient: Record<number, GiftInfoResponse> = {};
            response.forEach(giftInfo => {
                selectedGiftsByRecipient[giftInfo.recipient_id] = giftInfo;
            });

            const result: FinalizeResult = {
                isFinalized: true,
                selectedGiftsByRecipient
            };

            setFinalizeResult(result);
            return result;

        } catch (err) {
            const errorMessage = `Failed to finalize event. ${err instanceof Error ? err.message : String(err)}`;
            setFinalizeError(errorMessage);
            return {
                isFinalized: false,
                selectedGiftsByRecipient: null
            };
        } finally {
            setIsFinalizeLoading(false);
        }
    }, [eventId]);

    return {
        finalizeError,
        isFinalizeLoading,
        finalizeResult,
        handleFinalizeEvent
    };
}