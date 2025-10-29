import { LoginCredentials, RegisterData, User, LeaveRequest, LeaveReview, Leave, LeaveStats, LeaveTypeConfig, UserApproval, UserStats } from '@/types';
import { mockUsers, currentMockUser, setCurrentMockUser, getCurrentUserLeaves, getMockStats, mockLeaves, mockLeaveTypes, getMockUserStats, getMockDepartments } from './mockData';
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
    
    // Create new user with pending status (no password)
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: data.name,
      email: data.email,
      role: 'employee',
      department: data.department,
      approvalStatus: 'pending',
      leaveBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      message: 'Registration successful. Waiting for admin approval.',
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
    
    // Check approval status
    if (user.approvalStatus === 'pending') {
      throw new Error('Your account is pending admin approval');
    }
    
    if (user.approvalStatus === 'rejected') {
      throw new Error('Your account has been rejected');
    }
    
    // In mock mode, accept any password for approved users
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
    const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine priority based on leave type
    const priority = data.leaveType === 'sick' ? 'high' : 'normal';
    
    const newLeave: Leave = {
      _id: String(mockLeaves.length + 1),
      userId: currentMockUser,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      leaveType: data.leaveType,
      isPaid: data.isPaid,
      priority,
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
    
    // Update user balance if approved and paid
    if (data.status === 'approved' && leave.isPaid && typeof leave.userId === 'object') {
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

// Mock Leave Types API
export const mockLeaveTypesAPI = {
  getAll: async () => {
    await delay(APP_CONFIG.MOCK_DELAY);
    return { leaveTypes: mockLeaveTypes.filter((lt) => lt.isActive) };
  },
  
  getById: async (id: string) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    const leaveType = mockLeaveTypes.find((lt) => lt._id === id);
    if (!leaveType) {
      throw new Error('Leave type not found');
    }
    return { leaveType };
  },
  
  create: async (data: Partial<LeaveTypeConfig>) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const newLeaveType: LeaveTypeConfig = {
      _id: `lt${mockLeaveTypes.length + 1}`,
      name: data.name || '',
      maxPaidDays: data.maxPaidDays || 0,
      colorCode: data.colorCode || '#000000',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockLeaveTypes.push(newLeaveType);
    
    return {
      message: 'Leave type created successfully',
      leaveType: newLeaveType,
    };
  },
  
  update: async (id: string, data: Partial<LeaveTypeConfig>) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const leaveType = mockLeaveTypes.find((lt) => lt._id === id);
    if (!leaveType) {
      throw new Error('Leave type not found');
    }
    
    Object.assign(leaveType, data, { updatedAt: new Date().toISOString() });
    
    return {
      message: 'Leave type updated successfully',
      leaveType,
    };
  },
  
  delete: async (id: string) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const leaveType = mockLeaveTypes.find((lt) => lt._id === id);
    if (!leaveType) {
      throw new Error('Leave type not found');
    }
    
    // Soft delete
    leaveType.isActive = false;
    leaveType.updatedAt = new Date().toISOString();
    
    return { message: 'Leave type deleted successfully' };
  },
};

// Mock User Management API
export const mockUserManagementAPI = {
  getPendingUsers: async () => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const pendingUsers = mockUsers.filter((u) => u.approvalStatus === 'pending');
    return { users: pendingUsers };
  },
  
  getAllUsers: async (filters?: { department?: string; approvalStatus?: string; role?: string }) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    let users = [...mockUsers];
    
    if (filters?.department) {
      users = users.filter((u) => u.department === filters.department);
    }
    
    if (filters?.approvalStatus) {
      users = users.filter((u) => u.approvalStatus === filters.approvalStatus);
    }
    
    if (filters?.role) {
      users = users.filter((u) => u.role === filters.role);
    }
    
    return { users };
  },
  
  getUsersByDepartment: async (department: string) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const users = mockUsers.filter((u) => u.department === department && u.approvalStatus === 'approved');
    return { users };
  },
  
  getDepartments: async () => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    return { departments: getMockDepartments() };
  },
  
  approveUser: async (id: string, data: UserApproval) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.approvalStatus !== 'pending') {
      throw new Error('User is not pending approval');
    }
    
    user.approvalStatus = 'approved';
    user.leaveBalance = data.leaveBalance || 20;
    user.approvedBy = currentMockUser.id;
    user.approvedAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    
    return {
      message: 'User approved successfully',
      user,
    };
  },
  
  rejectUser: async (id: string) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.approvalStatus !== 'pending') {
      throw new Error('User is not pending approval');
    }
    
    user.approvalStatus = 'rejected';
    user.updatedAt = new Date().toISOString();
    
    return {
      message: 'User rejected successfully',
      user,
    };
  },
  
  getUserStats: async (): Promise<{ stats: UserStats }> => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    if (currentMockUser?.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    return { stats: getMockUserStats() };
  },
  
  updateProfile: async (id: string, data: Partial<User>) => {
    await delay(APP_CONFIG.MOCK_DELAY);
    
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Only allow updating certain fields
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    user.updatedAt = new Date().toISOString();
    
    return {
      message: 'Profile updated successfully',
      user,
    };
  },
};

