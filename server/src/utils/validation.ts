import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employee', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const leaveRequestSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  leaveType: z.enum(['sick', 'casual', 'annual', 'unpaid']),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export const leaveReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reviewComment: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type LeaveReviewInput = z.infer<typeof leaveReviewSchema>;
