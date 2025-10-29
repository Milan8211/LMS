import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLeaveStore } from '../leaveStore';
import * as leavesAPI from '@/api/leaves';

// Mock the leaves API
vi.mock('@/api/leaves', () => ({
  leavesAPI: {
    createLeave: vi.fn(),
    getMyLeaves: vi.fn(),
    getAllLeaves: vi.fn(),
    getLeaveById: vi.fn(),
    reviewLeave: vi.fn(),
    deleteLeave: vi.fn(),
    getLeaveStats: vi.fn(),
  },
}));

describe('Leave Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with empty leaves and not loading', () => {
    const store = useLeaveStore();
    
    expect(store.leaves).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.stats).toBeNull();
  });

  it('should fetch my leaves successfully', async () => {
    const store = useLeaveStore();
    const mockLeaves = [
      {
        _id: '1',
        userId: { id: '1', name: 'John', email: 'john@test.com', role: 'employee' as const, leaveBalance: 20 },
        startDate: '2025-10-25',
        endDate: '2025-10-27',
        leaveType: 'sick' as const,
        reason: 'Flu',
        status: 'pending' as const,
        daysCount: 3,
        createdAt: '2025-10-20',
        updatedAt: '2025-10-20',
      },
    ];

    vi.mocked(leavesAPI.leavesAPI.getMyLeaves).mockResolvedValue({
      leaves: mockLeaves,
    });

    await store.fetchMyLeaves();

    expect(store.leaves).toEqual(mockLeaves);
    expect(store.loading).toBe(false);
  });

  it('should fetch all leaves successfully (admin)', async () => {
    const store = useLeaveStore();
    const mockLeaves = [
      {
        _id: '1',
        userId: { id: '1', name: 'John', email: 'john@test.com', role: 'employee' as const, leaveBalance: 20 },
        startDate: '2025-10-25',
        endDate: '2025-10-27',
        leaveType: 'annual' as const,
        reason: 'Vacation',
        status: 'approved' as const,
        daysCount: 3,
        createdAt: '2025-10-20',
        updatedAt: '2025-10-21',
      },
    ];

    vi.mocked(leavesAPI.leavesAPI.getAllLeaves).mockResolvedValue({
      leaves: mockLeaves,
    });

    await store.fetchAllLeaves();

    expect(store.leaves).toEqual(mockLeaves);
  });

  it('should create leave successfully', async () => {
    const store = useLeaveStore();
    const newLeave = {
      _id: '2',
      userId: { id: '1', name: 'John', email: 'john@test.com', role: 'employee' as const, leaveBalance: 20 },
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      leaveType: 'casual' as const,
      reason: 'Personal',
      status: 'pending' as const,
      daysCount: 3,
      createdAt: '2025-10-28',
      updatedAt: '2025-10-28',
    };

    vi.mocked(leavesAPI.leavesAPI.createLeave).mockResolvedValue({
      message: 'Leave created',
      leave: newLeave,
    });

    const result = await store.createLeave({
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      leaveType: 'casual',
      reason: 'Personal',
    });

    expect(result).toBe(true);
  });

  it('should handle create leave failure', async () => {
    const store = useLeaveStore();

    vi.mocked(leavesAPI.leavesAPI.createLeave).mockRejectedValue(new Error('Failed to create'));

    const result = await store.createLeave({
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      leaveType: 'sick',
      reason: 'Sick',
    });

    expect(result).toBe(false);
  });

  it('should review leave successfully', async () => {
    const store = useLeaveStore();
    const updatedLeave = {
      _id: '1',
      userId: { id: '1', name: 'John', email: 'john@test.com', role: 'employee' as const, leaveBalance: 17 },
      startDate: '2025-10-25',
      endDate: '2025-10-27',
      leaveType: 'sick' as const,
      reason: 'Flu',
      status: 'approved' as const,
      daysCount: 3,
      createdAt: '2025-10-20',
      updatedAt: '2025-10-28',
      reviewedBy: { id: '2', name: 'Admin', email: 'admin@test.com', role: 'admin' as const, leaveBalance: 20 },
      reviewedAt: '2025-10-28',
      reviewComment: 'Approved',
    };

    vi.mocked(leavesAPI.leavesAPI.reviewLeave).mockResolvedValue({
      message: 'Leave approved',
      leave: updatedLeave,
    });

    const result = await store.reviewLeave('1', {
      status: 'approved',
      reviewComment: 'Approved',
    });

    expect(result).toBe(true);
  });

  it('should delete leave successfully', async () => {
    const store = useLeaveStore();

    vi.mocked(leavesAPI.leavesAPI.deleteLeave).mockResolvedValue({
      message: 'Leave deleted',
    });

    const result = await store.deleteLeave('1');

    expect(result).toBe(true);
  });

  it('should fetch leave stats successfully', async () => {
    const store = useLeaveStore();
    const mockStats = {
      total: 10,
      pending: 3,
      approved: 5,
      rejected: 2,
      leaveBalance: 15,
    };

    vi.mocked(leavesAPI.leavesAPI.getLeaveStats).mockResolvedValue({
      stats: mockStats,
    });

    await store.fetchStats();

    expect(store.stats).toEqual(mockStats);
  });

  it('should handle fetch stats failure', async () => {
    const store = useLeaveStore();

    vi.mocked(leavesAPI.leavesAPI.getLeaveStats).mockRejectedValue(new Error('Failed'));

    await store.fetchStats();

    expect(store.stats).toBeNull();
  });
});
