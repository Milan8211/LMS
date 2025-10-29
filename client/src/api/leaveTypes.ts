import api from './axios';
import type { LeaveTypeConfig } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { mockLeaveTypesAPI } from './mockAPI';

export const leaveTypesAPI = {
  getAll: async () => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockLeaveTypesAPI.getAll();
    }
    const response = await api.get('/leave-types');
    return response.data;
  },
  
  getById: async (id: string) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockLeaveTypesAPI.getById(id);
    }
    const response = await api.get(`/leave-types/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<LeaveTypeConfig>) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockLeaveTypesAPI.create(data);
    }
    const response = await api.post('/leave-types', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<LeaveTypeConfig>) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockLeaveTypesAPI.update(id, data);
    }
    const response = await api.put(`/leave-types/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockLeaveTypesAPI.delete(id);
    }
    const response = await api.delete(`/leave-types/${id}`);
    return response.data;
  },
};
