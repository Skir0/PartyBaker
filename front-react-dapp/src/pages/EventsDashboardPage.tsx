import { Link } from 'react-router';
import { EventsDashboardHeader } from '../components/ui/EventsDashboardHeader.tsx';
import { SummaryStatCard } from '../components/cards/SummaryStatCard.tsx';
import { EventOverviewCard } from '../components/cards/EventOverviewCard.tsx';
import { BottomNavBar } from '../components/ui/BottomNavBar.tsx';
import { MaterialIcon } from '../components/ui/MaterialIcon.tsx';
import { useEventsDashboard } from '../hooks/useEventsDashboard.ts';
import { useAdminControls } from '../hooks/useAdminControls.ts';
import { SheetType } from '../types/event.types.ts';
import { deleteEvent, updateEvent } from '../api/giftService.ts';
import { AdminSheet } from '../components/ui/AdminSheet.tsx';

export function EventsDashboardPage() {

    const {
        isLoading,
        error,
        events,
        setEvents,
        summaryStats,
        openEventGiftPoll
    } = useEventsDashboard();

    const {
        selectedItem,
        adminFormData,
        isCancelConfirming,
        adminSettingsClick,
        handleAdminFormChange,
        handleSaveAdminChanges,
        handleConfirmCancel,
        closeAdminSheet,
        setIsCancelConfirming
    } = useAdminControls({
        type: SheetType.EVENT,
        data: events,
        setData: setEvents,
        onUpdate: updateEvent,
        onDelete: deleteEvent
    });

    return (
        <div className="min-h-screen bg-background text-on-background">
            <EventsDashboardHeader />
            <main className="mx-auto max-w-2xl px-4 pb-32 pt-14">
                <div className="mb-6 mt-4 grid grid-cols-2 gap-3">
                    {summaryStats.map((stat) => (
                        <SummaryStatCard
                            icon={stat.icon}
                            iconClassName={stat.iconClassName}
                            label={stat.label}
                            value={stat.value}
                        />
                    ))}
                </div>

                <h2 className="mb-3 px-1 text-[14px] font-semibold uppercase tracking-wider text-on-surface">
                    Upcoming Participation
                </h2>

                <div className="flex flex-col gap-3">
                    {error && (
                        <p className="py-2 text-center text-on-surface-variant">{error}</p>
                    )}

                    {events.length === 0 && !isLoading && (
                        <p className="text-on-surface-variant text-center py-8">No events yet.</p>
                    )}

                    {events.map((event) => (
                        <EventOverviewCard
                            key={event.id}
                            title={event.name}
                            participants={`${event.participants_amount} Participants`}
                            status="Active" // you can derive this later
                            eventDate={event.date}
                            deadline={event.deadline}
                            imageUrl={''}
                            imageAlt={''}
                            statusClassName={''}
                            isAdmin={event.is_admin}
                            onSettingsClick={() => adminSettingsClick(event.id)}
                            onClick={() => openEventGiftPoll(event)}
                        />
                    ))}


                    <Link to="/eventForm" className="mt-1 block">
                        <button
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[16px] font-semibold text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                            <MaterialIcon icon="add_circle" fill={true} />
                            <span>Create New Event</span>
                        </button>
                    </Link>
                </div>
            </main>

            <Link
                to="/eventForm"
                className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/30 transition-transform active:scale-95 md:hidden"
            >
                <MaterialIcon icon="add" size="text-3xl" />
            </Link>

            <BottomNavBar />


            <AdminSheet
                isOpen={selectedItem !== null}
                participantCount={
                    selectedItem != null && 'participants_amount' in selectedItem
                        ? selectedItem.participants_amount
                        : 0
                }
                formData={adminFormData}
                isCancelConfirming={isCancelConfirming}
                onChange={handleAdminFormChange}
                onClose={closeAdminSheet}
                onSave={handleSaveAdminChanges}
                onCancelClick={() => setIsCancelConfirming(true)}
                onKeepEvent={() => setIsCancelConfirming(false)}
                onConfirmCancel={handleConfirmCancel}
                type={SheetType.EVENT}
            />


        </div>
    )
        ;
}
