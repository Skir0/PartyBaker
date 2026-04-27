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
        navigate(-1)
    };

    const handleNext = () => {
        console.log('Go to next step');
        navigate(1);
    };

    const handleCreate = () => {
        console.log('Create event');

        const req: CreateEventRequest = {
            name: formData.eventName,
            date: formData.eventDate,
            deadline: formData.contributionDeadline,
            admin_id: 23,
        }
        createEvent(req);
    };

    const [formData, setFormData] = useState<EventFormData>({
        eventName: "",
        eventDate: "",
        contributionDeadline: ""
    });

    const handleChange = (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <TopAppBar
                title="New Event"
                onBack={handleBack}
                onNext={handleNext}
            />

            <main className="flex-grow pt-20 px-4 pb-32 max-w-2xl mx-auto w-full">
                <StepHeaderCard
                    step="Step 1 of 2"
                    title="Configure Your Gift"
                    description="Set the foundation for a memorable group celebration."
                />
                <EventForm formData={formData} onChange={handleChange} />

                <StreamlineCard />
            </main>

            <BottomButton
                text="Create Event"
                icon="arrow_forward"
                onClick={handleCreate}
            />
        </div>
    );
}