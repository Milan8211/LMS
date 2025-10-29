import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaveType extends Document {
  name: string;
  maxPaidDays: number;
  colorCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    name: {
      type: String,
      required: [true, 'Leave type name is required'],
      unique: true,
      trim: true,
    },
    maxPaidDays: {
      type: Number,
      required: [true, 'Maximum paid days is required'],
      min: 0,
    },
    colorCode: {
      type: String,
      required: [true, 'Color code is required'],
      default: '#1677ff',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LeaveType = mongoose.model<ILeaveType>('LeaveType', leaveTypeSchema);
