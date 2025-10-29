import api from './axios';
import type { User, UserApproval, UserStats } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { mockUserManagementAPI } from './mockAPI';

export const userManagementAPI = {
  getPendingUsers: async () => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.getPendingUsers();
    }
    const response = await api.get('/users/pending');
    return response.data;
  },
  
  getAllUsers: async (filters?: { department?: string; approvalStatus?: string; role?: string }) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.getAllUsers(filters);
    }
    const response = await api.get('/users/all', { params: filters });
    return response.data;
  },
  
  getUsersByDepartment: async (department: string) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.getUsersByDepartment(department);
    }
    const response = await api.get(`/users/department/${department}`);
    return response.data;
  },
  
  getDepartments: async () => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.getDepartments();
    }
    const response = await api.get('/users/departments');
    return response.data;
  },
  
  approveUser: async (id: string, data: UserApproval) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.approveUser(id, data);
    }
    const response = await api.post(`/users/${id}/approve`, data);
    return response.data;
  },
  
  rejectUser: async (id: string) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.rejectUser(id);
    }
    const response = await api.post(`/users/${id}/reject`);
    return response.data;
  },
  
  getUserStats: async (): Promise<{ stats: UserStats }> => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.getUserStats();
    }
    const response = await api.get('/users/stats');
    return response.data;
  },
  
  updateProfile: async (id: string, data: Partial<User>) => {
    if (APP_CONFIG.USE_MOCK_API) {
      return mockUserManagementAPI.updateProfile(id, data);
    }
    const response = await api.put(`/users/${id}/profile`, data);
    return response.data;
  },
};
