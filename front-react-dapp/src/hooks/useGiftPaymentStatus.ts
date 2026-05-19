import { useEffect, useState } from 'react';
import type { RecipientResponse } from '../types/event-domain.types.ts';
import { getPayersForRecipient } from '../api/participantsService.ts';

export function useGiftPaymentStatus(eventId: number, recipientId: number) {
    const [allPayers, setAllPayers] = useState<RecipientResponse[]>();
    const [visiblePayers, setVisiblePayers] = useState<RecipientResponse[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 5;

    useEffect(() => {
        const loadPayers = async () => {
            const response = await getPayersForRecipient(eventId, recipientId) as RecipientResponse[];
            setAllPayers(response);
            setLoadedCount(0);
            if (response) {
                setHasMore(response.length > 0);
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