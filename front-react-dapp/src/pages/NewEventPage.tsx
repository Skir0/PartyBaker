import { TopAppBar } from '../components/ui/TopAppBar';
import { BottomButton } from '../components/ui/BottomButton';
import { StepHeaderCard } from '../components/cards/StepHeaderCard';
import { EventForm } from '../components/forms/EventForm';
import { StreamlineCard } from '../components/cards/StreamlineCard';
import type { EventFormData } from '../types/event.types.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { CreateEventRequest } from '../api/requests.ts';
import { createEvent } from '../api/giftService.ts';

export function NewEventPage() {

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

    const handleCreate = async () => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        setSubmitError(null);

        try {
            const req: CreateEventRequest = {
                name: formData.eventName,
                date: formData.eventDate,
                deadline: formData.contributionDeadline,
                admin_id: 12345678
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

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <TopAppBar
                title="New Event"
                onBack={handleBack}
            />

            <main className="flex-grow pt-20 px-4 pb-32 max-w-2xl mx-auto w-full">
                <StepHeaderCard
                    step="Step 1 of 2"
                    title="Configure Your Gift"
                    description="Set the foundation for a memorable group celebration."
                />
                <EventForm formData={formData} onChange={handleChange} />

                <StreamlineCard />

                {submitMessage && (
                    <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {submitMessage}
                    </p>
                )}

                {submitError && (
                    <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {submitError}
                    </p>
                )}

            </main>

            <BottomButton
                text={isSubmitting ? 'Creating...' : 'Create Event'}
                icon="arrow_forward"
                onClick={handleCreate}
                disabled={isSubmitting}
            />
        </div>
    );
}
