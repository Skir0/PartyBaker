import { useLocation, useNavigate, useParams } from 'react-router';
import { TopAppBar } from '../components/ui/TopAppBar.tsx';
import { EventGiftPollHeader } from '../components/ui/EventGiftPollHeader.tsx';
import { SuggestGiftButton } from '../components/ui/SuggestGiftButton.tsx';
import { GiftSuggestionCard } from '../components/cards/GiftSuggestionCard.tsx';
import { EventGiftPollNav } from '../components/ui/EventGiftPollNav.tsx';
import { RecipientFolders } from '../components/ui/RecipientFolders.tsx';

import type {
    EventResponse,

    RecipientResponse
} from '../types/event.types.ts';
import { useEventGiftPoll } from '../hooks/useEventGiftPoll.ts';



export function EventGiftPollPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ eventId: string }>();
    const routeState = location.state as { event?: EventResponse; recipientsOfEvent?: RecipientResponse[] } | null;


    const {
        event,
        isLoading,
        error,
        recipientFolders,
        setActiveFolderId,
        activeFolder,
        isLoadingRecipientGifts,
        handleToggleLike
    } = useEventGiftPoll(params.eventId, routeState);

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
                                <GiftSuggestionCard key={suggestion.id} suggestion={suggestion}
                                                    handleToggleLike={handleToggleLike}/>
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
                            <SuggestGiftButton
                                onClick={() => {
                                    if (!params.eventId || !activeFolder?.id) return;
                                    const prefix = 'recipient-';
                                    if (!activeFolder.id.startsWith(prefix)) return;
                                    const recipientId = Number(activeFolder.id.slice(prefix.length));
                                    const eventId = event.id;
                                    if (Number.isNaN(recipientId)) return;
                                    navigate(`/events/${params.eventId}/gifts/suggest`, {
                                        state: { recipientId,  eventId},
                                    });
                                }}
                            />
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
