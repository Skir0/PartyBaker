
import { useNavigate } from 'react-router';
import { useState } from 'react';
import type { EventFormData } from '../types/form.types.ts';
import type { CreateEventRequest } from '../api/requests.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { createEvent } from '../api/eventService.ts';

export function useNewEvent() {


    const navigate = useNavigate();

    const handleBack = () => {
        console.log('Navigate back');
        navigate(-1);
    };


    const [formData, setFormData] = useState<EventFormData>({
        eventName: '',
        eventDate: '',
        contributionDeadline: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // for test
    const userId = useAuth().user?.id! || 12345678;

    const handleCreate = async () => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        setSubmitError(null);
        console.log("userId", userId)
        try {
            const req: CreateEventRequest = {
                name: formData.eventName,
                date: formData.eventDate,
                deadline: formData.contributionDeadline,
                admin_id: userId
            };

            await createEvent(req);

            setSubmitMessage('Event created successfully.');
        } catch (err: unknown) {
            const errorMessage =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof err.response === 'object' &&
                err.response !== null &&
                'data' in err.response &&
                typeof err.response.data === 'object' &&
                err.response.data !== null &&
                'message' in err.response.data &&
                typeof err.response.data.message === 'string'
                    ? err.response.data.message
                    : err instanceof Error
                        ? err.message
                        : 'Failed to create event.';

            setSubmitError(
                errorMessage
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return {
        formData,
        handleBack,
        isSubmitting,
        submitMessage,
        submitError,
        handleCreate,
        handleChange
    }
}
