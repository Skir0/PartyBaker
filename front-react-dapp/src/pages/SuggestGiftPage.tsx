import { TopAppBar } from '../components/ui/TopAppBar.tsx';
import { BottomButton } from '../components/ui/BottomButton.tsx';
import { StepHeaderCard } from '../components/cards/StepHeaderCard.tsx';
import { SuggestGiftForm } from '../components/forms/SuggestGiftForm.tsx';
import { useSuggestGift } from '../hooks/useSuggestGift.ts';

export function SuggestGiftPage() {
    const { formData, isSubmitting, handleChange, handleToolbarBack, handlePostSuggestion, submitStatus, submitMessage } =
        useSuggestGift();


    return (
        <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
            <TopAppBar title="Suggest Gift" onBack={handleToolbarBack} />

            <main className="flex-grow pt-20 px-4 pb-32 max-w-2xl mx-auto w-full">

                <StepHeaderCard
                    title="What's the gift?"
                    description="Share a gift idea with the group. Others can vote for it once suggested."
                    step={''}                />
                <SuggestGiftForm formData={formData} onChange={handleChange} />

                {Boolean(submitMessage) && (
                    <p
                        role="alert"
                        className={`mt-3 rounded-lg border px-3 py-2 text-sm text-center ${
                            submitStatus === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                        {submitMessage}
                    </p>
                )}
            </main>

            <BottomButton
                text={isSubmitting ? 'Posting...' : 'Post Suggestion'}
                icon="arrow_forward"
                onClick={handlePostSuggestion}
                disabled={isSubmitting}
            />


        </div>
    );
}
