import api from './axios';
import { Leave, LeaveRequest, LeaveReview, LeaveStats } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { mockLeavesAPI } from './mockAPI';

// Real API implementation
const realLeavesAPI = {
  createLeave: async (data: LeaveRequest) => {
    const response = await api.post('/leaves', data);
    return response.data;
  },

  getMyLeaves: async (status?: string): Promise<{ leaves: Leave[] }> => {
    const response = await api.get('/leaves/my-leaves', {
      params: { status },
    });
    return response.data;
  },

  getAllLeaves: async (status?: string, userId?: string): Promise<{ leaves: Leave[] }> => {
    const response = await api.get('/leaves', {
      params: { status, userId },
    });
    return response.data;
  },

  getLeaveById: async (id: string): Promise<{ leave: Leave }> => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  reviewLeave: async (id: string, data: LeaveReview) => {
    const response = await api.patch(`/leaves/${id}/review`, data);
    return response.data;
  },

  deleteLeave: async (id: string) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  getLeaveStats: async (): Promise<{ stats: LeaveStats }> => {
    const response = await api.get('/leaves/stats');
    return response.data;
  },
};

// Export either mock or real API based on config
export const leavesAPI = APP_CONFIG.USE_MOCK_API ? mockLeavesAPI : realLeavesAPI;
