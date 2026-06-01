import { useEffect, useState } from 'react';
import { EventStatus } from '../types/event-ui.types.ts';


export function useEventOverviewCard(deadlineStr: string) {


    const [status, setStatus] = useState<EventStatus>(EventStatus.POLLING);


    const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

    useEffect(() => {
        if (status != EventStatus.POLLING) {
            return;
        }
        const loadStatus = async () => {

            const deadline = normalizeDate(new Date(deadlineStr));
            const today = normalizeDate(new Date());

            console.log("isDeadline " + (deadline <= today) + " " + deadlineStr)

            if (deadline <= today) {
                setStatus(EventStatus.DEADLINE)
            }
        }
        void loadStatus();
    }, [deadlineStr, status]);


    return {
        status,
    }

}