import { LoginCredentials, RegisterData, User, LeaveRequest, LeaveReview, Leave, LeaveStats } from '@/types';
import { mockUsers, currentMockUser, setCurrentMockUser, getCurrentUserLeaves, getMockStats, mockLeaves } from './mockData';
import { APP_CONFIG } from '@/config/app.config';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Auth API
export const mockAuthAPI = {
  register: async (data: RegisterData) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    // Check if user exists
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: data.name,
      email: data.email,
      role: data.role || 'employee',
      leaveBalance: 20,
    };
    
    mockUsers.push(newUser);
    setCurrentMockUser(newUser);
    
    return {
      message: 'User registered successfully',
      user: newUser,
    };
  },

  login: async (credentials: LoginCredentials) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    // Find user
    const user = mockUsers.find((u) => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In mock mode, accept any password
    setCurrentMockUser(user);
    
    return {
      message: 'Login successful',
      user,
    };
  },

  logout: async () => {
    await delay(APP_CONFIG.MOCK_DELAY);
    setCurrentMockUser(null);
    return { message: 'Logout successful' };
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (!currentMockUser) {
      throw new Error('Not authenticated');
    }
    
    return { user: currentMockUser };
  },
};

// Mock Leaves API
export const mockLeavesAPI = {
  createLeave: async (data: LeaveRequest) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (!currentMockUser) {
      throw new Error('Not authenticated');
    }
    
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const newLeave: Leave = {
      _id: String(mockLeaves.length + 1),
      userId: currentMockUser,
      startDate: data.startDate,
      endDate: data.endDate,
      leaveType: data.leaveType,
      reason: data.reason,
      status: 'pending',
      daysCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockLeaves.push(newLeave);
    
    return {
      message: 'Leave request created successfully',
      leave: newLeave,
    };
  },

  getMyLeaves: async (status?: string): Promise<{ leaves: Leave[] }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    let leaves = getCurrentUserLeaves();
    
    if (status) {
      leaves = leaves.filter((l) => l.status === status);
    }
    
    return { leaves };
  },

  getAllLeaves: async (status?: string, userId?: string): Promise<{ leaves: Leave[] }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    let leaves = [...mockLeaves];
    
    if (status) {
      leaves = leaves.filter((l) => l.status === status);
    }
    
    if (userId) {
      leaves = leaves.filter((l) => {
        const leaveUserId = typeof l.userId === 'object' ? l.userId.id : l.userId;
        return leaveUserId === userId;
      });
    }
    
    return { leaves };
  },

  getLeaveById: async (id: string): Promise<{ leave: Leave }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    const leave = mockLeaves.find((l) => l._id === id);
    
    if (!leave) {
      throw new Error('Leave request not found');
    }
    
    return { leave };
  },

  reviewLeave: async (id: string, data: LeaveReview) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const leave = mockLeaves.find((l) => l._id === id);
    
    if (!leave) {
      throw new Error('Leave request not found');
    }
    
    if (leave.status !== 'pending') {
      throw new Error('Leave request has already been reviewed');
    }
    
    leave.status = data.status;
    leave.reviewedBy = currentMockUser;
    leave.reviewedAt = new Date().toISOString();
    leave.reviewComment = data.reviewComment;
    leave.updatedAt = new Date().toISOString();
    
    // Update user balance if approved
    if (data.status === 'approved' && typeof leave.userId === 'object') {
      leave.userId.leaveBalance -= leave.daysCount;
    }
    
    return {
      message: `Leave request ${data.status} successfully`,
      leave,
    };
  },

  deleteLeave: async (id: string) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    const leaveIndex = mockLeaves.findIndex((l) => l._id === id);
    
    if (leaveIndex === -1) {
      throw new Error('Leave request not found');
    }
    
    const leave = mockLeaves[leaveIndex];
    
    if (leave.status !== 'pending') {
      throw new Error('Cannot delete a reviewed leave request');
    }
    
    mockLeaves.splice(leaveIndex, 1);
    
    return { message: 'Leave request deleted successfully' };
  },

  getLeaveStats: async (): Promise<{ stats: LeaveStats }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    return { stats: getMockStats() };
  },
};
