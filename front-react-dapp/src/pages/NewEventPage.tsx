import { TopAppBar } from '../components/ui/TopAppBar';
import { BottomButton } from '../components/ui/BottomButton';
import { StepHeaderCard } from '../components/cards/StepHeaderCard';
import { EventForm } from '../components/forms/EventForm';
import { StreamlineCard } from '../components/cards/StreamlineCard';
import { useNewEvent } from '../hooks/useNewEvent.ts';

export function NewEventPage() {

    const {
        handleBack,
        formData,
        isSubmitting,
        submitMessage,
        submitError,
        handleCreate,
        handleChange
    } = useNewEvent();

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
