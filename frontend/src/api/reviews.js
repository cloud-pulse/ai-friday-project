import { apiClient } from './client';

export const reviewsApi = {
  submitReview: async (batchId, reviewData) => {
    const response = await apiClient.post(`/batches/${batchId}/review`, reviewData);
    return response.data;
  }
};
