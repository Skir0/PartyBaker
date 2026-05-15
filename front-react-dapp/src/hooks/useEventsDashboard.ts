import { useEffect, useState } from 'react';
import type { EventFormData } from '../types/form.types.ts';
import type { EventResponse } from '../types/event-domain.types.ts';
import { useNavigate } from 'react-router';
import { getEventsOfCurrentUser } from '../api/eventService.ts';
import { getRecipientsOfEvent } from '../api/participantsService.ts';


export function useEventsDashboard() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [selectedEvent] = useState<EventResponse | null>(null);
    const [adminFormData] = useState<EventFormData>({
        eventName: '',
        eventDate: '',
        contributionDeadline: ''
    });
    const [isCancelConfirming] = useState(false);



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



    const openEventGiftPoll = async (event: EventResponse) => {
        const recipientsOfEvent = await getRecipientsOfEvent(event.id)

        navigate(`/events/${event.id}/gifts`, {
            state: { recipientsOfEvent }
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
        setEvents,
        selectedEvent,
        adminFormData,
        isCancelConfirming,
        summaryStats,
        openEventGiftPoll
    }
}
