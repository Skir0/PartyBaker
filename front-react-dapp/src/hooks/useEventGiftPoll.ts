import { useEffect, useMemo, useState } from 'react';


import {
    addGiftLike, deleteGiftLike,
    getEventsOfCurrentUser,
    getGiftsInfoByRecipient,
    getRecipientsOfEvent
} from '../api/giftService.ts';

import type {
    EventResponse,
    GiftInfo,
    GiftSuggestion,
    RecipientGiftFolder,
    RecipientResponse
} from '../types/event.types.ts';


function formatGiftPrice(value: number): string {
    return `$${value}`;
}

function mapGiftToSuggestion(gift: GiftInfo): GiftSuggestion {
    return {
        id: gift.id,
        title: gift.name,
        price: formatGiftPrice(gift.target_amount),
        description: gift.description || gift.link || 'No description provided.',
        imageUrl: gift.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        imageAlt: gift.name || 'Gift suggestion',
        supporterBadges: [],
        likes: gift.likes_amount ?? 0,
        liked: gift.liked_by_user ?? false,
    };
}

function getRecipientDisplayName(recipient: RecipientResponse): string {
    const fullName = `${recipient.first_name} ${recipient.last_name}`.trim();
    return fullName || `Recipient ${recipient.id}`;
}

function buildRecipientFolders(
    recipients: RecipientResponse[],
    giftsByRecipient: Record<number, GiftInfo[]>
): RecipientGiftFolder[] {

    if (recipients.length > 0) {
        return recipients.map((recipient) => {
            const suggestions = (giftsByRecipient[recipient.id] ?? []).map(mapGiftToSuggestion);
            console.log("suggestions " + recipient.id, suggestions)
            const subtitle = suggestions.length === 0
                ? 'No suggestions yet'
                : `${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'}`;

            return {
                id: `recipient-${recipient.id}`,
                recipientName: getRecipientDisplayName(recipient),
                subtitle,
                suggestions
            };
        });
    }

    return [];
}

export function useEventGiftPoll(eventId: string | undefined, routeState: any) {
    const storageKey = eventId ? `eventGiftPoll.activeFolder.${eventId}` : null;

    const [event, setEvent] = useState<EventResponse | null>(routeState?.event ?? null);
    const [isLoading, setIsLoading] = useState<boolean>(!routeState?.event);
    const [error, setError] = useState<string | null>(null);
    const [activeFolderId, setActiveFolderId] = useState<string>(() => {
        if (!eventId) return '';
        return localStorage.getItem(`eventGiftPoll.activeFolder.${eventId}`) ?? '';
    });
    const [recipients, setRecipients] = useState<RecipientResponse[]>(routeState?.recipientsOfEvent ?? []);
    const [giftsByRecipient, setGiftsByRecipient] = useState<Record<number, GiftInfo[]>>({});
    const [isLoadingRecipientGifts, setIsLoadingRecipientGifts] = useState<boolean>(false);



    const handleToggleLike = async (giftId: number, currentlyLiked: boolean) => {
        if (!activeRecipient) return;

        const recipientId = activeRecipient.id;
        const isNowLiked = !currentlyLiked;

        setGiftsByRecipient((current) => {
            const recipientGifts = current[recipientId] || [];

            const updatedGifts = recipientGifts.map((gift) => {
                if (gift.id === giftId) {
                    return {
                        ...gift,
                        liked_by_user: isNowLiked,
                        likes_amount: (gift.likes_amount ?? 0) + (isNowLiked ? 1 : -1)
                    };
                }
                return gift;
            });

            return {
                ...current,
                [recipientId]: updatedGifts
            };
        });

        try {
            isNowLiked ? await addGiftLike(giftId) : await deleteGiftLike(giftId);
        } catch (err) {
            console.error('Failed to update like status in DB', err);
            setGiftsByRecipient((current) => {
                const recipientGifts = current[recipientId] || [];
                const revertedGifts = recipientGifts.map((gift) => {
                    if (gift.id === giftId) {
                        return {
                            ...gift,
                            liked_by_user: currentlyLiked,
                            likes_amount: (gift.likes_amount ?? 0) + (currentlyLiked ? 1 : -1)
                        };
                    }
                    return gift;
                });
                return { ...current, [recipientId]: revertedGifts };
            });
        }
    };

    useEffect(() => {
        if (!storageKey) return;
        if (!activeFolderId) {
            localStorage.removeItem(storageKey);
            return;
        }
        localStorage.setItem(storageKey, activeFolderId);
    }, [storageKey, activeFolderId]);


    useEffect(() => {
        if (event || !eventId) {
            return;
        }

        const loadEvent = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const events = await getEventsOfCurrentUser();
                const matchedEvent = (events as EventResponse[]).find((item: EventResponse) => item.id === Number(eventId)) ?? null;

                if (!matchedEvent) {
                    setError('Event not found.');
                    return;
                }

                setEvent(matchedEvent);
            } catch {
                setError('Failed to load event.');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvent();
    }, [event, eventId]);

    useEffect(() => {
        if (!eventId || recipients.length > 0) {
            return;
        }

        const loadRecipients = async () => {
            try {
                const response = await getRecipientsOfEvent(Number(eventId));
                setRecipients(Array.isArray(response) ? response : []);
            } catch {
                setError((current) => current ?? 'Failed to load recipients.');
            }
        };

        void loadRecipients();
    }, [eventId, recipients.length]);


    const recipientFolders = useMemo(() => {
        return buildRecipientFolders(recipients, giftsByRecipient);
    }, [giftsByRecipient, recipients]);

    useEffect(() => {
        if (recipientFolders.length === 0) {
            setActiveFolderId('');
            return;
        }

        setActiveFolderId((current) => {
            if (current && recipientFolders.some((f) => f.id === current)) return current;

            const saved = storageKey ? localStorage.getItem(storageKey) : null;
            if (saved && recipientFolders.some((f) => f.id === saved)) return saved;

            return recipientFolders[0].id;
        });
    }, [recipientFolders, storageKey]);

    const activeFolder = useMemo(
        () => recipientFolders.find((folder) => folder.id === activeFolderId) ?? recipientFolders[0] ?? null,
        [activeFolderId, recipientFolders]
    );

    const activeRecipient = useMemo(
        () => recipients.find((recipient) => `recipient-${recipient.id}` === activeFolderId) ?? recipients[0] ?? null,
        [activeFolderId, recipients]
    );

    useEffect(() => {
        if (!event || recipients.length === 0) return;

        let cancelled = false;

        const loadAllRecipientGifts = async () => {
            setIsLoadingRecipientGifts(true);
            setError(null);

            try {
                const results = await Promise.all(
                    recipients.map(async (recipient) => {
                        const response = await getGiftsInfoByRecipient(event.id, recipient.id);
                        return [recipient.id, Array.isArray(response) ? response : []] as const;
                    })
                );

                if (cancelled) return;

                const giftsMap: Record<number, GiftInfo[]> = {};
                for (const [recipientId, gifts] of results) {
                    giftsMap[recipientId] = gifts;
                }

                setGiftsByRecipient(giftsMap);
            } catch {
                if (!cancelled) {
                    setError((current) => current ?? 'Failed to load recipient gifts.');
                }
            } finally {
                if (!cancelled) setIsLoadingRecipientGifts(false);
            }
        };

        void loadAllRecipientGifts();

        return () => {
            cancelled = true;
        };
    }, [event?.id, recipients]);


    return {
        event,
        isLoading,
        error,
        recipientFolders,
        activeFolderId,
        setActiveFolderId,
        activeFolder,
        isLoadingRecipientGifts,
        handleToggleLike
    };
}