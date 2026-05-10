import apiClient from './apiClient.ts';
import type { CreateEventRequest, CreateGiftRequest, UpdateEventRequest, UpdateGiftRequest } from './requests.ts';
import type { EventResponse, GiftInfoResponse } from '../types/event.types.ts';

export const healthCheck = async () => {

    const response = await apiClient.get('/health');
    return response.data;
}


export const getGifts = async () => {

    const response = await apiClient.get('/api/gifts');
    return response.data;
}

export const getUserProfile = async () => {

    const response = await apiClient.get('/api/user/me');
    return response.data;
}

export const createEvent = async (req: CreateEventRequest) => {

    const response = await apiClient.post('/api/events/create', req);
    return response.data;
}

export const createGift = async (req: CreateGiftRequest, eventId: number) => {

    const response = await apiClient.post(`/api/events/${eventId}/suggestGift`, req);
    return response.data;
}

export const getEventsOfCurrentUser = async () => {
    const response = await apiClient.get('/api/events/getEvents');
    return response.data;
}

export const getRecipientsOfEvent = async (eventId: number) => {
    console.log("id", eventId)
    const response = await apiClient.get(`/api/events/${eventId}/recipients`);
    return response.data;
}

export const getGiftsInfoByRecipient = async (eventId: number, recipientId: number) => {
    const response = await apiClient.get(`/api/events/${eventId}/recipients/${recipientId}/gifts`);
    console.log("response", response)
    return response.data;
}

export const updateEvent = async (eventId: number, req: UpdateEventRequest): Promise<EventResponse> => {
    const response = await apiClient.put(`/api/events/${eventId}`, req);
    return response.data;
}

export const deleteEvent = async (eventId: number): Promise<void> => {
    await apiClient.delete(`/api/events/${eventId}`);
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
