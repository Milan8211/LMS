import { Request, Response } from 'express';
import { User } from '../models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Get all pending users (Admin only)
export const getPendingUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users: pendingUsers });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users with filters (Admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, approvalStatus, role } = req.query;
    
    const filter: any = {};
    if (department) filter.department = department;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (role) filter.role = role;
    
    const users = await User.find(filter)
      .select('-password')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by department (Admin only)
export const getUsersByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department } = req.params;
    
    const users = await User.find({ 
      department,
      approvalStatus: 'approved'
    })
      .select('-password')
      .sort({ name: 1 });
    
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all departments
export const getAllDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await User.distinct('department');
    res.json({ departments: departments.sort() });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve user and assign password (Admin only)
const approveUserSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  leaveBalance: z.number().min(0).optional(),
});

export const approveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = approveUserSchema.parse(req.body);
    
    const user = await User.findById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (user.approvalStatus !== 'pending') {
      res.status(400).json({ message: 'User is not in pending status' });
      return;
    }
    
    // Update user
    user.password = validatedData.password;
    user.approvalStatus = 'approved';
    user.approvedBy = (req as any).user.userId;
    user.approvedAt = new Date();
    
    if (validatedData.leaveBalance !== undefined) {
      user.leaveBalance = validatedData.leaveBalance;
    }
    
    await user.save();
    
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate('approvedBy', 'name email');
    
    res.json({ 
      message: 'User approved successfully', 
      user: updatedUser 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject user (Admin only)
const rejectUserSchema = z.object({
  reason: z.string().optional(),
});

export const rejectUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (user.approvalStatus !== 'pending') {
      res.status(400).json({ message: 'User is not in pending status' });
      return;
    }
    
    user.approvalStatus = 'rejected';
    user.approvedBy = (req as any).user.userId;
    user.approvedAt = new Date();
    
    await user.save();
    
    res.json({ message: 'User rejected successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile (Employee can update own profile)
const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    // Check if user is updating their own profile or is admin
    if (currentUser.userId !== id && currentUser.role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Employees cannot change their role or department
    if (currentUser.role !== 'admin') {
      delete (req.body as any).role;
      delete (req.body as any).department;
      delete (req.body as any).leaveBalance;
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user statistics (Admin only)
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ approvalStatus: 'pending' });
    const approvedUsers = await User.countDocuments({ approvalStatus: 'approved' });
    const rejectedUsers = await User.countDocuments({ approvalStatus: 'rejected' });
    
    const usersByDepartment = await User.aggregate([
      { $match: { approvalStatus: 'approved' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      stats: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
        byDepartment: usersByDepartment,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
