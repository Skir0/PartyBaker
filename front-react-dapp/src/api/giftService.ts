import apiClient from './apiClient.ts';
import type { CreateGiftRequest, UpdateGiftRequest } from './requests.ts';
import type { GiftInfoResponse } from '../types/gift.types.ts';


export const getGifts = async () => {

    const response = await apiClient.get('/api/gifts');
    return response.data;
}

export const createGift = async (req: CreateGiftRequest, eventId: number) => {

    const response = await apiClient.post(`/api/events/${eventId}/suggestGift`, req);
    return response.data;
}

export const getGiftsInfoByRecipient = async (eventId: number, recipientId: number) => {
    const response = await apiClient.get(`/api/events/${eventId}/recipients/${recipientId}/gifts`);
    console.log("response", response)
    return response.data;
}

export const updateGift = async (giftId: number, req: UpdateGiftRequest): Promise<GiftInfoResponse> => {
    const response = await apiClient.put(`/api/gifts/${giftId}`, req);
    return response.data;
}

export const deleteGift = async (giftId: number): Promise<void> => {
    await apiClient.delete(`/api/gifts/${giftId}`);
}

export const deleteGiftLike = async (giftId: number): Promise<void> => {
    await apiClient.delete(`/api/gifts/${giftId}/like`);
}

export const addGiftLike = async (giftId: number): Promise<void> => {
    await apiClient.post(`/api/gifts/${giftId}/like`);
}

