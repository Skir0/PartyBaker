import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { GiftSuggestion } from '../../types/event.types.ts';

interface GiftSuggestionCardProps {
    suggestion: GiftSuggestion;
    handleToggleLike: (giftId: number, currentlyLiked: boolean) => Promise<void>;
    onSettingsClick: (giftId: number) => void;
    isAdmin: boolean;
}

export function GiftSuggestionCard({ suggestion, handleToggleLike, onSettingsClick, isAdmin }: GiftSuggestionCardProps) {

    return (
        <article className="flex items-start gap-4 rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-3 shadow-sm">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                <img
                    src={suggestion.imageUrl}
                    alt={suggestion.imageAlt}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="truncate text-base font-semibold text-on-surface">{suggestion.title}</h3>
                    <span className="shrink-0 font-bold text-primary">{suggestion.price}</span>
                </div>

                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                    {suggestion.description}
                </p>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                        {suggestion.supporterBadges.map((badge) => (
                            <div
                                key={`${suggestion.id}-${badge.label}`}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white text-[10px] font-bold ${badge.className} ${badge.textClassName ?? ''}`}
                            >
                                {badge.label}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-transform active:scale-95 ${
                            suggestion.liked
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                        onClick={() => handleToggleLike(suggestion.id, suggestion.liked)}
                    >
                        <MaterialIcon icon="favorite" fill={suggestion.liked} size="text-[18px]" />
                        <span>{suggestion.likes}</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={(e) => {

                                e.stopPropagation(); // don't trigger card click
                                onSettingsClick?.();
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high transition-colors"
                        >
                            <MaterialIcon icon="settings" size="text-[18px]" />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
