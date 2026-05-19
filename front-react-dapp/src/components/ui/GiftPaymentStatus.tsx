import { MaterialIcon } from './MaterialIcon.tsx';
import { useGiftPaymentStatus } from '../../hooks/useGiftPaymentStatus.ts';

type ParticipantStatus = 'paid' | 'pending';
type ParticipantAccent = 'secondary' | 'tertiary' | 'neutral' | 'primary';

export interface EventContributionParticipant {
    id: number | string;
    name: string;
    amount: number;
    status: ParticipantStatus;
    accent?: ParticipantAccent;
}

interface GiftPaymentProps {
    giftTitle: string;
    collectedAmount: number;
    targetAmount: number;
    participantsCount: number;
    payAmount: number;
    participants: EventContributionParticipant[];
    eventId: number;
    recipientId: number;
    onBack: () => void;
    onClose?: () => void;
    onPay: () => void;
    onViewAllParticipants?: () => void;
}

const accentClassNames: Record<ParticipantAccent, string> = {
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant',
    neutral: 'bg-surface-container-high text-on-surface-variant',
    primary: 'bg-primary-fixed-dim text-on-primary-fixed-variant'
};

function formatAmount(amount: number): string {
    console.log("amount", amount)
    return String(amount);
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function GiftPaymentStatus({
    giftTitle,
    collectedAmount,
    targetAmount,
    participantsCount,
    participants,
    eventId,
    recipientId,
    onBack,
    onClose,
    onPay,
    onViewAllParticipants
}: GiftPaymentProps) {

    const { visiblePayers, hasMore, loadMore, isLoading, allPayers } = useGiftPaymentStatus(eventId, recipientId);
    const progress = targetAmount > 0 ? Math.min((collectedAmount / targetAmount) * 100, 100) : 0;
    const roundedProgress = Math.round(progress);

    return (
        <div className="min-h-screen bg-background text-on-background">

            <main className="mx-auto max-w-lg px-4 pb-32">
                <section className="flex flex-col">
                    <h2 className="mb-1 text-center text-2xl font-bold text-on-surface">{giftTitle}</h2>

                    <div className="w-full rounded-xl border border-outline-variant/10 bg-surface-container-low p-5">
                        <div className="mb-3 flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Collected
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-primary">{formatAmount(collectedAmount)}</span>
                                    <span className="text-sm font-medium text-primary">{"usd"}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                    Goal
                                </span>
                                <div className="flex items-baseline justify-end gap-1 text-on-surface-variant">
                                    <span className="text-2xl font-bold">{formatAmount(targetAmount)}</span>
                                    <span className="text-xs font-medium ">{"usd"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs font-medium text-on-surface-variant">
                            <span>{roundedProgress}% Funded</span>
                            <span className="flex items-center gap-1">
                                <MaterialIcon icon="group" size="text-xs" />
                                {visiblePayers?.length} Contributors
                            </span>
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Contributors
                    </h3>

                    <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low">
                        {visiblePayers?.map((payer, index) => {
                            let isPaid = payer.is_paid;
                            return (
                                <div
                                    key={payer.id}
                                    className={`flex items-center justify-between bg-surface-container-lowest p-3 transition-colors active:bg-surface-container ${
                                        index > 0 ? 'border-t border-outline-variant/10' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold`}
                                        >
                                            {getInitials(payer.first_name)}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-on-surface">{payer.first_name}</span>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1 ${
                                            isPaid ? 'text-primary' : 'text-on-surface-variant/30'
                                        }`}
                                    >
                                        <span className="text-xs font-bold uppercase">
                                            {isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                        <MaterialIcon
                                            icon={isPaid ? 'check_circle' : 'radio_button_unchecked'}
                                            fill={isPaid}
                                            size="text-sm"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={isLoading}
                            className="mt-4 w-full rounded-lg py-2 text-sm font-bold text-primary transition-all active:bg-primary/10 disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : `Load ${Math.min(5, allPayers?.length! - visiblePayers.length || 0)} More`}
                        </button>
                    )}

                    {onViewAllParticipants && (
                        <button
                            type="button"
                            onClick={onViewAllParticipants}
                            className="mt-4 w-full rounded-lg py-2 text-sm font-bold text-primary transition-all active:bg-primary/10"
                        >
                            View all {participantsCount} participants
                        </button>
                    )}
                </section>

                <div className="fixed bottom-0 left-0 right-0 w-full mx-auto w-full max-w-lg">
                    <button
                        type="button"
                        onClick={onPay}
                        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#005f9e] font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        <span>
                            Pay {"usd"}
                        </span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                            <MaterialIcon icon="payments" fill size="text-sm" />
                        </div>
                    </button>

                    <p className="mt-3 text-center text-[11px] font-medium text-on-surface-variant">
                        Secured by Telegram Payment API
                    </p>
                </div>
            </main>

            <footer className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/10 bg-background/90 p-4 backdrop-blur-lg">

            </footer>
        </div>
    );
}