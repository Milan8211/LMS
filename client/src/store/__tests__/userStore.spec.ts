import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../userStore';
import * as authAPI from '@/api/auth';

// Mock the auth API
vi.mock('@/api/auth', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with null user and not loading', () => {
    const store = useUserStore();
    
    expect(store.user).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it('should compute isAuthenticated correctly', () => {
    const store = useUserStore();
    
    expect(store.isAuthenticated).toBe(false);
    
    store.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'employee',
      leaveBalance: 20,
    };
    
    expect(store.isAuthenticated).toBe(true);
  });

  it('should compute isAdmin correctly', () => {
    const store = useUserStore();
    
    expect(store.isAdmin).toBe(false);
    
    store.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      leaveBalance: 20,
    };
    
    expect(store.isAdmin).toBe(true);
  });

  it('should login successfully', async () => {
    const store = useUserStore();
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employee' as const,
      leaveBalance: 18,
    };

    vi.mocked(authAPI.authAPI.login).mockResolvedValue({
      message: 'Login successful',
      user: mockUser,
    });

    const result = await store.login({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(result).toBe(true);
    expect(store.user).toEqual(mockUser);
    expect(store.loading).toBe(false);
  });

  it('should handle login failure', async () => {
    const store = useUserStore();

    vi.mocked(authAPI.authAPI.login).mockRejectedValue(new Error('Invalid credentials'));

    const result = await store.login({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(result).toBe(false);
    expect(store.user).toBeNull();
    expect(store.loading).toBe(false);
  });

  it('should register successfully', async () => {
    const store = useUserStore();
    const mockUser = {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'employee' as const,
      leaveBalance: 20,
    };

    vi.mocked(authAPI.authAPI.register).mockResolvedValue({
      message: 'User registered successfully',
      user: mockUser,
    });

    const result = await store.register({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'employee',
    });

    expect(result).toBe(true);
    expect(store.user).toEqual(mockUser);
  });

  it('should logout successfully', async () => {
    const store = useUserStore();
    
    // Set a user first
    store.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'employee',
      leaveBalance: 20,
    };

    vi.mocked(authAPI.authAPI.logout).mockResolvedValue({
      message: 'Logout successful',
    });

    await store.logout();

    expect(store.user).toBeNull();
    expect(authAPI.authAPI.logout).toHaveBeenCalled();
  });

  it('should fetch current user successfully', async () => {
    const store = useUserStore();
    const mockUser = {
      id: '1',
      name: 'Current User',
      email: 'current@example.com',
      role: 'employee' as const,
      leaveBalance: 15,
    };

    vi.mocked(authAPI.authAPI.getCurrentUser).mockResolvedValue({
      user: mockUser,
    });

    await store.fetchCurrentUser();

    expect(store.user).toEqual(mockUser);
  });

  it('should handle fetch current user failure', async () => {
    const store = useUserStore();

    vi.mocked(authAPI.authAPI.getCurrentUser).mockRejectedValue(new Error('Not authenticated'));

    await store.fetchCurrentUser();

    expect(store.user).toBeNull();
  });
});
