import { Response } from 'express';
import { Leave } from '../models/Leave';
import { User } from '../models/User';
import { leaveRequestSchema, leaveReviewSchema } from '../utils/validation';
import { AuthRequest } from '../middlewares/auth';

// Calculate number of days between two dates (excluding weekends)
const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Count only weekdays (Monday to Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const createLeaveRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = leaveRequestSchema.parse(req.body);
    const userId = req.user?.userId;

    // Get user's current leave balance
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const daysCount = calculateLeaveDays(startDate, endDate);

    // Check if user has enough leave balance
    if (daysCount > user.leaveBalance) {
      res.status(400).json({
        message: `Insufficient leave balance. You have ${user.leaveBalance} days available, but requested ${daysCount} days.`,
      });
      return;
    }

    // Create leave request
    const leave = await Leave.create({
      userId,
      startDate,
      endDate,
      leaveType: validatedData.leaveType,
      reason: validatedData.reason,
      daysCount,
    });

    const populatedLeave = await Leave.findById(leave._id).populate('userId', 'name email');

    res.status(201).json({
      message: 'Leave request created successfully',
      leave: populatedLeave,
    });
  } catch (error) {
    throw error;
  }
};

export const getMyLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query;

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const leaves = await Leave.find(filter)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    throw error;
  }
};

export const getAllLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, userId } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (userId) {
      filter.userId = userId;
    }

    const leaves = await Leave.find(filter)
      .populate('userId', 'name email role leaveBalance')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    throw error;
  }
};

export const getLeaveById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const leave = await Leave.findById(id)
      .populate('userId', 'name email role leaveBalance')
      .populate('reviewedBy', 'name email');

    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' });
      return;
    }

    // Check if user has permission to view this leave
    if (userRole !== 'admin' && leave.userId._id.toString() !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ leave });
  } catch (error) {
    throw error;
  }
};

export const reviewLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = leaveReviewSchema.parse(req.body);
    const reviewerId = req.user?.userId;

    const leave = await Leave.findById(id).populate('userId');
    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' });
      return;
    }

    if (leave.status !== 'pending') {
      res.status(400).json({ message: 'Leave request has already been reviewed' });
      return;
    }

    // Update leave status
    leave.status = validatedData.status;
    leave.reviewedBy = reviewerId as any;
    leave.reviewedAt = new Date();
    leave.reviewComment = validatedData.reviewComment;

    await leave.save();

    // Update user's leave balance if approved
    if (validatedData.status === 'approved') {
      const user = await User.findById(leave.userId);
      if (user) {
        user.leaveBalance -= leave.daysCount;
        await user.save();
      }
    }

    const updatedLeave = await Leave.findById(id)
      .populate('userId', 'name email role leaveBalance')
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      message: `Leave request ${validatedData.status} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const leave = await Leave.findById(id);
    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' });
      return;
    }

    // Only allow deletion if leave is pending and belongs to the user
    if (leave.userId.toString() !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (leave.status !== 'pending') {
      res.status(400).json({ message: 'Cannot delete a reviewed leave request' });
      return;
    }

    await Leave.findByIdAndDelete(id);

    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const getLeaveStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (userRole === 'admin') {
      // Admin stats - all leaves
      const totalLeaves = await Leave.countDocuments();
      const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
      const approvedLeaves = await Leave.countDocuments({ status: 'approved' });
      const rejectedLeaves = await Leave.countDocuments({ status: 'rejected' });

      res.status(200).json({
        stats: {
          total: totalLeaves,
          pending: pendingLeaves,
          approved: approvedLeaves,
          rejected: rejectedLeaves,
        },
      });
    } else {
      // Employee stats - own leaves
      const user = await User.findById(userId);
      const totalLeaves = await Leave.countDocuments({ userId });
      const pendingLeaves = await Leave.countDocuments({ userId, status: 'pending' });
      const approvedLeaves = await Leave.countDocuments({ userId, status: 'approved' });
      const rejectedLeaves = await Leave.countDocuments({ userId, status: 'rejected' });

      res.status(200).json({
        stats: {
          total: totalLeaves,
          pending: pendingLeaves,
          approved: approvedLeaves,
          rejected: rejectedLeaves,
          leaveBalance: user?.leaveBalance || 0,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};
