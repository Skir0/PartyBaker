import type { ChangeEventFormProps } from '../../types/event.types.ts';
import { ItemNameField } from './ItemNameField.tsx';
import { DateFields } from './DateFields.tsx';


export function ChangeEventForm({formData, onChange}: ChangeEventFormProps) {


    return (
        <section className="space-y-6">

            <ItemNameField
                value={formData.eventName}
                onChange={onChange('eventName')}
                placeholder="Enter event name"
            />

            <DateFields
                eventDate={formData.eventDate}
                deadline={formData.contributionDeadline}
                onEventDateChange={onChange('eventDate')}
                onDeadlineChange={onChange('contributionDeadline')}
            />
        </section>
    );
}