import { User, Leave, LeaveStats, LeaveTypeConfig, UserStats } from '@/types';

// Mock Leave Types
export const mockLeaveTypes: LeaveTypeConfig[] = [
  {
    _id: 'lt1',
    name: 'Annual Leave',
    maxPaidDays: 14,
    colorCode: '#1677ff',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'lt2',
    name: 'Sick Leave',
    maxPaidDays: 7,
    colorCode: '#ff4d4f',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'lt3',
    name: 'Casual Leave',
    maxPaidDays: 7,
    colorCode: '#52c41a',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'lt4',
    name: 'Unpaid Leave',
    maxPaidDays: 0,
    colorCode: '#8c8c8c',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'lt5',
    name: 'Medical Leave',
    maxPaidDays: 10,
    colorCode: '#fa8c16',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@lms.com',
    role: 'employee',
    department: 'Engineering',
    approvalStatus: 'approved',
    leaveBalance: 18,
    approvedBy: '3',
    approvedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@lms.com',
    role: 'employee',
    department: 'HR',
    approvalStatus: 'approved',
    leaveBalance: 15,
    approvedBy: '3',
    approvedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@lms.com',
    role: 'admin',
    department: 'Management',
    approvalStatus: 'approved',
    leaveBalance: 20,
    createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@lms.com',
    role: 'employee',
    department: 'Engineering',
    approvalStatus: 'approved',
    leaveBalance: 20,
    approvedBy: '3',
    approvedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Alice Brown',
    email: 'alice@lms.com',
    role: 'employee',
    department: 'Marketing',
    approvalStatus: 'pending',
    leaveBalance: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Charlie Davis',
    email: 'charlie@lms.com',
    role: 'employee',
    department: 'Sales',
    approvalStatus: 'pending',
    leaveBalance: 0,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Diana Evans',
    email: 'diana@lms.com',
    role: 'employee',
    department: 'Engineering',
    approvalStatus: 'rejected',
    leaveBalance: 0,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Leaves - with better calendar visualization
export const mockLeaves: Leave[] = [
  {
    _id: '1',
    userId: mockUsers[0],
    leaveTypeId: 'lt2', // Sick Leave
    startDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    leaveType: 'sick',
    isPaid: true,
    priority: 'high',
    reason: 'Not feeling well, need to rest',
    status: 'pending',
    daysCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    userId: mockUsers[0],
    leaveTypeId: 'lt1', // Annual Leave
    startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    leaveType: 'annual',
    isPaid: true,
    priority: 'normal',
    reason: 'Family vacation planned',
    status: 'approved',
    daysCount: 5,
    reviewedBy: mockUsers[2],
    reviewedAt: new Date().toISOString(),
    reviewComment: 'Approved - Enjoy your vacation',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    userId: mockUsers[0],
    leaveTypeId: 'lt3', // Casual Leave
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    leaveType: 'casual',
    isPaid: false,
    priority: 'normal',
    reason: 'Personal work',
    status: 'rejected',
    daysCount: 3,
    reviewedBy: mockUsers[2],
    reviewedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    reviewComment: 'Insufficient notice period',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: '4',
    userId: mockUsers[1],
    leaveTypeId: 'lt5', // Medical Leave
    startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    leaveType: 'sick',
    isPaid: true,
    priority: 'high',
    reason: 'Medical appointment and recovery',
    status: 'pending',
    daysCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    userId: mockUsers[1],
    leaveTypeId: 'lt1', // Annual Leave
    startDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    leaveType: 'annual',
    isPaid: true,
    priority: 'normal',
    reason: 'Weekend getaway',
    status: 'approved',
    daysCount: 3,
    reviewedBy: mockUsers[2],
    reviewedAt: new Date().toISOString(),
    reviewComment: 'Approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    userId: mockUsers[0],
    leaveTypeId: 'lt3', // Casual Leave
    startDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 13 * 86400000).toISOString(),
    leaveType: 'casual',
    isPaid: true,
    priority: 'normal',
    reason: 'Family event',
    status: 'approved',
    daysCount: 3,
    reviewedBy: mockUsers[2],
    reviewedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    reviewComment: 'Approved',
    createdAt: new Date(Date.now() - 16 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    _id: '7',
    userId: mockUsers[3],
    leaveTypeId: 'lt2', // Sick Leave
    startDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    leaveType: 'sick',
    isPaid: true,
    priority: 'high',
    reason: 'Flu symptoms',
    status: 'pending',
    daysCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '8',
    userId: mockUsers[3],
    leaveTypeId: 'lt4', // Unpaid Leave
    startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    leaveType: 'unpaid',
    isPaid: false,
    priority: 'normal',
    reason: 'Extended personal trip',
    status: 'pending',
    daysCount: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Current logged in user (can be changed for testing)
export let currentMockUser: User | null = mockUsers[2]; // Default to Admin User for testing

export const setCurrentMockUser = (user: User | null) => {
  currentMockUser = user;
};

// Helper to get leaves for current user
export const getCurrentUserLeaves = (): Leave[] => {
  if (!currentMockUser) return [];
  if (currentMockUser.role === 'admin') return mockLeaves;
  return mockLeaves.filter((leave) => {
    const userId = typeof leave.userId === 'object' ? leave.userId.id : leave.userId;
    return userId === currentMockUser?.id;
  });
};

// Helper to get stats
export const getMockStats = (): LeaveStats => {
  const userLeaves = getCurrentUserLeaves();
  
  if (currentMockUser?.role === 'admin') {
    return {
      total: mockLeaves.length,
      pending: mockLeaves.filter((l) => l.status === 'pending').length,
      approved: mockLeaves.filter((l) => l.status === 'approved').length,
      rejected: mockLeaves.filter((l) => l.status === 'rejected').length,
    };
  }
  
  return {
    total: userLeaves.length,
    pending: userLeaves.filter((l) => l.status === 'pending').length,
    approved: userLeaves.filter((l) => l.status === 'approved').length,
    rejected: userLeaves.filter((l) => l.status === 'rejected').length,
    leaveBalance: currentMockUser?.leaveBalance || 0,
  };
};

// Helper to get user stats
export const getMockUserStats = (): UserStats => {
  const byDepartment = mockUsers.reduce((acc, user) => {
    if (user.approvalStatus === 'approved') {
      const existing = acc.find((d) => d._id === user.department);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ _id: user.department, count: 1 });
      }
    }
    return acc;
  }, [] as { _id: string; count: number }[]);

  return {
    total: mockUsers.length,
    pending: mockUsers.filter((u) => u.approvalStatus === 'pending').length,
    approved: mockUsers.filter((u) => u.approvalStatus === 'approved').length,
    rejected: mockUsers.filter((u) => u.approvalStatus === 'rejected').length,
    byDepartment,
  };
};

// Helper to get departments
export const getMockDepartments = (): string[] => {
  const departments = new Set(mockUsers.map((u) => u.department));
  return Array.from(departments).sort();
};
