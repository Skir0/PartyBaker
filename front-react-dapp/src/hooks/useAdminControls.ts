import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import {
    SheetType,
    type EventFormData,
    type EventResponse,
    type GiftFormData,
    type GiftInfoResponse
} from '../types/event.types.ts';
import type { UpdateEventRequest, UpdateGiftRequest } from '../api/requests.ts';

export type UseEventAdminControlsParams = {
    type: SheetType.EVENT;
    data: EventResponse[];
    setData: Dispatch<SetStateAction<EventResponse[]>>;
    onUpdate: (eventId: number, payload: UpdateEventRequest) => Promise<EventResponse>;
    onDelete: (eventId: number) => Promise<void>;
};

export type UseGiftAdminControlsParams = {
    recipientId: number;
    type: SheetType.GIFT;
    data: Record<number, GiftInfoResponse[]>;
    setData: Dispatch<SetStateAction<Record<number, GiftInfoResponse[]>>>;
    onUpdate: (giftId: number, payload: UpdateGiftRequest) => Promise<GiftInfoResponse>;
    onDelete: (giftId: number) => Promise<void>;
};

type EventAdminControlsResult = {
    selectedItem: EventResponse | null;
    adminFormData: EventFormData;
    isCancelConfirming: boolean;
    error: string | null;
    adminSettingsClick: (eventId: number) => void;
    closeAdminSheet: () => void;
    handleAdminFormChange: (field: keyof EventFormData) => (e: ChangeEvent<HTMLInputElement>) => void;
    handleSaveAdminChanges: () => Promise<void>;
    handleConfirmCancel: () => Promise<void>;
    setIsCancelConfirming: Dispatch<SetStateAction<boolean>>;
};

type GiftAdminControlsResult = {
    selectedItem: GiftInfoResponse | null;
    adminFormData: GiftFormData;
    isCancelConfirming: boolean;
    error: string | null;
    adminSettingsClick: (giftId: number) => void;
    closeAdminSheet: () => void;
    handleAdminFormChange: (field: keyof GiftFormData) => (e: ChangeEvent<HTMLInputElement>) => void;
    handleSaveAdminChanges: () => Promise<void>;
    handleConfirmCancel: () => Promise<void>;
    setIsCancelConfirming: Dispatch<SetStateAction<boolean>>;
};

// export function useAdminControls(params: UseEventAdminControlsParams): EventAdminControlsResult;
// export function useAdminControls(params: UseGiftAdminControlsParams): GiftAdminControlsResult;
export function useAdminControls(
    params: UseEventAdminControlsParams | UseGiftAdminControlsParams
): EventAdminControlsResult | GiftAdminControlsResult {
    const isEventMode = params.type === SheetType.EVENT;
    const [isCancelConfirming, setIsCancelConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<EventResponse | GiftInfoResponse | null>(null);
    const [adminFormData, setAdminFormData] = useState<EventFormData | GiftFormData>(
        isEventMode
            ? { eventName: '', eventDate: '', contributionDeadline: '' }
            : { name: '', description: '', price: '', url: '' }
    );
    // if (params.type === 'Event') {
    //     params.data;
    // }


    const adminSettingsClick = (itemId: number) => {


        if (isEventMode) {
            const item = params.data.find((entry) => entry.id === itemId) ?? null;
            if (!item) {
                return;
            }
            if (!(item!.is_admin)) {
                return;
            }

            setSelectedItem(item);
            setAdminFormData({
                eventName: item!.name,
                eventDate: item!.date,
                contributionDeadline: item!.deadline
            });
        } else {
            console.log('choosing');
            console.log(params.data)
            console.log(params.recipientId)
            const item = params.data[params.recipientId].find((entry) => entry.id === itemId) ?? null;
            if (!item) {
                return;
            }
            setSelectedItem(item);
            setAdminFormData({
                name: item!.name,
                description: item!.description,
                price: item!.target_amount.toString(),
                url: item!.link
            });
        }
        setIsCancelConfirming(false);
        setError(null);
    };

    const closeAdminSheet = () => {
        setSelectedItem(null);
        setIsCancelConfirming(false);
    };

    const handleAdminFormChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setAdminFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSaveAdminChanges = async () => {
        if (!selectedItem) {
            return;
        }

        try {
            if (params.type === SheetType.EVENT) {
                const form = adminFormData as EventFormData;
                const updatedEvent = await params.onUpdate(selectedItem.id, {
                    name: form.eventName,
                    date: form.eventDate,
                    deadline: form.contributionDeadline
                });
                params.setData((prev) =>
                    prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
                );
            } else {
                const form = adminFormData as GiftFormData;
                const updatedGift = await params.onUpdate(selectedItem.id, {
                    name: form.name,
                    description: form.description,
                    target_amount: Number(form.price),
                    url: form.url
                });
                params.setData((prev) => {
                    const gifts = prev[params.recipientId] ?? [];
                    console.log("recipientId", params.recipientId)
                    return {
                        ...prev,
                        [params.recipientId]: gifts.map((gift) =>
                            gift.id === updatedGift.id ? updatedGift : gift,
                        ),
                    };
                });


            }
            closeAdminSheet();
        } catch {
            setError(isEventMode ? 'Failed to update event' : 'Failed to update gift');
        }
    };

    const handleConfirmCancel = async () => {
        if (!selectedItem) {
            return;
        }

        try {
            await params.onDelete(selectedItem.id);
            if (isEventMode)
                params.setData((prev) => prev.filter(entry => entry.id !== selectedItem.id));
            else {
                params.setData(prev => {
                    const gifts = prev[params.recipientId];
                    return {
                        ...prev,
                        [params.recipientId]: gifts.filter(entry => entry.id !== selectedItem.id)
                    }
                })
            }
            closeAdminSheet();
        } catch {
            setError(isEventMode ? 'Failed to delete event' : 'Failed to delete gift');
        }
    };

    const commonResult = {
        selectedItem,
        adminFormData,
        isCancelConfirming,
        error,
        adminSettingsClick,
        closeAdminSheet,
        handleAdminFormChange,
        handleSaveAdminChanges,
        handleConfirmCancel,
        setIsCancelConfirming
    };

    if (isEventMode) {
        return commonResult as EventAdminControlsResult;
    }

    return commonResult as GiftAdminControlsResult;
}