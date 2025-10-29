import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LeaveType } from '../models/LeaveType';
import { connectDB } from '../config/db';

dotenv.config();

const leaveTypes = [
  {
    name: 'Annual Leave',
    maxPaidDays: 14,
    colorCode: '#1677ff',
    isActive: true,
  },
  {
    name: 'Sick Leave',
    maxPaidDays: 7,
    colorCode: '#ff4d4f',
    isActive: true,
  },
  {
    name: 'Casual Leave',
    maxPaidDays: 7,
    colorCode: '#52c41a',
    isActive: true,
  },
  {
    name: 'Unpaid Leave',
    maxPaidDays: 0,
    colorCode: '#8c8c8c',
    isActive: true,
  },
  {
    name: 'Medical Leave',
    maxPaidDays: 10,
    colorCode: '#fa8c16',
    isActive: true,
  },
];

const seedLeaveTypes = async () => {
  try {
    await connectDB();

    // Clear existing leave types
    await LeaveType.deleteMany({});
    console.log('Cleared existing leave types');

    // Insert new leave types
    const inserted = await LeaveType.insertMany(leaveTypes);
    console.log(`✅ Inserted ${inserted.length} leave types:`);
    inserted.forEach((type) => {
      console.log(`   - ${type.name} (${type.maxPaidDays} paid days)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding leave types:', error);
    process.exit(1);
  }
};

seedLeaveTypes();
