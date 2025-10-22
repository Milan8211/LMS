import { User, Leave, LeaveStats } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@lms.com',
    role: 'employee',
    leaveBalance: 18,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@lms.com',
    role: 'employee',
    leaveBalance: 15,
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@lms.com',
    role: 'admin',
    leaveBalance: 20,
  },
];

// Mock Leaves - with better calendar visualization
export const mockLeaves: Leave[] = [
  {
    _id: '1',
    userId: mockUsers[0],
    startDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    leaveType: 'sick',
    reason: 'Not feeling well, need to rest',
    status: 'pending',
    daysCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    userId: mockUsers[0],
    startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    leaveType: 'annual',
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
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    leaveType: 'casual',
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
    startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    leaveType: 'sick',
    reason: 'Medical appointment and recovery',
    status: 'pending',
    daysCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    userId: mockUsers[1],
    startDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    leaveType: 'annual',
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
    startDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 13 * 86400000).toISOString(),
    leaveType: 'casual',
    reason: 'Family event',
    status: 'approved',
    daysCount: 3,
    reviewedBy: mockUsers[2],
    reviewedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    reviewComment: 'Approved',
    createdAt: new Date(Date.now() - 16 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

// Current logged in user (can be changed for testing)
export let currentMockUser: User | null = mockUsers[0]; // Default to John Doe (employee)

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
