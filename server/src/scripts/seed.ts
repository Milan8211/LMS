import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Leave } from '../models/Leave';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leave-management';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Leave.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
      leaveBalance: 20,
    });
    console.log('👤 Created admin user');

    // Create employee users
    const employees = await User.create([
      {
        name: 'John Doe',
        email: 'john@lms.com',
        password: 'john123',
        role: 'employee',
        leaveBalance: 20,
      },
      {
        name: 'Jane Smith',
        email: 'jane@lms.com',
        password: 'jane123',
        role: 'employee',
        leaveBalance: 15,
      },
      {
        name: 'Bob Johnson',
        email: 'bob@lms.com',
        password: 'bob123',
        role: 'employee',
        leaveBalance: 18,
      },
    ]);
    console.log('👥 Created employee users');

    // Create sample leave requests
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Leave.create([
      {
        userId: employees[0]._id,
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
        leaveType: 'sick',
        reason: 'Not feeling well, need to rest',
        status: 'pending',
        daysCount: 2,
      },
      {
        userId: employees[1]._id,
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
        leaveType: 'annual',
        reason: 'Family vacation planned',
        status: 'approved',
        daysCount: 4,
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        reviewComment: 'Approved - Enjoy your vacation',
      },
      {
        userId: employees[2]._id,
        startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        leaveType: 'casual',
        reason: 'Personal work',
        status: 'rejected',
        daysCount: 2,
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        reviewComment: 'Insufficient notice period',
      },
    ]);
    console.log('📝 Created sample leave requests');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@lms.com');
    console.log('  Password: admin123');
    console.log('\nEmployees:');
    console.log('  Email: john@lms.com | Password: john123');
    console.log('  Email: jane@lms.com | Password: jane123');
    console.log('  Email: bob@lms.com  | Password: bob123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
