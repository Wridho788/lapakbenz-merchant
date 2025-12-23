import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/constants';

export const locationApi = {
    // Get Provinces
    getProvinces: async () => {
        const response = await apiClient.get(API_ENDPOINTS.PROVINCES, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    // Get Cities by Province ID
    getCities: async (provinceId: string) => {
        const url = `${API_ENDPOINTS.CITIES}${provinceId}`;
        const response = await apiClient.get(url, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }, 
    // Get Districts by City ID
    getDistricts: async (cityId: string) => {
        const url = `${API_ENDPOINTS.DISTRICTS}${cityId}`;
        const response = await apiClient.get(url, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },
}