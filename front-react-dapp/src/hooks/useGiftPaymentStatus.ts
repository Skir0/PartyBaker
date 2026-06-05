import { useEffect, useState } from 'react';
import type { PayerResponse } from '../types/event-domain.types.ts';
import { getCurrentPayer, getPayersInfoForRecipient } from '../api/participantsService.ts';
import { deployGiftContract } from '../api/giftService.ts';

export function useGiftPaymentStatus(eventId: number, recipientId: number, giftId: number, contractAddress: string) {
    const [allPayers, setAllPayers] = useState<PayerResponse[]>();
    const [visiblePayers, setVisiblePayers] = useState<PayerResponse[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isDeploying, setIsDeploying] = useState(false);
    const [deployError, setDeployError] = useState<string | null>(null);
    const [deployedAddress, setDeployedAddress] = useState(contractAddress ?? '');
    const hasDeployment = deployedAddress.length > 0;
    const [currentPayer, setCurrentPayer] = useState<PayerResponse>();


    const pageSize = 5;

    useEffect(() => {
        const loadCurrentPayer = async () => {
            console.log("gift id", giftId)
            const response = await getCurrentPayer(giftId) as PayerResponse;

            console.log("current payer", currentPayer)
            setCurrentPayer(response);
        }
        void loadCurrentPayer();
    }, [giftId, recipientId]);

    useEffect(() => {
        const loadPayers = async () => {
            const response = await getPayersInfoForRecipient(eventId, recipientId) as PayerResponse[];
            console.log("payers from front", response)
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

    const handleDeploy = async () => {
        if (!giftId || isDeploying || hasDeployment) {
            return;
        }

        setIsDeploying(true);
        setDeployError(null);

        try {
            const response = await deployGiftContract(giftId);
            setDeployedAddress(response.address);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to deploy contract';
            setDeployError(message);
        } finally {
            setIsDeploying(false);
        }
    };


    // useEffect(() => {
    //     if (!eventId) {
    //         return
    //     }
    //     const loadSelectedGifts = async () => {
    //         try {
    //             const response = await getSelectedGiftsOfEvent(eventId);
    //
    //             if (!Array.isArray(response)) {
    //                 throw new Error('Invalid finalizeEvent response');
    //             }
    //
    //             const selectedGiftsByRecipient: Record<number, GiftInfoResponse> = {};
    //
    //             response.forEach((giftInfo: GiftInfoResponse) => {
    //                 selectedGiftsByRecipient[giftInfo.recipient_id] = giftInfo;
    //             });
    //
    //             setSelectedGifts(selectedGiftsByRecipient);
    //         }
    //         catch (error){
    //             // setError(current => current ?? `Failed to finalize event. ${error instanceof Error ? error.message : String(error)}`);
    //         }
    //     }
    //     void loadSelectedGifts();
    // }, [eventId, recipientId])


    return {
        visiblePayers,
        allPayers,
        currentPayer,
        hasMore,
        loadMore,
        isLoading,
        deployError,
        deployedAddress,
        isDeploying,
        hasDeployment,
        handleDeploy,
        // selectedGifts
    };


}