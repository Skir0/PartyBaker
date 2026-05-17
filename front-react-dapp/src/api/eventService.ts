import type { CreateEventRequest, JoinEventRequest, UpdateEventRequest } from './requests.ts';
import apiClient from './apiClient.ts';
import type { EventResponse, JoinEventResponse } from '../types/event-domain.types.ts';

export const finalizeEvent = async (eventId: number) => {

    const response = await apiClient.get(`api/events/${eventId}/finalize`);
    console.log("in api:", response)
    return response.data;
}

export const createEvent = async (req: CreateEventRequest) => {

    const response = await apiClient.post('/api/events/create', req);
    return response.data;
}
export const getEventsOfCurrentUser = async () => {
    const response = await apiClient.get('/api/events/getEvents');
    return response.data;
};
export const updateEvent = async (eventId: number, req: UpdateEventRequest): Promise<EventResponse> => {
    const response = await apiClient.put(`/api/events/${eventId}`, req);
    return response.data;
};
export const deleteEvent = async (eventId: number): Promise<void> => {
    await apiClient.delete(`/api/events/${eventId}`);
};
export const joinEvent = async (req: JoinEventRequest): Promise<JoinEventResponse> => {

    const response = await apiClient.post(`/api/events/join`, req);
    return response.data;
};