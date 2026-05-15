import { MaterialIcon } from '../ui/MaterialIcon.tsx';
import type { DateFieldsProps } from '../../types/event-ui.types.ts';

export function DateFields({
                               eventDate,
                               deadline,
                               onEventDateChange,
                               onDeadlineChange
                           }: DateFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">
                    Event Date
                </label>
                <div className="flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 shadow-sm border border-outline-variant/10">
                    <input
                        type="date"
                        value={eventDate}
                        onChange={onEventDateChange}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface font-medium"
                        placeholder="Select Date"
                    />
                    <MaterialIcon icon="calendar_today" size="text-xl" className="text-primary ml-2" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">
                    Contribution Deadline
                </label>
                <div className="flex items-center bg-surface-container-lowest rounded-lg px-4 py-3.5 shadow-sm border border-outline-variant/10">
                    <input
                        type="date"
                        value={deadline}
                        onChange={onDeadlineChange}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface font-medium"
                        placeholder="Set Deadline"
                    />
                    <MaterialIcon icon="schedule" size="text-xl" className="text-primary ml-2" />
                </div>
            </div>
        </div>
    );
}
