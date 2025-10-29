export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  department: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  leaveBalance: number;
  approvedBy?: User | string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'casual' | 'annual' | 'unpaid';
export type LeavePriority = 'normal' | 'high';

export interface LeaveTypeConfig {
  _id: string;
  name: string;
  maxPaidDays: number;
  colorCode: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Leave {
  _id: string;
  userId: User | string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  isPaid: boolean;
  priority: LeavePriority;
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
  department: string;
  // Password will be assigned by admin during approval
}

export interface LeaveRequest {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  isPaid: boolean;
  reason: string;
}

export interface LeaveReview {
  status: 'approved' | 'rejected';
  reviewComment?: string;
}

export interface UserApproval {
  password: string;
  leaveBalance?: number;
}

export interface LeaveTypeBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  maxPaidDays: number;
  usedDays: number;
  remainingDays: number;
  colorCode: string;
}

export interface UserStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byDepartment: { _id: string; count: number }[];
}
