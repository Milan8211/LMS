import api from './axios';
import { LoginCredentials, RegisterData, User } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { mockAuthAPI } from './mockAPI';

// Real API implementation
const realAuthAPI = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Export either mock or real API based on config
export const authAPI = APP_CONFIG.USE_MOCK_API ? mockAuthAPI : realAuthAPI;
