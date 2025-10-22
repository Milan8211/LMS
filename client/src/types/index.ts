export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  leaveBalance: number;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'casual' | 'annual' | 'unpaid';

export interface Leave {
  _id: string;
  userId: User | string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  daysCount: number;
  reviewedBy?: User | string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  leaveBalance?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'employee' | 'admin';
}

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
}

export interface LeaveReview {
  status: 'approved' | 'rejected';
  reviewComment?: string;
}
