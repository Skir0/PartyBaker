import { EventNameField } from './EventNameField.tsx';
import { DateFields } from './DateFields.tsx';
import { ProTipCard } from '../cards/ProTipCard.tsx';
import type {EventFormProps } from '../../types/event.types.ts';

export function EventForm({formData, onChange}: EventFormProps) {


    return (
        <section className="space-y-6">
            <EventNameField
                value={formData.eventName}
                onChange={onChange('eventName')}
                placeholder="Set name"
            />

            <DateFields
                eventDate={formData.eventDate}
                deadline={formData.contributionDeadline}
                onEventDateChange={onChange('eventDate')}
                onDeadlineChange={onChange('contributionDeadline')}
            />

            <ProTipCard />
        </section>
    );
}