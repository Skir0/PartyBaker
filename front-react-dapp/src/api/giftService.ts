import apiClient from './apiClient.ts';
import type { CreateEventRequest } from './requests.ts';

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
