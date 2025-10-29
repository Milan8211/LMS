import { describe, it, expect, beforeEach } from 'vitest';
import { mockAuthAPI, mockLeavesAPI } from '../mockAPI';
import { mockUsers, setCurrentMockUser, mockLeaves } from '../mockData';

describe('Mock Auth API', () => {
  beforeEach(() => {
    setCurrentMockUser(null);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await mockAuthAPI.register({
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        role: 'employee',
      });

      expect(result.message).toBe('User registered successfully');
      expect(result.user.name).toBe('New User');
      expect(result.user.email).toBe('newuser@test.com');
      expect(result.user.role).toBe('employee');
      expect(result.user.leaveBalance).toBe(20);
    });

    it('should throw error if user already exists', async () => {
      await expect(
        mockAuthAPI.register({
          name: 'John Doe',
          email: 'john@lms.com', // Existing user
          password: 'password123',
          role: 'employee',
        })
      ).rejects.toThrow('User already exists with this email');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await mockAuthAPI.login({
        email: 'john@lms.com',
        password: 'anypassword', // Any password works in mock mode
      });

      expect(result.message).toBe('Login successful');
      expect(result.user.email).toBe('john@lms.com');
      expect(result.user.name).toBe('John Doe');
    });

    it('should throw error with invalid email', async () => {
      await expect(
        mockAuthAPI.login({
          email: 'nonexistent@test.com',
          password: 'password',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      setCurrentMockUser(mockUsers[0]);
      
      const result = await mockAuthAPI.logout();
      
      expect(result.message).toBe('Logout successful');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user if authenticated', async () => {
      setCurrentMockUser(mockUsers[0]);
      
      const result = await mockAuthAPI.getCurrentUser();
      
      expect(result.user).toEqual(mockUsers[0]);
    });

    it('should throw error if not authenticated', async () => {
      setCurrentMockUser(null);
      
      await expect(mockAuthAPI.getCurrentUser()).rejects.toThrow('Not authenticated');
    });
  });
});

describe('Mock Leaves API', () => {
  beforeEach(() => {
    setCurrentMockUser(mockUsers[0]); // Set as employee
  });

  describe('createLeave', () => {
    it('should create a new leave request', async () => {
      const result = await mockLeavesAPI.createLeave({
        startDate: '2025-11-01',
        endDate: '2025-11-03',
        leaveType: 'annual',
        reason: 'Vacation',
      });

      expect(result.message).toBe('Leave request created successfully');
      expect(result.leave.leaveType).toBe('annual');
      expect(result.leave.status).toBe('pending');
      expect(result.leave.daysCount).toBeGreaterThan(0);
    });

    it('should throw error if not authenticated', async () => {
      setCurrentMockUser(null);
      
      await expect(
        mockLeavesAPI.createLeave({
          startDate: '2025-11-01',
          endDate: '2025-11-03',
          leaveType: 'sick',
          reason: 'Flu',
        })
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('getMyLeaves', () => {
    it('should return employee leaves only', async () => {
      const result = await mockLeavesAPI.getMyLeaves();
      
      expect(result.leaves).toBeDefined();
      expect(Array.isArray(result.leaves)).toBe(true);
      
      // All leaves should belong to current user
      result.leaves.forEach((leave) => {
        const userId = typeof leave.userId === 'object' ? leave.userId.id : leave.userId;
        expect(userId).toBe(mockUsers[0].id);
      });
    });

    it('should filter leaves by status', async () => {
      const result = await mockLeavesAPI.getMyLeaves('pending');
      
      result.leaves.forEach((leave) => {
        expect(leave.status).toBe('pending');
      });
    });
  });

  describe('getAllLeaves', () => {
    it('should return all leaves for admin', async () => {
      setCurrentMockUser(mockUsers[2]); // Set as admin
      
      const result = await mockLeavesAPI.getAllLeaves();
      
      expect(result.leaves).toBeDefined();
      expect(result.leaves.length).toBeGreaterThan(0);
    });

    it('should throw error if not admin', async () => {
      setCurrentMockUser(mockUsers[0]); // Employee
      
      await expect(mockLeavesAPI.getAllLeaves()).rejects.toThrow('Access denied');
    });

    it('should filter by status', async () => {
      setCurrentMockUser(mockUsers[2]); // Admin
      
      const result = await mockLeavesAPI.getAllLeaves('approved');
      
      result.leaves.forEach((leave) => {
        expect(leave.status).toBe('approved');
      });
    });
  });

  describe('reviewLeave', () => {
    it('should approve leave request', async () => {
      setCurrentMockUser(mockUsers[2]); // Admin
      
      const pendingLeave = mockLeaves.find((l) => l.status === 'pending');
      if (!pendingLeave) throw new Error('No pending leave found');
      
      const result = await mockLeavesAPI.reviewLeave(pendingLeave._id, {
        status: 'approved',
        reviewComment: 'Approved by admin',
      });

      expect(result.message).toContain('approved successfully');
      expect(result.leave.status).toBe('approved');
      expect(result.leave.reviewComment).toBe('Approved by admin');
    });

    it('should reject leave request', async () => {
      setCurrentMockUser(mockUsers[2]); // Admin
      
      const pendingLeave = mockLeaves.find((l) => l.status === 'pending');
      if (!pendingLeave) throw new Error('No pending leave found');
      
      const result = await mockLeavesAPI.reviewLeave(pendingLeave._id, {
        status: 'rejected',
        reviewComment: 'Not enough notice',
      });

      expect(result.message).toContain('rejected successfully');
      expect(result.leave.status).toBe('rejected');
    });

    it('should throw error if not admin', async () => {
      setCurrentMockUser(mockUsers[0]); // Employee
      
      await expect(
        mockLeavesAPI.reviewLeave('1', {
          status: 'approved',
        })
      ).rejects.toThrow('Access denied');
    });
  });

  describe('deleteLeave', () => {
    it('should delete pending leave', async () => {
      const pendingLeave = mockLeaves.find((l) => l.status === 'pending');
      if (!pendingLeave) throw new Error('No pending leave found');
      
      const result = await mockLeavesAPI.deleteLeave(pendingLeave._id);
      
      expect(result.message).toBe('Leave request deleted successfully');
    });

    it('should throw error if leave not found', async () => {
      await expect(mockLeavesAPI.deleteLeave('nonexistent')).rejects.toThrow(
        'Leave request not found'
      );
    });
  });

  describe('getLeaveStats', () => {
    it('should return leave statistics', async () => {
      const result = await mockLeavesAPI.getLeaveStats();
      
      expect(result.stats).toBeDefined();
      expect(result.stats.total).toBeGreaterThanOrEqual(0);
      expect(result.stats.pending).toBeGreaterThanOrEqual(0);
      expect(result.stats.approved).toBeGreaterThanOrEqual(0);
      expect(result.stats.rejected).toBeGreaterThanOrEqual(0);
    });

    it('should include leave balance for employees', async () => {
      setCurrentMockUser(mockUsers[0]); // Employee
      
      const result = await mockLeavesAPI.getLeaveStats();
      
      expect(result.stats.leaveBalance).toBeDefined();
      expect(result.stats.leaveBalance).toBe(mockUsers[0].leaveBalance);
    });
  });
});
