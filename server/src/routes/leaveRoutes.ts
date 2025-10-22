import { Router } from 'express';
import {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  reviewLeave,
  deleteLeave,
  getLeaveStats,
} from '../controllers/leaveController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/', createLeaveRequest);
router.get('/my-leaves', getMyLeaves);
router.get('/stats', getLeaveStats);
router.get('/:id', getLeaveById);
router.delete('/:id', deleteLeave);

// Admin routes
router.get('/', authorize('admin'), getAllLeaves);
router.patch('/:id/review', authorize('admin'), reviewLeave);

export default router;
