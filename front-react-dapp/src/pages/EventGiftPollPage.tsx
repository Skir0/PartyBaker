import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { TopAppBar } from '../components/ui/TopAppBar.tsx';
import { EventGiftPollHeader } from '../components/ui/EventGiftPollHeader.tsx';
import { SuggestGiftButton } from '../components/ui/SuggestGiftButton.tsx';
import { GiftSuggestionCard } from '../components/cards/GiftSuggestionCard.tsx';
import { EventGiftPollNav } from '../components/ui/EventGiftPollNav.tsx';
import { RecipientFolders } from '../components/ui/RecipientFolders.tsx';
import { getAllGiftsOfRecipient, getEventsOfCurrentUser, getGiftRecipientsOfEvent } from '../api/giftService.ts';
import type { EventResponse, Gift, GiftSuggestion, RecipientGiftFolder, RecipientResponse } from '../types/event.types.ts';

function formatGiftPrice(value: number): string {
    return `$${value}`;
}

function mapGiftToSuggestion(gift: Gift): GiftSuggestion {
    return {
        id: gift.id,
        title: gift.name,
        price: formatGiftPrice(gift.target_amount),
        description: gift.description || gift.link || 'No description provided.',
        imageUrl: gift.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        imageAlt: gift.name || 'Gift suggestion',
        supporterBadges: [],
        likes: gift.likes_amount ?? 0
    };
}

function getRecipientDisplayName(recipient: RecipientResponse): string {
    const fullName = `${recipient.first_name} ${recipient.last_name}`.trim();
    return fullName || `Recipient ${recipient.id}`;
}

function buildRecipientFolders(
    recipients: RecipientResponse[],
    giftsByRecipient: Record<number, Gift[]>
): RecipientGiftFolder[] {
    if (recipients.length > 0) {
        return recipients.map((recipient) => {
            const suggestions = (giftsByRecipient[recipient.id] ?? []).map(mapGiftToSuggestion);
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

export function EventGiftPollPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ eventId: string }>();
    const routeState = location.state as { event?: EventResponse; recipientsOfEvent?: RecipientResponse[] } | null;
    const [event, setEvent] = useState<EventResponse | null>(routeState?.event ?? null);
    const [isLoading, setIsLoading] = useState<boolean>(!routeState?.event);
    const [error, setError] = useState<string | null>(null);
    const [activeFolderId, setActiveFolderId] = useState<string>('');
    const [recipients, setRecipients] = useState<RecipientResponse[]>(routeState?.recipientsOfEvent ?? []);
    const [giftsByRecipient, setGiftsByRecipient] = useState<Record<number, Gift[]>>({});
    const [isLoadingRecipientGifts, setIsLoadingRecipientGifts] = useState<boolean>(false);


    useEffect(() => {
        if (event || !params.eventId) {
            return;
        }

        const loadEvent = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const events = await getEventsOfCurrentUser();
                const matchedEvent = (events as EventResponse[]).find((item: EventResponse) => item.id === Number(params.eventId)) ?? null;

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
    }, [event, params.eventId]);

    useEffect(() => {
        if (!params.eventId || recipients.length > 0) {
            return;
        }

        const loadRecipients = async () => {
            try {
                const response = await getGiftRecipientsOfEvent(Number(params.eventId));
                setRecipients(Array.isArray(response) ? response : []);
            } catch {
                setError((current) => current ?? 'Failed to load recipients.');
            }
        };

        void loadRecipients();
    }, [params.eventId, recipients.length]);


    const recipientFolders = useMemo(() => {
        return buildRecipientFolders(recipients, giftsByRecipient);
    }, [giftsByRecipient, recipients]);

    useEffect(() => {
        if (recipientFolders.length === 0) {
            setActiveFolderId('');
            return;
        }

        setActiveFolderId((current) =>
            recipientFolders.some((folder) => folder.id === current) ? current : recipientFolders[0].id
        );
    }, [recipientFolders]);

    const activeFolder = useMemo(
        () => recipientFolders.find((folder) => folder.id === activeFolderId) ?? recipientFolders[0] ?? null,
        [activeFolderId, recipientFolders]
    );

    const activeRecipient = useMemo(
        () => recipients.find((recipient) => `recipient-${recipient.id}` === activeFolderId) ?? recipients[0] ?? null,
        [activeFolderId, recipients]
    );

    useEffect(() => {
        if (!event || !activeRecipient) {
            return;
        }

        if (giftsByRecipient[activeRecipient.id]) {
            return;
        }

        const loadRecipientGifts = async () => {
            setIsLoadingRecipientGifts(true);

            try {
                const response = await getAllGiftsOfRecipient(event.id, activeRecipient.id);
                setGiftsByRecipient((current) => ({
                    ...current,
                    [activeRecipient.id]: Array.isArray(response) ? response : []
                }));
            } catch {
                setError((current) => current ?? 'Failed to load recipient gifts.');
            } finally {
                setIsLoadingRecipientGifts(false);
            }
        };

        void loadRecipientGifts();
    }, [activeRecipient, event, giftsByRecipient]);

    const subtitle = event
        ? `Voted by the group for ${event.name}. ${event.participants_amount} participants are tracking options before ${event.deadline}.`
        : 'Loading event details.';

    return (
        <div className="min-h-screen bg-background text-on-surface">
            <TopAppBar title="Group Gift" onBack={() => navigate(-1)} />

            <main className="mx-auto max-w-2xl px-4 pb-24 pt-14">
                <EventGiftPollHeader title="Gift Suggestions" subtitle={subtitle} />
                {!isLoading && !error && (
                    <RecipientFolders
                        folders={recipientFolders}
                        activeFolderId={activeFolder?.id ?? ''}
                        onSelect={setActiveFolderId}
                    />
                )}



                {isLoading && (
                    <p className="py-10 text-center text-sm text-on-surface-variant">Loading gift suggestions...</p>
                )}

                {error && (
                    <p className="py-10 text-center text-sm text-error">{error}</p>
                )}

                {!isLoading && !error && event && (
                    <>
                        {isLoadingRecipientGifts && (
                            <p className="py-10 text-center text-sm text-on-surface-variant">
                                Loading gifts for {activeFolder?.recipientName ?? 'recipient'}...
                            </p>
                        )}

                        <section className="space-y-3">
                            {activeFolder?.suggestions.map((suggestion) => (
                                <GiftSuggestionCard key={suggestion.id} suggestion={suggestion} />
                            ))}
                        </section>

                        {!isLoadingRecipientGifts && recipientFolders.length === 0 && (
                            <p className="py-10 text-center text-sm text-on-surface-variant">
                                No recipients for this event yet.
                            </p>
                        )}

                        {!isLoadingRecipientGifts && activeFolder && activeFolder.suggestions.length === 0 && (
                            <p className="py-10 text-center text-sm text-on-surface-variant">
                                No gift suggestions for this recipient yet.
                            </p>
                        )}

                        <div className="py-3">
                            <SuggestGiftButton />
                        </div>

                        <p className="mb-4 mt-8 text-center text-[11px] text-on-surface-variant/60">
                            Polling ends on {event.deadline}. The selected gift can be finalized after the contribution window closes.
                        </p>
                    </>
                )}


            </main>

            <EventGiftPollNav />
        </div>
    );
}
