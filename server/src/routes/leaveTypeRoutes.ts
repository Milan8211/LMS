import express from 'express';
import {
  getAllLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from '../controllers/leaveTypeController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes (authenticated users)
router.get('/', authenticate, getAllLeaveTypes);
router.get('/:id', authenticate, getLeaveTypeById);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, createLeaveType);
router.put('/:id', authenticate, authorizeAdmin, updateLeaveType);
router.delete('/:id', authenticate, authorizeAdmin, deleteLeaveType);

export default router;
