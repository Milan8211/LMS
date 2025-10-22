# Frontend-Only Development Guide

This guide explains how to work on the frontend **without needing the backend server or MongoDB**.

## 🎯 Quick Start (Frontend Only)

### 1. Install Frontend Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

### 2. Enable Mock API Mode

The mock API is **already enabled by default**. Check the config file:

**File:** `client/src/config/app.config.ts`

```typescript
export const APP_CONFIG = {
  USE_MOCK_API: true,  // ← Set to true for frontend-only development
  API_BASE_URL: '/api',
  MOCK_DELAY: 500,  // Simulates network delay
};
```

### 3. Start Frontend Only

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm run dev
```

The frontend will run on: **http://localhost:5173**

## 🔄 Switching Between Mock and Real API

### Mock API Mode (Frontend Only)
```typescript
// client/src/config/app.config.ts
export const APP_CONFIG = {
  USE_MOCK_API: true,  // ← Frontend works independently
  // ...
};
```

### Real API Mode (With Backend)
```typescript
// client/src/config/app.config.ts
export const APP_CONFIG = {
  USE_MOCK_API: false,  // ← Connects to real backend
  // ...
};
```

## 👤 Mock Users & Data

### Available Test Accounts

| Email | Password | Role | Leave Balance |
|-------|----------|------|---------------|
| john@lms.com | any | Employee | 18 days |
| jane@lms.com | any | Employee | 15 days |
| admin@lms.com | any | Admin | 20 days |

**Note:** In mock mode, any password works!

### Pre-loaded Leave Requests

The mock system comes with sample leave requests:
- 1 pending leave (John)
- 1 approved leave (John)
- 1 rejected leave (John)
- 1 pending leave (Jane)

## 📝 What You Can Do in Mock Mode

### Employee Features
✅ Login/Register (any password works)
✅ View dashboard with stats
✅ Apply for leave
✅ View leave history
✅ Filter leaves by status
✅ Delete pending requests
✅ View leave details

### Admin Features
✅ Login as admin
✅ View all employee leaves
✅ Approve/reject leaves
✅ Add review comments
✅ Filter by status
✅ View employee balances

## 🎨 Developing UI/UX

### Making Changes

1. **Update Components:** Edit files in `client/src/components/`
2. **Update Pages:** Edit files in `client/src/pages/`
3. **Update Styles:** Edit `client/src/styles/globalStyles.ts`
4. **Hot Reload:** Changes appear instantly (Vite HMR)

### Testing Different Scenarios

#### Test as Employee
```typescript
// Login with: john@lms.com (any password)
// You'll see employee dashboard
```

#### Test as Admin
```typescript
// Login with: admin@lms.com (any password)
// You'll see admin dashboard
```

#### Switch Users
Just logout and login with a different email.

## 📂 Mock Data Files

### Main Files

1. **`client/src/config/app.config.ts`**
   - Toggle mock mode on/off
   - Configure mock delay

2. **`client/src/api/mockData.ts`**
   - Mock users
   - Mock leave requests
   - Helper functions

3. **`client/src/api/mockAPI.ts`**
   - Mock API implementations
   - Simulates all backend endpoints

### Customizing Mock Data

#### Add More Users

Edit `client/src/api/mockData.ts`:

```typescript
export const mockUsers: User[] = [
  // ... existing users
  {
    id: '4',
    name: 'New Employee',
    email: 'new@lms.com',
    role: 'employee',
    leaveBalance: 20,
  },
];
```

#### Add More Leave Requests

Edit `client/src/api/mockData.ts`:

```typescript
export const mockLeaves: Leave[] = [
  // ... existing leaves
  {
    _id: '5',
    userId: mockUsers[0],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    leaveType: 'annual',
    reason: 'Vacation',
    status: 'pending',
    daysCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

#### Change Default User

Edit `client/src/api/mockData.ts`:

```typescript
// Change who is logged in by default
export let currentMockUser: User | null = mockUsers[2]; // Admin
// or
export let currentMockUser: User | null = mockUsers[0]; // John (Employee)
```

## 🔧 Debugging

### Check Current Mode

```typescript
// In browser console
console.log(APP_CONFIG.USE_MOCK_API); // Should be true
```

### View Mock Data

```typescript
// In browser console
import { mockUsers, mockLeaves } from '@/api/mockData';
console.log('Users:', mockUsers);
console.log('Leaves:', mockLeaves);
```

### Network Delay

Adjust the simulated network delay:

```typescript
// client/src/config/app.config.ts
export const APP_CONFIG = {
  USE_MOCK_API: true,
  MOCK_DELAY: 1000,  // ← Increase to 1 second
};
```

## 🚀 When Ready for Backend

### 1. Switch to Real API

```typescript
// client/src/config/app.config.ts
export const APP_CONFIG = {
  USE_MOCK_API: false,  // ← Switch to real backend
};
```

### 2. Start Backend

```bash
# Terminal 1 - Backend
cd /Users/milanthapa/Desktop/Projects/LMS/server
npm run dev

# Terminal 2 - Frontend
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm run dev
```

### 3. Seed Real Data

```bash
cd /Users/milanthapa/Desktop/Projects/LMS
npm run seed
```

## 📊 File Structure (Frontend Only)

```
client/
├── src/
│   ├── api/
│   │   ├── axios.ts          # Axios instance
│   │   ├── auth.ts           # Auth API (auto-switches)
│   │   ├── leaves.ts         # Leaves API (auto-switches)
│   │   ├── mockAPI.ts        # 🆕 Mock API implementation
│   │   └── mockData.ts       # 🆕 Mock data
│   ├── config/
│   │   └── app.config.ts     # 🆕 Toggle mock mode here
│   ├── components/
│   ├── pages/
│   ├── router/
│   ├── store/
│   ├── styles/
│   └── types/
└── package.json
```

## ✨ Benefits of Mock Mode

✅ **No Backend Required** - Work on UI/UX independently
✅ **No MongoDB Required** - No database setup needed
✅ **Fast Development** - No API latency
✅ **Easy Testing** - Predictable data
✅ **Offline Work** - No internet needed
✅ **Quick Prototyping** - Test ideas rapidly

## 🎯 Common Workflows

### Workflow 1: UI/UX Design
```bash
1. Enable mock mode (USE_MOCK_API: true)
2. Start frontend only
3. Design and test UI changes
4. No backend needed!
```

### Workflow 2: Full Stack Testing
```bash
1. Disable mock mode (USE_MOCK_API: false)
2. Start MongoDB
3. Start backend
4. Start frontend
5. Test with real API
```

### Workflow 3: Demo/Presentation
```bash
1. Enable mock mode
2. Customize mock data for demo
3. Start frontend only
4. Present without backend dependencies
```

## 📝 Notes

- Mock data persists only in memory (resets on page refresh)
- Mock mode doesn't validate passwords (any password works)
- Mock API simulates 500ms network delay by default
- All CRUD operations work in mock mode
- State management (Pinia) works the same in both modes

## 🆘 Troubleshooting

### Issue: Changes not appearing
**Solution:** Check if Vite dev server is running and HMR is working

### Issue: Mock data not loading
**Solution:** Verify `USE_MOCK_API: true` in `app.config.ts`

### Issue: Login not working
**Solution:** In mock mode, any password works. Check browser console for errors.

### Issue: Want to reset mock data
**Solution:** Refresh the page (mock data resets)

---

**Happy Frontend Development! 🎨**

You can now work on the UI/UX without any backend dependencies!
