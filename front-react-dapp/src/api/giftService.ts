import apiClient from './apiClient.ts';
import type { CreateEventRequest, UpdateEventRequest } from './requests.ts';
import type { EventResponse } from '../types/event.types.ts';

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

export const getEventsOfCurrentUser = async () => {
    const response = await apiClient.get('/api/events/getEvents');
    return response.data;
}

export const getGiftRecipientsOfEvent = async (eventId: number) => {
    console.log("id", eventId)
    const response = await apiClient.get(`/api/events/${eventId}/recipients`);
    return response.data;
}

export const getAllGiftsOfRecipient = async (eventId: number, recipientId: number) => {
    console.log("id", recipientId)
    const response = await apiClient.get(`/api/events/${eventId}/recipients/${recipientId}/gifts`);
    return response.data;
}

export const updateEvent = async (eventId: number, req: UpdateEventRequest): Promise<EventResponse> => {
    const response = await apiClient.put(`/api/events/${eventId}`, req);
    return response.data;
}

export const deleteEvent = async (eventId: number): Promise<void> => {
    await apiClient.delete(`/api/events/${eventId}`);
}
