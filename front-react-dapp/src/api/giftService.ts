import apiClient from './apiClient.ts';

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
