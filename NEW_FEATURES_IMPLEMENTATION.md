# 🚀 New Features Implementation Guide

## Overview

This document outlines the comprehensive updates made to the Leave Management System to implement advanced features including user approval workflow, leave types management, department-based organization, and enhanced admin capabilities.

## ✅ Backend Changes Completed

### 1. **Updated User Model** (`server/src/models/User.ts`)

#### New Fields Added:
- `department`: string (required) - Employee's department
- `approvalStatus`: 'pending' | 'approved' | 'rejected' (default: 'pending')
- `approvedBy`: ObjectId (reference to admin who approved)
- `approvedAt`: Date (timestamp of approval)

#### Key Changes:
- Password is now optional during signup (set by admin during approval)
- Users start with 'pending' status
- Only approved users can log in

### 2. **New LeaveType Model** (`server/src/models/LeaveType.ts`)

#### Fields:
- `name`: string (unique) - Leave type name (e.g., "Annual Leave")
- `maxPaidDays`: number - Maximum paid days allowed
- `colorCode`: string - Hex color for calendar display
- `isActive`: boolean - Soft delete flag

#### Features:
- CRUD operations for leave types
- Color-coded for visual calendar
- Configurable paid days limit

### 3. **Updated Leave Model** (`server/src/models/Leave.ts`)

#### New Fields:
- `leaveTypeId`: ObjectId (reference to LeaveType)
- `isPaid`: boolean - Whether leave is paid or unpaid
- `priority`: 'normal' | 'high' - High priority for sick/medical leaves

#### Enhanced Features:
- Link to leave type for better categorization
- Paid/unpaid tracking
- Priority-based sorting (sick leaves prioritized)

### 4. **New Controllers**

#### LeaveType Controller (`server/src/controllers/leaveTypeController.ts`)
- `getAllLeaveTypes()` - Get all active leave types
- `getLeaveTypeById()` - Get single leave type
- `createLeaveType()` - Create new leave type (Admin only)
- `updateLeaveType()` - Update leave type (Admin only)
- `deleteLeaveType()` - Soft delete leave type (Admin only)

#### User Management Controller (`server/src/controllers/userManagementController.ts`)
- `getPendingUsers()` - Get all pending approval users (Admin)
- `getAllUsers()` - Get users with filters (Admin)
- `getUsersByDepartment()` - Get users by department (Admin)
- `getAllDepartments()` - Get list of all departments
- `approveUser()` - Approve user and assign password (Admin)
- `rejectUser()` - Reject user registration (Admin)
- `updateUserProfile()` - Update user profile (Employee/Admin)
- `getUserStats()` - Get user statistics (Admin)

### 5. **Updated Auth Controller** (`server/src/controllers/authController.ts`)

#### Registration Flow:
```typescript
// Old: User provides password during signup
// New: User provides name, email, department only
// Password assigned by admin during approval
```

#### Login Flow:
```typescript
// Checks added:
1. Check if user exists
2. Check approval status (pending/rejected/approved)
3. Check if password is set
4. Verify password
5. Generate tokens
```

### 6. **New Routes**

#### Leave Types (`/api/leave-types`)
- `GET /` - Get all leave types
- `GET /:id` - Get leave type by ID
- `POST /` - Create leave type (Admin)
- `PUT /:id` - Update leave type (Admin)
- `DELETE /:id` - Delete leave type (Admin)

#### User Management (`/api/users`)
- `GET /pending` - Get pending users (Admin)
- `GET /all` - Get all users with filters (Admin)
- `GET /departments` - Get all departments
- `GET /department/:department` - Get users by department (Admin)
- `GET /stats` - Get user statistics (Admin)
- `POST /:id/approve` - Approve user (Admin)
- `POST /:id/reject` - Reject user (Admin)
- `PUT /:id/profile` - Update profile

### 7. **Updated Validation Schemas** (`server/src/utils/validation.ts`)

#### Register Schema:
```typescript
{
  name: string (min 2 chars),
  email: string (valid email),
  department: string (min 2 chars)
  // No password required
}
```

#### Leave Request Schema:
```typescript
{
  leaveTypeId: string (required),
  startDate: string (valid date),
  endDate: string (valid date),
  leaveType: enum,
  isPaid: boolean (default true),
  reason: string (min 10 chars)
}
```

### 8. **New Middleware** (`server/src/middlewares/auth.ts`)

#### Added:
```typescript
export const authorizeAdmin = (req, res, next) => {
  // Check if user is admin
  // Deny access if not admin
}
```

### 9. **Seed Script** (`server/src/scripts/seedLeaveTypes.ts`)

#### Default Leave Types:
1. **Annual Leave** - 14 paid days (#1677ff - Blue)
2. **Sick Leave** - 7 paid days (#ff4d4f - Red)
3. **Casual Leave** - 7 paid days (#52c41a - Green)
4. **Unpaid Leave** - 0 paid days (#8c8c8c - Gray)
5. **Medical Leave** - 10 paid days (#fa8c16 - Orange)

## 🎯 API Endpoints Summary

### Authentication
```
POST /api/auth/register - Register (pending approval)
POST /api/auth/login - Login (approved users only)
POST /api/auth/logout - Logout
GET /api/auth/me - Get current user
```

### Leave Types (Admin)
```
GET /api/leave-types - Get all leave types
GET /api/leave-types/:id - Get leave type
POST /api/leave-types - Create leave type
PUT /api/leave-types/:id - Update leave type
DELETE /api/leave-types/:id - Delete leave type
```

### User Management (Admin)
```
GET /api/users/pending - Get pending users
GET /api/users/all - Get all users (with filters)
GET /api/users/departments - Get all departments
GET /api/users/department/:dept - Get users by department
GET /api/users/stats - Get user statistics
POST /api/users/:id/approve - Approve user
POST /api/users/:id/reject - Reject user
PUT /api/users/:id/profile - Update profile
```

### Leaves
```
POST /api/leaves - Create leave request
GET /api/leaves/my-leaves - Get my leaves
GET /api/leaves - Get all leaves (Admin)
GET /api/leaves/:id - Get leave by ID
PATCH /api/leaves/:id/review - Review leave (Admin)
DELETE /api/leaves/:id - Delete leave
GET /api/leaves/stats - Get leave statistics
```

## 🔄 User Registration & Approval Flow

### Step 1: User Signup
```
User fills form:
- Full Name
- Email
- Department

Backend creates user with:
- approvalStatus: 'pending'
- No password set
```

### Step 2: Admin Reviews
```
Admin sees pending user in dashboard
Admin can:
- Approve → Assign password
- Reject → User cannot login
```

### Step 3: User Login
```
Approved user can login with:
- Email
- Password (assigned by admin)

Pending/Rejected users cannot login
```

## 🏢 Department-Based Features

### Department Management
- Departments are extracted from user records
- No separate department table (flexible approach)
- Admin can filter users/leaves by department

### Department Filtering
```typescript
// Get users by department
GET /api/users/department/Engineering

// Get leaves by department (via user filter)
GET /api/leaves?department=Engineering
```

## 📊 Leave Types Management

### Creating Leave Type
```json
POST /api/leave-types
{
  "name": "Maternity Leave",
  "maxPaidDays": 90,
  "colorCode": "#eb2f96"
}
```

### Applying for Leave
```json
POST /api/leaves
{
  "leaveTypeId": "60d5ec49f1b2c72b8c8e4a1a",
  "startDate": "2025-11-01",
  "endDate": "2025-11-05",
  "leaveType": "annual",
  "isPaid": true,
  "reason": "Family vacation planned"
}
```

### Paid vs Unpaid Leaves
- **Paid**: Deducted from leave balance
- **Unpaid**: Not deducted, tracked separately
- Employee chooses during application
- Admin sees both types in dashboard

## 🎨 Priority System

### Leave Priority
- **High**: Sick Leave, Medical Leave
- **Normal**: All other leaves

### Admin Dashboard Sorting
```typescript
// Leaves sorted by:
1. Priority (high first)
2. Created date (newest first)
```

## 📝 Database Indexes

### User Model
```typescript
{ email: 1 } - Unique index
{ approvalStatus: 1, createdAt: -1 } - Pending users query
{ department: 1 } - Department filtering
```

### Leave Model
```typescript
{ userId: 1, status: 1 } - User's leaves
{ status: 1, priority: -1, createdAt: -1 } - Admin dashboard
{ leaveTypeId: 1 } - Leave type filtering
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Seed Leave Types
```bash
npm run seed:leave-types
```

### 3. Start Server
```bash
npm run dev
```

### 4. Create Admin User
```bash
# Use existing seed script or create manually in MongoDB
npm run seed
```

## 🔐 Security Features

### Password Management
- Passwords hashed with bcrypt (salt rounds: 10)
- Admin assigns initial password
- Users can change password later (future feature)

### Role-Based Access
- **Employee**: Can view/apply for own leaves
- **Admin**: Full access to all features

### JWT Authentication
- Access token (15 minutes)
- Refresh token (7 days)
- HTTP-only cookies

## 📊 Admin Dashboard Features

### Pending Users Tab
- List of users awaiting approval
- Approve/Reject buttons
- Assign password during approval

### Department View
- Filter employees by department
- View department-wise leave requests
- Department statistics

### Leave Overview
- Filter by type, status, department
- Priority highlighting (sick leaves)
- Calendar view integration

### Statistics
- Total users (pending/approved/rejected)
- Users by department
- Leave statistics by type
- Leave balance tracking

## 🎯 Next Steps (Frontend Implementation)

1. Update frontend types to match backend
2. Create Leave Types management UI
3. Implement Pending Users approval UI
4. Update Leave Application form (paid/unpaid option)
5. Add Department filter to sidebar
6. Enhance Admin Dashboard with new tabs
7. Update Calendar to use leave type colors
8. Add priority indicators for sick leaves

## 📚 Testing

### Test Scenarios

#### User Registration
```bash
# Test pending user creation
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@company.com",
  "department": "Engineering"
}

# Verify user cannot login (pending status)
POST /api/auth/login
{
  "email": "john@company.com",
  "password": "anypassword"
}
# Should return: "Your account is pending admin approval"
```

#### Admin Approval
```bash
# Approve user
POST /api/users/:id/approve
{
  "password": "SecurePass123",
  "leaveBalance": 20
}

# User can now login
POST /api/auth/login
{
  "email": "john@company.com",
  "password": "SecurePass123"
}
# Should return: Success with user data
```

#### Leave Types
```bash
# Create leave type
POST /api/leave-types
{
  "name": "Paternity Leave",
  "maxPaidDays": 14,
  "colorCode": "#722ed1"
}

# Get all leave types
GET /api/leave-types
```

## 🐛 Known Issues & Solutions

### Issue: Password required error during signup
**Solution**: Updated User model to make password optional

### Issue: Existing users without department
**Solution**: Run migration script to add default department

### Issue: Leave type not found
**Solution**: Run seed script to populate leave types

## 📖 API Response Examples

### Successful Registration
```json
{
  "message": "Registration successful. Your account is pending admin approval.",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@company.com",
    "department": "Engineering",
    "approvalStatus": "pending"
  }
}
```

### Pending Users List
```json
{
  "users": [
    {
      "id": "60d5ec49f1b2c72b8c8e4a1a",
      "name": "John Doe",
      "email": "john@company.com",
      "department": "Engineering",
      "approvalStatus": "pending",
      "createdAt": "2025-10-28T10:30:00.000Z"
    }
  ]
}
```

### Leave Types List
```json
{
  "leaveTypes": [
    {
      "id": "60d5ec49f1b2c72b8c8e4a1b",
      "name": "Annual Leave",
      "maxPaidDays": 14,
      "colorCode": "#1677ff",
      "isActive": true
    }
  ]
}
```

---

**Backend implementation is complete! Ready for frontend integration.** 🎉
