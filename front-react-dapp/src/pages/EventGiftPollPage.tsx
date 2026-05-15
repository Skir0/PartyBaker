import { useLocation, useNavigate, useParams } from 'react-router';
import { TopAppBar } from '../components/ui/TopAppBar.tsx';
import { EventGiftPollHeader } from '../components/ui/EventGiftPollHeader.tsx';
import { SuggestGiftButton } from '../components/ui/SuggestGiftButton.tsx';
import { GiftSuggestionCard } from '../components/cards/GiftSuggestionCard.tsx';
import { EventGiftPollNav } from '../components/ui/EventGiftPollNav.tsx';
import { RecipientFolders } from '../components/ui/RecipientFolders.tsx';

import {
    type RecipientResponse,
} from '../types/event-domain.types.ts';
import type { GiftFormData } from '../types/form.types.ts';
import { SheetType } from '../types/sheet.types.ts';
import { useEventGiftPoll } from '../hooks/useEventGiftPoll.ts';
import { useAdminControls } from '../hooks/useAdminControls.ts';
import { deleteGift, updateGift } from '../api/giftService.ts';
import { AdminSheet } from '../components/ui/AdminSheet.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { GiftPaymentStatus } from '../components/ui/GiftPaymentStatus.tsx';


export function EventGiftPollPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ eventId: string }>();
    const routeState = location.state as { recipientsOfEvent?: RecipientResponse[] } | null;


    const {
        event,
        isDeadline,
        isLoading,
        error,
        recipientFolders,
        setActiveFolderId,
        activeFolder,
        isLoadingRecipientGifts,
        handleToggleLike,
        giftsByRecipient,
        setGiftsByRecipient,
        activeRecipient,
        activeMostLikedGift
    } = useEventGiftPoll(params.eventId, routeState);

    const {
        selectedItem,
        adminFormData,
        isCancelConfirming,
        adminSettingsClick,
        closeAdminSheet,
        handleAdminFormChange,
        handleSaveAdminChanges,
        handleConfirmCancel,
        setIsCancelConfirming
    } = useAdminControls({
        type: SheetType.GIFT,
        data: giftsByRecipient,
        setData: setGiftsByRecipient,
        onUpdate: updateGift,
        onDelete: deleteGift,
        recipientId: activeRecipient?.id ?? 0
    });

    const userId = useAuth().user?.id! || 12345678;

    const subtitle = event
        ? `Voted by the group for ${event.name}. ${event.participants_amount} participants are tracking options before ${event.deadline}.`
        : 'Loading event details.';

    function checkAdmin(giftId: number): boolean {
        const recipientId = activeRecipient?.id;
        if (recipientId == null) return false;

        const gift = giftsByRecipient[recipientId]?.find((g) => g.id === giftId);
        if (!gift) return false;
        console.log("id", userId);

        return gift.admin_id === userId;
    }

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

                {!isLoading && !error && event && !isDeadline && (
                    <>
                        {isLoadingRecipientGifts && (
                            <p className="py-10 text-center text-sm text-on-surface-variant">
                                Loading gifts for {activeFolder?.recipientName ?? 'recipient'}...
                            </p>
                        )}

                        <section className="space-y-3">
                            {activeFolder?.suggestions.map((suggestion) => (
                                <GiftSuggestionCard key={suggestion.id} suggestion={suggestion}
                                                    handleToggleLike={handleToggleLike}
                                                    onSettingsClick={() => adminSettingsClick(suggestion.id)}
                                                    isAdmin={checkAdmin(suggestion.id)}/>
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
                                    const recipientId = activeRecipient.id;
                                    const eventId = event.id;
                                    if (Number.isNaN(recipientId)) return;
                                    navigate(`/events/${params.eventId}/gifts/suggest`, {
                                        state: { recipientId, eventId }
                                    });
                                }}
                            />
                        </div>

                        <p className="mb-4 mt-8 text-center text-[11px] text-on-surface-variant/60">
                            Polling ends on {event.deadline}. The selected gift can be finalized after the contribution
                            window closes.
                        </p>
                    </>
                )}
                {!isDeadline && (
                    <GiftPaymentStatus giftTitle={activeMostLikedGift?.name!}
                                       eventTitle={event?.name!}
                                       collectedAmount={activeMostLikedGift?.collected!}
                                       targetAmount={activeMostLikedGift?.target_amount!}
                                       participantsCount={event?.participants_amount!}
                                       payAmount={activeMostLikedGift?.target_amount! / event?.participants_amount!}
                                       participants={[]}
                                       onBack={function(): void {
                        throw new Error('Function not implemented.');
                    } } onPay={function(): void {
                        throw new Error('Function not implemented.');
                    } }/>
                )}


                <AdminSheet
                    isOpen={selectedItem != null}
                    isCancelConfirming={isCancelConfirming}
                    onClose={closeAdminSheet}
                    onSave={handleSaveAdminChanges}
                    onCancelClick={() => setIsCancelConfirming(true)}
                    onKeepEvent={() => setIsCancelConfirming(false)}
                    onConfirmCancel={handleConfirmCancel}
                    formData={adminFormData as GiftFormData}
                    onChange={handleAdminFormChange}
                    type={SheetType.GIFT}
                />
            </main>

            <EventGiftPollNav />


        </div>
    );
}
