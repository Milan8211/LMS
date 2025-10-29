import mongoose, { Document, Schema } from 'mongoose';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'casual' | 'annual' | 'unpaid';

export interface ILeave extends Document {
  userId: mongoose.Types.ObjectId;
  leaveTypeId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType; // Kept for backward compatibility
  isPaid: boolean;
  reason: string;
  status: LeaveStatus;
  daysCount: number;
  priority: 'normal' | 'high'; // High for sick/medical leaves
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveSchema = new Schema<ILeave>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    leaveType: {
      type: String,
      enum: ['sick', 'casual', 'annual', 'unpaid'],
      required: [true, 'Leave type is required'],
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    daysCount: {
      type: Number,
      required: true,
    },
    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewComment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
leaveSchema.index({ userId: 1, status: 1 });
leaveSchema.index({ status: 1, priority: -1, createdAt: -1 });
leaveSchema.index({ leaveTypeId: 1 });

export const Leave = mongoose.model<ILeave>('Leave', leaveSchema);
