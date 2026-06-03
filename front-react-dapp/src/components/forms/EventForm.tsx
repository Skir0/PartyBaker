import { ItemField } from './ItemField.tsx';
import { DateFields } from './DateFields.tsx';
import { ProTipCard } from '../cards/ProTipCard.tsx';
import type { EventFormProps } from '../../types/event-ui.types.ts';
import { SheetType } from '../ui/AdminSheet.tsx';

export function EventForm({formData, onChange}: EventFormProps) {


    return (
        <section className="space-y-6">
            <ItemField
                value={formData.eventName}
                onChange={onChange('eventName')}
                propertyName="name"
                item={SheetType.EVENT}
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
