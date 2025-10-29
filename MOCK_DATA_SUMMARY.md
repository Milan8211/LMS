# 🎭 Mock Data & API Updates - Complete Summary

## ✅ What Has Been Updated

All mock data and mock APIs have been updated to support the new features including:
- User approval workflow
- Department organization
- Leave types management
- Paid/unpaid leave tracking
- Priority system

## 📊 Updated Mock Data

### 1. Mock Leave Types (`mockLeaveTypes`)

**5 Leave Types Created:**

| ID | Name | Max Paid Days | Color Code | Description |
|----|------|---------------|------------|-------------|
| lt1 | Annual Leave | 14 days | #1677ff (Blue) | Standard vacation leave |
| lt2 | Sick Leave | 7 days | #ff4d4f (Red) | Illness-related leave |
| lt3 | Casual Leave | 7 days | #52c41a (Green) | Short-term personal leave |
| lt4 | Unpaid Leave | 0 days | #8c8c8c (Gray) | Extended unpaid leave |
| lt5 | Medical Leave | 10 days | #fa8c16 (Orange) | Medical procedures |

### 2. Mock Users (`mockUsers`)

**7 Users Created:**

#### Approved Users (4):
1. **John Doe** - Engineering, Employee
   - Email: john@lms.com
   - Leave Balance: 18 days
   - Status: Approved

2. **Jane Smith** - HR, Employee
   - Email: jane@lms.com
   - Leave Balance: 15 days
   - Status: Approved

3. **Admin User** - Management, Admin
   - Email: admin@lms.com
   - Leave Balance: 20 days
   - Status: Approved

4. **Bob Wilson** - Engineering, Employee
   - Email: bob@lms.com
   - Leave Balance: 20 days
   - Status: Approved

#### Pending Users (2):
5. **Alice Brown** - Marketing, Employee
   - Email: alice@lms.com
   - Status: Pending (awaiting approval)

6. **Charlie Davis** - Sales, Employee
   - Email: charlie@lms.com
   - Status: Pending (awaiting approval)

#### Rejected Users (1):
7. **Diana Evans** - Engineering, Employee
   - Email: diana@lms.com
   - Status: Rejected

### 3. Mock Leaves (`mockLeaves`)

**8 Leave Requests Created:**

| ID | Employee | Type | Days | Status | Paid | Priority | Department |
|----|----------|------|------|--------|------|----------|------------|
| 1 | John Doe | Sick Leave | 3 | Pending | Yes | High | Engineering |
| 2 | John Doe | Annual Leave | 5 | Approved | Yes | Normal | Engineering |
| 3 | John Doe | Casual Leave | 3 | Rejected | No | Normal | Engineering |
| 4 | Jane Smith | Medical Leave | 3 | Pending | Yes | High | HR |
| 5 | Jane Smith | Annual Leave | 3 | Approved | Yes | Normal | HR |
| 6 | John Doe | Casual Leave | 3 | Approved | Yes | Normal | Engineering |
| 7 | Bob Wilson | Sick Leave | 2 | Pending | Yes | High | Engineering |
| 8 | Bob Wilson | Unpaid Leave | 6 | Pending | No | Normal | Engineering |

### 4. Departments

**5 Departments:**
- Engineering (3 employees)
- HR (1 employee)
- Management (1 employee)
- Marketing (1 employee - pending)
- Sales (1 employee - pending)

## 🔌 New Mock APIs

### 1. Mock Leave Types API (`mockLeaveTypesAPI`)

```typescript
mockLeaveTypesAPI = {
  getAll()          // Get all active leave types
  getById(id)       // Get specific leave type
  create(data)      // Create new leave type (admin only)
  update(id, data)  // Update leave type (admin only)
  delete(id)        // Soft delete leave type (admin only)
}
```

**Features:**
- ✅ Admin-only access control
- ✅ Soft delete (sets isActive: false)
- ✅ Returns only active leave types by default
- ✅ Simulated network delay

### 2. Mock User Management API (`mockUserManagementAPI`)

```typescript
mockUserManagementAPI = {
  getPendingUsers()                    // Get users awaiting approval
  getAllUsers(filters)                 // Get all users with filters
  getUsersByDepartment(department)     // Get users in department
  getDepartments()                     // Get all departments
  approveUser(id, data)                // Approve user & assign password
  rejectUser(id)                       // Reject user
  getUserStats()                       // Get user statistics
  updateProfile(id, data)              // Update user profile
}
```

**Features:**
- ✅ Admin-only access control
- ✅ Department filtering
- ✅ Approval status filtering
- ✅ Password assignment on approval
- ✅ Leave balance assignment on approval
- ✅ Statistics by department

## 📝 Updated Existing APIs

### 1. Mock Auth API Updates

#### Registration (`mockAuthAPI.register`)
**Changes:**
- ✅ No longer requires password
- ✅ Requires department field
- ✅ Creates user with `approvalStatus: 'pending'`
- ✅ Sets initial `leaveBalance: 0`
- ✅ Returns message: "Registration successful. Waiting for admin approval."

**Before:**
```typescript
{
  name: string;
  email: string;
  password: string;  // Required
  role?: string;
}
```

**After:**
```typescript
{
  name: string;
  email: string;
  department: string;  // Required
  // No password field
}
```

#### Login (`mockAuthAPI.login`)
**Changes:**
- ✅ Checks `approvalStatus` before login
- ✅ Rejects pending users: "Your account is pending admin approval"
- ✅ Rejects rejected users: "Your account has been rejected"
- ✅ Only allows approved users to login

### 2. Mock Leaves API Updates

#### Create Leave (`mockLeavesAPI.createLeave`)
**Changes:**
- ✅ Requires `leaveTypeId` field
- ✅ Requires `isPaid` field
- ✅ Auto-determines `priority` (sick = high, others = normal)
- ✅ Fixed days calculation (now includes both start and end dates)

**Before:**
```typescript
{
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
}
```

**After:**
```typescript
{
  leaveTypeId: string;  // NEW
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  isPaid: boolean;      // NEW
  reason: string;
}
```

#### Review Leave (`mockLeavesAPI.reviewLeave`)
**Changes:**
- ✅ Only deducts balance if leave is `isPaid: true`
- ✅ Unpaid leaves don't affect balance

## 🎯 Testing Scenarios

### Scenario 1: User Registration & Approval
```javascript
// 1. Register new user
await mockAuthAPI.register({
  name: 'Test User',
  email: 'test@lms.com',
  department: 'Engineering'
});
// Result: User created with status 'pending'

// 2. Try to login
await mockAuthAPI.login({ email: 'test@lms.com', password: 'any' });
// Result: Error - "Your account is pending admin approval"

// 3. Admin approves
await mockUserManagementAPI.approveUser('user_id', {
  password: 'Welcome123',
  leaveBalance: 20
});
// Result: User status = 'approved', balance = 20

// 4. Login again
await mockAuthAPI.login({ email: 'test@lms.com', password: 'any' });
// Result: Success!
```

### Scenario 2: Leave Type Balances
```javascript
// 1. Get all leave types
const { leaveTypes } = await mockLeaveTypesAPI.getAll();
// Result: 5 leave types with colors and max days

// 2. Apply for Annual Leave (paid)
await mockLeavesAPI.createLeave({
  leaveTypeId: 'lt1',
  startDate: '2025-11-01',
  endDate: '2025-11-05',
  leaveType: 'annual',
  isPaid: true,
  reason: 'Vacation'
});
// Result: Leave created with priority: 'normal'

// 3. Admin approves
await mockLeavesAPI.reviewLeave('leave_id', {
  status: 'approved'
});
// Result: User balance reduced by 5 days (because isPaid: true)

// 4. Apply for Unpaid Leave
await mockLeavesAPI.createLeave({
  leaveTypeId: 'lt4',
  startDate: '2025-12-01',
  endDate: '2025-12-03',
  leaveType: 'unpaid',
  isPaid: false,
  reason: 'Personal'
});
// Result: Leave created

// 5. Admin approves
await mockLeavesAPI.reviewLeave('leave_id', {
  status: 'approved'
});
// Result: User balance NOT reduced (because isPaid: false)
```

### Scenario 3: Department Filtering
```javascript
// 1. Get all departments
const { departments } = await mockUserManagementAPI.getDepartments();
// Result: ['Engineering', 'HR', 'Management', 'Marketing', 'Sales']

// 2. Get Engineering employees
const { users } = await mockUserManagementAPI.getUsersByDepartment('Engineering');
// Result: [John Doe, Bob Wilson] (only approved users)

// 3. Get Engineering leaves
const { leaves } = await mockLeavesAPI.getAllLeaves();
const engineeringLeaves = leaves.filter(l => l.userId.department === 'Engineering');
// Result: 5 leaves from Engineering department
```

### Scenario 4: Priority System
```javascript
// 1. Apply for Sick Leave
await mockLeavesAPI.createLeave({
  leaveTypeId: 'lt2',
  startDate: '2025-11-01',
  endDate: '2025-11-02',
  leaveType: 'sick',
  isPaid: true,
  reason: 'Flu'
});
// Result: Leave created with priority: 'high'

// 2. Apply for Casual Leave
await mockLeavesAPI.createLeave({
  leaveTypeId: 'lt3',
  startDate: '2025-11-01',
  endDate: '2025-11-02',
  leaveType: 'casual',
  isPaid: true,
  reason: 'Personal'
});
// Result: Leave created with priority: 'normal'

// 3. Get all leaves
const { leaves } = await mockLeavesAPI.getAllLeaves();
// Result: Sick leave appears first (high priority)
```

### Scenario 5: User Statistics
```javascript
// Get user stats
const { stats } = await mockUserManagementAPI.getUserStats();
// Result:
// {
//   total: 7,
//   pending: 2,
//   approved: 4,
//   rejected: 1,
//   byDepartment: [
//     { _id: 'Engineering', count: 2 },
//     { _id: 'HR', count: 1 },
//     { _id: 'Management', count: 1 }
//   ]
// }
```

## 🎨 Visual Data Summary

### Leave Distribution by Status
- **Pending:** 4 leaves (50%)
- **Approved:** 3 leaves (37.5%)
- **Rejected:** 1 leave (12.5%)

### Leave Distribution by Priority
- **High Priority:** 3 leaves (sick/medical)
- **Normal Priority:** 5 leaves

### Leave Distribution by Type
- **Paid:** 6 leaves (75%)
- **Unpaid:** 2 leaves (25%)

### User Distribution by Status
- **Approved:** 4 users (57%)
- **Pending:** 2 users (29%)
- **Rejected:** 1 user (14%)

### Department Distribution
- **Engineering:** 3 employees (43%)
- **HR:** 1 employee (14%)
- **Management:** 1 employee (14%)
- **Marketing:** 1 employee (14%)
- **Sales:** 1 employee (14%)

## 🔧 Integration with Real APIs

All mock APIs are integrated with the real API files using the `APP_CONFIG.USE_MOCK_API` flag:

### leaveTypes.ts
```typescript
if (APP_CONFIG.USE_MOCK_API) {
  return mockLeaveTypesAPI.getAll();
}
const response = await api.get('/leave-types');
return response.data;
```

### userManagement.ts
```typescript
if (APP_CONFIG.USE_MOCK_API) {
  return mockUserManagementAPI.getPendingUsers();
}
const response = await api.get('/users/pending');
return response.data;
```

## 🚀 How to Use

### 1. Enable Mock Mode
```typescript
// In app.config.ts
export const APP_CONFIG = {
  USE_MOCK_API: true,  // Set to true for mock mode
  MOCK_DELAY: 500,     // Simulated network delay
};
```

### 2. Default Login
```typescript
// Default logged-in user is Admin
currentMockUser = mockUsers[2]; // Admin User

// To test as employee:
import { setCurrentMockUser, mockUsers } from '@/api/mockData';
setCurrentMockUser(mockUsers[0]); // John Doe (employee)
```

### 3. Test Pending Users
```typescript
// Login as admin
setCurrentMockUser(mockUsers[2]);

// View pending users
const { users } = await userManagementAPI.getPendingUsers();
// Result: Alice Brown, Charlie Davis

// Approve Alice
await userManagementAPI.approveUser('5', {
  password: 'Welcome123',
  leaveBalance: 20
});
```

### 4. Test Leave Type Balances
```typescript
// Get leave types
const { leaveTypes } = await leaveTypesAPI.getAll();

// Get user's leaves
const { leaves } = await leavesAPI.getMyLeaves();

// Calculate balance for each type
leaveTypes.forEach(type => {
  const usedDays = leaves
    .filter(l => l.leaveTypeId === type._id && l.status === 'approved' && l.isPaid)
    .reduce((sum, l) => sum + l.daysCount, 0);
  
  const remaining = type.maxPaidDays - usedDays;
  console.log(`${type.name}: ${remaining}/${type.maxPaidDays} days`);
});
```

## 📊 Data Relationships

```
User
├── department → Department (string)
├── approvalStatus → 'pending' | 'approved' | 'rejected'
├── approvedBy → User (admin)
└── leaves → Leave[]

Leave
├── userId → User
├── leaveTypeId → LeaveType
├── isPaid → boolean
├── priority → 'normal' | 'high'
└── reviewedBy → User (admin)

LeaveType
├── name → string
├── maxPaidDays → number
├── colorCode → string (hex)
└── isActive → boolean
```

## ✨ Key Features

### Mock Data Features:
✅ 7 diverse users across 5 departments
✅ 2 pending users for testing approval flow
✅ 1 rejected user for testing rejection flow
✅ 8 leaves with various statuses and types
✅ 5 leave types with different colors
✅ Realistic date ranges (past, present, future)
✅ Department diversity

### Mock API Features:
✅ Full CRUD operations
✅ Admin access control
✅ Filtering and searching
✅ Statistics and analytics
✅ Approval workflow
✅ Balance calculations
✅ Priority system
✅ Simulated network delays
✅ Error handling

## 🎯 Testing Checklist

- [ ] User registration (pending status)
- [ ] Login with pending user (should fail)
- [ ] Admin approval with password
- [ ] Login with approved user (should succeed)
- [ ] Get pending users list
- [ ] Get departments list
- [ ] Filter users by department
- [ ] Get user statistics
- [ ] Get all leave types
- [ ] Create leave with leave type
- [ ] Paid leave balance deduction
- [ ] Unpaid leave (no deduction)
- [ ] Priority leaves (sick/medical)
- [ ] Department-wise leave filtering
- [ ] Leave type balances calculation

## 📝 Summary

**Mock Data:**
- ✅ 7 users (4 approved, 2 pending, 1 rejected)
- ✅ 5 leave types (with colors and limits)
- ✅ 8 leaves (various statuses and types)
- ✅ 5 departments

**Mock APIs:**
- ✅ Leave Types API (5 methods)
- ✅ User Management API (8 methods)
- ✅ Updated Auth API (approval checks)
- ✅ Updated Leaves API (paid/unpaid, priority)

**Integration:**
- ✅ Seamless switching between mock and real APIs
- ✅ All new components supported
- ✅ All new features testable

---

**Everything is ready for frontend testing! Switch `USE_MOCK_API: true` to test all new features without backend.** 🎉
