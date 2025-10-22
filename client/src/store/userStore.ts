import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '@/api/auth';
import { User, LoginCredentials, RegisterData } from '@/types';
import { message } from 'ant-design-vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isEmployee = computed(() => user.value?.role === 'employee');

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true;
      const response = await authAPI.login(credentials);
      user.value = response.user;
      message.success('Login successful');
      return true;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      loading.value = true;
      const response = await authAPI.register(data);
      user.value = response.user;
      message.success('Registration successful');
      return true;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      await authAPI.logout();
      user.value = null;
      message.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      loading.value = true;
      const response = await authAPI.getCurrentUser();
      user.value = response.user;
      return true;
    } catch (error) {
      user.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isEmployee,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
});
