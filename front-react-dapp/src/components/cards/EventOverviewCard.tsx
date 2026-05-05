import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { EventOverviewCardProps } from '../../types/event.types.ts';

export function EventOverviewCard({
                                      title,
                                      participants,
                                      imageUrl,
                                      imageAlt,
                                      status,
                                      statusClassName,
                                      eventDate,
                                      deadline,
                                      deadlineClassName = 'text-on-surface-variant',
                                      isAdmin,
                                      onSettingsClick,
                                  }: EventOverviewCardProps) {


    return (
        <div className="w-full rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-4 text-left shadow-sm transition-transform active:scale-[0.99]">
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                            <img className="h-full w-full object-cover" src={imageUrl} alt={imageAlt} />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-on-surface">{title}</h3>
                            <div className="mt-0.5 flex items-center gap-1.5">
                                <MaterialIcon icon="groups" className="text-on-surface-variant" size="text-[14px]" />
                                <span className="text-[13px] text-on-surface-variant">{participants}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase ${statusClassName}`}>
                        {status}
                    </span>
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

                <div className="mt-1 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium uppercase tracking-tight text-on-surface-variant">Event Date</span>
                        <div className="flex items-center gap-1">
                            <MaterialIcon icon="calendar_today" className="text-on-surface-variant" size="text-[16px]" />
                            <span className="text-[13px] font-medium text-on-surface">{eventDate}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[11px] font-medium uppercase tracking-tight ${deadlineClassName}`}>Deadline</span>
                        <div className="flex items-center gap-1">
                            <MaterialIcon icon="timer" className={deadlineClassName} size="text-[16px]" />
                            <span className={`text-[13px] font-medium ${deadlineClassName}`}>{deadline}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
