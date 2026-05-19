import { useEffect, useState } from 'react';
import type { PayerResponse } from '../types/event-domain.types.ts';
import { getPayersInfoForRecipient } from '../api/participantsService.ts';

export function useGiftPaymentStatus(eventId: number, recipientId: number) {
    const [allPayers, setAllPayers] = useState<PayerResponse[]>();
    const [visiblePayers, setVisiblePayers] = useState<PayerResponse[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 5;

    useEffect(() => {
        const loadPayers = async () => {
            const response = await getPayersInfoForRecipient(eventId, recipientId) as PayerResponse[];
            setAllPayers(response);
            setVisiblePayers(response.slice(0, Math.min(pageSize, response.length)))
            setLoadedCount(Math.min(pageSize, response.length));
            if (response) {
                setHasMore(response.length > 0 && response.length > pageSize);
                await loadMore();
            }
        };
        void loadPayers();
    }, [eventId, recipientId]);

    const loadMore = async () => {
        if (isLoading || !allPayers) return;

        setIsLoading(true);
        const nextIndex = loadedCount + pageSize;
        const nextPayers = allPayers.slice(0, nextIndex);
        setVisiblePayers(nextPayers);
        setLoadedCount(nextIndex);

        if (nextIndex >= allPayers.length) {
            setHasMore(false);
        }
        setIsLoading(false);
    };

    return {
        visiblePayers,
        allPayers,
        hasMore,
        loadMore,
        isLoading
    };
}