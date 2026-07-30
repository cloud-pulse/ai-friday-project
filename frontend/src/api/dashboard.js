import { apiClient } from './client';

export const dashboardApi = {
  getMetrics: async () => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },
  getTrends: async () => {
    const response = await apiClient.get('/dashboard/trends');
    return response.data.trends;
  },
  getDefects: async () => {
    const response = await apiClient.get('/dashboard/defects');
    return response.data.breakdown;
  }
};
