import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import { EventStatus } from '../../types/event-ui.types.ts';
import { useEventOverviewCard } from '../../hooks/useEventOverviewCard.ts';


export interface EventOverviewCardProps {
    eventId: number;
    title: string;
    participants: string;
    imageUrl: string;
    imageAlt: string;
    statusClassName: string;
    status: EventStatus;
    eventDate: string;
    deadline: string;
    deadlineClassName?: string;
    isAdmin?: boolean;
    onSettingsClick?: () => void;
    onClick?: () => void;
}

export function EventOverviewCard({
                                      eventId,
                                      title,
                                      participants,
                                      imageUrl,
                                      imageAlt,
                                      statusClassName,
                                      status = EventStatus.POLLING,
                                      eventDate,
                                      deadline,
                                      deadlineClassName = 'text-on-surface-variant',
                                      isAdmin,
                                      onSettingsClick,
                                      onClick
                                  }: EventOverviewCardProps) {

    useEventOverviewCard(eventId, status, deadline);

    const statusStyles: Record<EventStatus, string> = {
        [EventStatus.POLLING]: 'bg-green-100 text-green-800',
        [EventStatus.DEADLINE]: 'bg-yellow-100 text-yellow-800',
        [EventStatus.PAYMENT]: 'bg-blue-100 text-blue-800',
        [EventStatus.CANCELLED]: 'bg-red-100 text-red-800',
        [EventStatus.FINISHED]: 'bg-purple-100 text-purple-800'
    };

    const statusStyle = statusStyles[status];


    return (
        <div
            className={`w-full rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-4 text-left shadow-sm transition-transform active:scale-[0.99] ${
                onClick ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) {
                    return;
                }

                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
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

                    <div className={isAdmin ? 'visible' : 'invisible'}>
                        <button
                            onClick={(e) => {

                                e.stopPropagation(); // don't trigger card click
                                onSettingsClick?.();
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high transition-colors"
                        >
                            <MaterialIcon icon="settings" size="text-[18px]" />
                        </button>

                    </div>

                </div>

                <div className="mt-1 grid grid-cols-[1fr,auto,1fr] gap-4">
                    <div className="flex flex-col justify-self-start">
                        <span className="text-[11px] font-medium uppercase tracking-tight text-on-surface-variant">Event Date</span>
                        <div className="flex items-center gap-1">
                            <MaterialIcon icon="calendar_today" className="text-on-surface-variant"
                                          size="text-[16px]" />
                            <span className="text-[13px] font-medium text-on-surface">{eventDate}</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-self-center">
                        <span
                            className={`text-[11px] font-medium uppercase tracking-tight ${deadlineClassName}`}>Deadline</span>
                        <div className="flex items-center gap-1">
                            <MaterialIcon icon="timer" className={deadlineClassName} size="text-[16px]" />
                            <span className={`text-[13px] font-medium ${deadlineClassName}`}>{deadline}</span>
                        </div>
                    </div>

                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[11px] font-bold uppercase justify-self-end ${statusStyle} ${statusClassName}`}>
                        {status}
                    </span>
                </div>

            </div>

        </div>
    );
}
