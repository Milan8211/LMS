import { Request, Response } from 'express';
import { LeaveType } from '../models/LeaveType';
import { z } from 'zod';

// Validation schemas
const leaveTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  maxPaidDays: z.number().min(0, 'Max paid days must be non-negative'),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color code'),
});

// Get all leave types
export const getAllLeaveTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaveTypes = await LeaveType.find({ isActive: true }).sort({ name: 1 });
    res.json({ leaveTypes });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single leave type
export const getLeaveTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    
    if (!leaveType) {
      res.status(404).json({ message: 'Leave type not found' });
      return;
    }
    
    res.json({ leaveType });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create leave type (Admin only)
export const createLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = leaveTypeSchema.parse(req.body);
    
    // Check if leave type already exists
    const existingType = await LeaveType.findOne({ name: validatedData.name });
    if (existingType) {
      res.status(400).json({ message: 'Leave type with this name already exists' });
      return;
    }
    
    const leaveType = await LeaveType.create(validatedData);
    res.status(201).json({ message: 'Leave type created successfully', leaveType });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update leave type (Admin only)
export const updateLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = leaveTypeSchema.partial().parse(req.body);
    
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!leaveType) {
      res.status(404).json({ message: 'Leave type not found' });
      return;
    }
    
    res.json({ message: 'Leave type updated successfully', leaveType });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete leave type (Admin only) - Soft delete
export const deleteLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!leaveType) {
      res.status(404).json({ message: 'Leave type not found' });
      return;
    }
    
    res.json({ message: 'Leave type deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
