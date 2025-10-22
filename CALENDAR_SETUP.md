# 📅 Calendar Feature - Quick Setup

## ✅ What Was Added

A beautiful, interactive calendar view has been added to visualize leave requests using **FullCalendar**.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

### 2. Start the Application

```bash
npm run dev
```

### 3. View the Calendar

- **Employee Dashboard**: http://localhost:5173
  - Login: john@lms.com (any password in mock mode)
  - See your personal leave calendar

- **Admin Dashboard**: http://localhost:5173/admin/dashboard
  - Login: admin@lms.com (any password in mock mode)
  - See team-wide leave calendar

## 🎨 Features

### Visual Calendar
- ✅ Month and week views
- ✅ Color-coded by status:
  - 🟠 **Orange** = Pending
  - 🟢 **Green** = Approved
  - 🔴 **Red** = Rejected

### Interactive
- ✅ Click any event to see details
- ✅ Navigate between months
- ✅ Switch between month/week views
- ✅ Responsive design

### Employee View
- See only your own leaves
- Click events for quick details
- Visual planning aid

### Admin View
- See all team members' leaves
- Employee names on each event
- Click to open full details modal
- Approve/reject from modal

## 📦 What Was Changed

### New Files
1. **`client/src/components/LeaveCalendar.vue`** - Reusable calendar component
2. **`CALENDAR_FEATURE.md`** - Complete documentation
3. **`CALENDAR_SETUP.md`** - This file

### Updated Files
1. **`client/package.json`** - Added FullCalendar dependencies
2. **`client/src/pages/Dashboard.vue`** - Added calendar to employee dashboard
3. **`client/src/pages/AdminDashboard.vue`** - Added calendar to admin dashboard
4. **`client/src/api/mockData.ts`** - Added more mock leaves for better visualization

## 🎯 Dependencies Added

```json
{
  "@fullcalendar/vue3": "^6.1.10",
  "@fullcalendar/core": "^6.1.10",
  "@fullcalendar/daygrid": "^6.1.10",
  "@fullcalendar/timegrid": "^6.1.10",
  "@fullcalendar/interaction": "^6.1.10"
}
```

## 💡 Usage Example

### In Your Component

```vue
<template>
  <LeaveCalendar 
    :leaves="leaveStore.leaves" 
    :on-event-click="handleEventClick" 
  />
</template>

<script setup lang="ts">
import LeaveCalendar from '@/components/LeaveCalendar.vue';
import { useLeaveStore } from '@/store/leaveStore';

const leaveStore = useLeaveStore();

const handleEventClick = (leave) => {
  console.log('Clicked leave:', leave);
};
</script>
```

## 🎨 Calendar Layout

### Employee Dashboard
```
┌─────────────────────────────────┐
│  Stats Cards (4 cards)          │
├─────────────────────────────────┤
│  📅 Leave Calendar               │
│  [Interactive FullCalendar]     │
├─────────────────────────────────┤
│  Quick Actions                   │
├─────────────────────────────────┤
│  Recent Leave Requests Table     │
└─────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────┐
│  Stats Cards (4 cards)          │
├─────────────────────────────────┤
│  📅 Team Leave Calendar          │
│  [Interactive FullCalendar]     │
├─────────────────────────────────┤
│  All Leave Requests Table        │
│  (with approve/reject actions)   │
└─────────────────────────────────┘
```

## 🔍 Mock Data

The calendar now shows 6 leave entries:
- **John Doe**: 3 leaves (1 pending, 1 approved, 1 rejected)
- **Jane Smith**: 2 leaves (1 pending, 1 approved)
- **Past, Present, Future**: Distributed across 3 weeks

## 📱 Responsive Design

The calendar automatically adapts to:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop screens

## 🎯 Next Steps

1. **Install dependencies** (if not already done)
   ```bash
   cd client && npm install
   ```

2. **Start the app**
   ```bash
   npm run dev
   ```

3. **Login and explore**
   - Employee view: john@lms.com
   - Admin view: admin@lms.com

4. **Click on calendar events** to see details

5. **Switch between views** using the month/week toggle

## 📚 Documentation

- **`CALENDAR_FEATURE.md`** - Complete feature documentation
- **`FRONTEND_ONLY_GUIDE.md`** - Frontend development guide
- **`README.md`** - Full project documentation

## ✨ Benefits

### Better UX
- Visual representation of leaves
- Easier to plan time off
- Spot conflicts quickly
- Intuitive interface

### Better Management
- Team overview at a glance
- Resource planning
- Quick access to details
- Professional appearance

---

**The calendar is ready to use! Start the app and explore! 📅🎉**

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
npm run dev
```
