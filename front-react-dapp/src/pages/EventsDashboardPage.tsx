import { Link, useNavigate } from 'react-router';
import { EventsDashboardHeader } from '../components/ui/EventsDashboardHeader.tsx';
import { SummaryStatCard } from '../components/cards/SummaryStatCard.tsx';
import { EventOverviewCard } from '../components/cards/EventOverviewCard.tsx';
import { BottomNavBar } from '../components/ui/BottomNavBar.tsx';
import { EventAdminSheet } from '../components/ui/EventAdminSheet.tsx';
import { MaterialIcon } from '../components/ui/MaterialIcon.tsx';
import { useEffect, useState } from 'react';
import { deleteEvent, getEventsOfCurrentUser, getGiftRecipientsOfEvent, updateEvent } from '../api/giftService.ts';
import type { EventFormData, EventResponse } from '../types/event.types.ts';






export function EventsDashboardPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
    const [adminFormData, setAdminFormData] = useState<EventFormData>({
        eventName: '',
        eventDate: '',
        contributionDeadline: ''
    });
    const [isCancelConfirming, setIsCancelConfirming] = useState(false);

    const summaryStats = [
        {
            icon: 'celebration',
            iconClassName: 'text-primary',
            label: 'Active Events',
            value: events.length
        },
        {
            icon: 'history_edu',
            iconClassName: 'text-tertiary',
            label: 'Gifts Shared',
            value: 0
        }
    ];

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getEventsOfCurrentUser();
                console.log(data);
                setEvents(data);
            } catch (err) {
                setError('Failed to load events');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();

    }, []);

    const adminSettingsClick = (eventId: number) => {
        const event = events.find((item) => item.id === eventId) ?? null;
        if (!event) {
            return;
        }

        setSelectedEvent(event);
        setAdminFormData({
            eventName: event.name,
            eventDate: event.date,
            contributionDeadline: event.deadline
        });
        setIsCancelConfirming(false);
    };

    const closeAdminSheet = () => {
        setSelectedEvent(null);
        setIsCancelConfirming(false);
    };

    const handleAdminFormChange = (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSaveAdminChanges = async () => {
        if (!selectedEvent) {
            return;
        }

        try {
            const updatedEvent = await updateEvent(selectedEvent.id, {
                name: adminFormData.eventName,
                date: adminFormData.eventDate,
                deadline: adminFormData.contributionDeadline
            });

            setEvents((prev) =>
                prev.map((event) =>
                    event.id === updatedEvent.id
                        ? updatedEvent
                        : event
                )
            );

            closeAdminSheet();
        } catch {
            setError('Failed to update event');
        }
    };

    const handleConfirmCancelEvent = async () => {
        if (!selectedEvent) {
            return;
        }

        try {
            await deleteEvent(selectedEvent.id);
            setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
            closeAdminSheet();
        } catch {
            setError('Failed to delete event');
        }
    };

    const openEventGiftPoll = async (event: EventResponse) => {
        const recipientsOfEvent = await getGiftRecipientsOfEvent(event.id)
        navigate(`/events/${event.id}/gifts`, {
            state: { event, recipientsOfEvent }
        });
    };


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

            <EventAdminSheet
                isOpen={selectedEvent !== null}
                eventTitle={selectedEvent?.name ?? ''}
                participantCount={selectedEvent?.participants_amount ?? 0}
                formData={adminFormData}
                isCancelConfirming={isCancelConfirming}
                onChange={handleAdminFormChange}
                onClose={closeAdminSheet}
                onSave={handleSaveAdminChanges}
                onCancelClick={() => setIsCancelConfirming(true)}
                onKeepEvent={() => setIsCancelConfirming(false)}
                onConfirmCancel={handleConfirmCancelEvent}
            />
        </div>
    );
}
