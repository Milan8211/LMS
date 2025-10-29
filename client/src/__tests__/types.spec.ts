import { describe, it, expect } from 'vitest';
import type { User, Leave, LeaveStatus, LeaveType } from '@/types';

describe('Type Definitions', () => {
  describe('User Type', () => {
    it('should create a valid employee user', () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        role: 'employee',
        leaveBalance: 20,
      };

      expect(user.id).toBe('1');
      expect(user.role).toBe('employee');
      expect(user.leaveBalance).toBe(20);
    });

    it('should create a valid admin user', () => {
      const user: User = {
        id: '2',
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        leaveBalance: 20,
      };

      expect(user.role).toBe('admin');
    });
  });

  describe('Leave Type', () => {
    it('should create a valid leave request', () => {
      const leave: Leave = {
        _id: '1',
        userId: {
          id: '1',
          name: 'John',
          email: 'john@test.com',
          role: 'employee',
          leaveBalance: 20,
        },
        startDate: '2025-10-25',
        endDate: '2025-10-27',
        leaveType: 'sick',
        reason: 'Flu',
        status: 'pending',
        daysCount: 3,
        createdAt: '2025-10-20',
        updatedAt: '2025-10-20',
      };

      expect(leave._id).toBe('1');
      expect(leave.leaveType).toBe('sick');
      expect(leave.status).toBe('pending');
      expect(leave.daysCount).toBe(3);
    });

    it('should have valid leave statuses', () => {
      const statuses: LeaveStatus[] = ['pending', 'approved', 'rejected'];
      
      expect(statuses).toContain('pending');
      expect(statuses).toContain('approved');
      expect(statuses).toContain('rejected');
    });

    it('should have valid leave types', () => {
      const types: LeaveType[] = ['sick', 'casual', 'annual'];
      
      expect(types).toContain('sick');
      expect(types).toContain('casual');
      expect(types).toContain('annual');
    });
  });

  describe('Leave with Review', () => {
    it('should create a reviewed leave', () => {
      const leave: Leave = {
        _id: '1',
        userId: {
          id: '1',
          name: 'John',
          email: 'john@test.com',
          role: 'employee',
          leaveBalance: 17,
        },
        startDate: '2025-10-25',
        endDate: '2025-10-27',
        leaveType: 'annual',
        reason: 'Vacation',
        status: 'approved',
        daysCount: 3,
        createdAt: '2025-10-20',
        updatedAt: '2025-10-22',
        reviewedBy: {
          id: '2',
          name: 'Admin',
          email: 'admin@test.com',
          role: 'admin',
          leaveBalance: 20,
        },
        reviewedAt: '2025-10-22',
        reviewComment: 'Approved - Enjoy your vacation',
      };

      expect(leave.status).toBe('approved');
      expect(leave.reviewedBy).toBeDefined();
      expect(leave.reviewedAt).toBeDefined();
      expect(leave.reviewComment).toBe('Approved - Enjoy your vacation');
    });
  });
});
