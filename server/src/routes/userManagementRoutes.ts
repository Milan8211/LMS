import express from 'express';
import {
  getPendingUsers,
  getAllUsers,
  getUsersByDepartment,
  getAllDepartments,
  approveUser,
  rejectUser,
  updateUserProfile,
  getUserStats,
} from '../controllers/userManagementController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = express.Router();

// Admin only routes
router.get('/pending', authenticate, authorizeAdmin, getPendingUsers);
router.get('/all', authenticate, authorizeAdmin, getAllUsers);
router.get('/departments', authenticate, authorizeAdmin, getAllDepartments);
router.get('/department/:department', authenticate, authorizeAdmin, getUsersByDepartment);
router.get('/stats', authenticate, authorizeAdmin, getUserStats);
router.post('/:id/approve', authenticate, authorizeAdmin, approveUser);
router.post('/:id/reject', authenticate, authorizeAdmin, rejectUser);

// User profile routes (employees can update their own)
router.put('/:id/profile', authenticate, updateUserProfile);

export default router;
