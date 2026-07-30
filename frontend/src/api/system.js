import { apiClient } from './client';

export const systemApi = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  getVersion: async () => {
    const response = await apiClient.get('/version');
    return response.data;
  },
  getStatus: async () => {
    const response = await apiClient.get('/status');
    return response.data;
  }
};
