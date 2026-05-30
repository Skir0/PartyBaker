import apiClient from './apiClient.ts';

export const getRecipientsOfEvent = async (eventId: number) => {
    console.log('id', eventId);
    const response = await apiClient.get(`/api/events/${eventId}/recipients`);
    return response.data;
};

export const getPayersInfoForRecipient = async (eventId: number, recipientId: number) => {

    const response = await apiClient.get(`/api/events/${eventId}/recipients/${recipientId}/payers`);
    return response.data;
}

export const getCurrentPayer = async (giftId: number)=> {

    console.log("inside payers service")
    const response = await apiClient.get(`/api/gifts/${giftId}/currentPayer`);
    return response.data;

}