import { apiClient } from './client';

export const chatApi = {
  askAssistant: async (batchId, message, sessionId = null) => {
    const response = await apiClient.post('/chat', {
      batch_id: batchId,
      message: message,
      session_id: sessionId
    });
    return response.data;
  },
  getSessions: async () => {
    const response = await apiClient.get('/chat/sessions');
    return response.data;
  },
  getSessionHistory: async (sessionId) => {
    const response = await apiClient.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },
  deleteSession: async (sessionId) => {
    const response = await apiClient.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  }
};
