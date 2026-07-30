import { apiClient } from './client';

export const batchesApi = {
  getBatches: async () => {
    const response = await apiClient.get('/batches');
    return response.data;
  },
  createBatch: async (data) => {
    const response = await apiClient.post('/batches', data);
    return response.data;
  },
  getBatchDetails: async (batchId) => {
    const response = await apiClient.get(`/batches/${batchId}`);
    return response.data;
  },
  getBatchSummary: async (batchId) => {
    const response = await apiClient.get(`/batches/${batchId}/summary`);
    return response.data;
  },
  getBatchResults: async (batchId) => {
    const response = await apiClient.get(`/batches/${batchId}/results`);
    return response.data;
  }
};
