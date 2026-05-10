import { TopAppBar } from '../components/ui/TopAppBar.tsx';
import { BottomButton } from '../components/ui/BottomButton.tsx';
import { StepHeaderCard } from '../components/cards/StepHeaderCard.tsx';
import { SuggestGiftForm } from '../components/forms/SuggestGiftForm.tsx';
import { useSuggestGift } from '../hooks/useSuggestGift.ts';

export function SuggestGiftPage() {
    const { formData, isSubmitting, handleChange, handleToolbarBack, handlePostSuggestion } =
        useSuggestGift();


    return (
        <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
            <TopAppBar title="Suggest Gift" onBack={handleToolbarBack} />

            <main className="flex-grow pt-20 px-4 pb-32 max-w-2xl mx-auto w-full">

                <StepHeaderCard
                    step="Step 1 of 2"
                    title="What's the gift?"
                    description="Share a gift idea with the group. Others can vote for it once suggested."
                />
                <SuggestGiftForm formData={formData} onChange={handleChange} />


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
