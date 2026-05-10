import { useEffect, useState } from 'react';
import type { EventFormData, EventResponse } from '../types/event.types.ts';
import { deleteEvent, getEventsOfCurrentUser, getRecipientsOfEvent, updateEvent } from '../api/giftService.ts';
import { useNavigate } from 'react-router';


export function useEventsDashboard() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
    const [adminFormData, setAdminFormData] = useState<EventFormData>({
        eventName: '',
        eventDate: '',
        contributionDeadline: ''
    });
    const [isCancelConfirming, setIsCancelConfirming] = useState(false);



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
        const recipientsOfEvent = await getRecipientsOfEvent(event.id)

        navigate(`/events/${event.id}/gifts`, {
            state: { event, recipientsOfEvent }
        });
    };

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

    return {
        isLoading,
        error,
        events,
        selectedEvent,
        adminFormData,
        isCancelConfirming,
        adminSettingsClick,
        handleAdminFormChange,
        handleSaveAdminChanges,
        handleConfirmCancelEvent,
        openEventGiftPoll,
        closeAdminSheet,
        setIsCancelConfirming,
        summaryStats,
    }

}