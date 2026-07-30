import { apiClient } from './client';

export const reportsApi = {
  generateReport: async (batchId) => {
    const response = await apiClient.post(`/batches/${batchId}/reports`);
    return response.data;
  },
  downloadReport: (reportId) => {
    window.open(`${apiClient.defaults.baseURL}/reports/${reportId}/download`, '_blank');
  }
};
