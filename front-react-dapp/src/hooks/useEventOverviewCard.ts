import { useEffect } from 'react';
import { EventStatus } from '../types/event-ui.types.ts';
import { changeEventStatus } from '../api/eventService.ts';


export function useEventOverviewCard(eventId: number, currentStatus: string, deadlineStr: string) {


    const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

    useEffect(() => {
        if (currentStatus != EventStatus.POLLING) {
            return;
        }
        const loadStatus = async () => {

            const deadline = normalizeDate(new Date(deadlineStr));
            const today = normalizeDate(new Date());

            console.log("isDeadline " + (deadline <= today) + " " + deadlineStr)

            if (deadline <= today) {
                await changeEventStatus(eventId, {
                    status: 'deadline'
                })
            }
        }
        void loadStatus();
    }, [deadlineStr, currentStatus, eventId]);

}