import { apiClient } from './client';

export const inspectionApi = {
  uploadImage: async (batchId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post(
      `/inspection/batches/${batchId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
};
