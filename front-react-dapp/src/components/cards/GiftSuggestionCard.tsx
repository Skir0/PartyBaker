import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { GiftSuggestion } from '../../types/gift.types.ts';

interface GiftSuggestionCardProps {
    suggestion: GiftSuggestion;
    handleToggleLike: (giftId: number, currentlyLiked: boolean) => Promise<void>;
    onSettingsClick: (giftId: number) => void;
    isAdmin: boolean;
}

export function GiftSuggestionCard({ suggestion, handleToggleLike, onSettingsClick, isAdmin }: GiftSuggestionCardProps) {

    return (
        <article className="flex gap-3 rounded-xl border border-outline-variant/10 bg-surface p-3 shadow-sm">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                <img
                    src={suggestion.imageUrl}
                    alt={suggestion.imageAlt}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-on-surface">
                        {suggestion.title}
                    </h3>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSettingsClick(suggestion.id);
                            }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container"
                        >
                            <MaterialIcon icon="settings" size="text-[18px]" />
                        </button>
                    )}
                </div>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                    {suggestion.description}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-primary">
        {suggestion.price}
      </span>

                    <button
                        type="button"
                        onClick={() => handleToggleLike(suggestion.id, suggestion.liked)}
                        className={`flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium transition-colors ${
                            suggestion.liked
                                ? 'bg-primary-container text-on-primary-container'
                                : 'bg-surface-container text-on-surface-variant'
                        }`}
                    >
                        <MaterialIcon icon="favorite" fill={suggestion.liked} size="text-[16px]" />
                        <span>{suggestion.likes}</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
