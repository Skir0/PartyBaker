import apiClient from './apiClient.ts';

export const getRecipientsOfEvent = async (eventId: number) => {
    console.log('id', eventId);
    const response = await apiClient.get(`/api/events/${eventId}/recipients`);
    return response.data;
};