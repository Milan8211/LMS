# 📅 Calendar Feature Documentation

## Overview

A visual calendar has been added to both Employee and Admin dashboards using **FullCalendar**, providing an intuitive way to view and manage leave requests.

## ✨ Features

### Employee Dashboard
- **Personal Leave Calendar** - View your own leave requests on a calendar
- **Color-coded Events** - Different colors for pending, approved, and rejected leaves
- **Interactive** - Click on any leave event to see details
- **Month/Week Views** - Switch between monthly and weekly calendar views

### Admin Dashboard
- **Team Leave Calendar** - View all employees' leave requests
- **Complete Overview** - See the entire team's leave schedule at a glance
- **Quick Details** - Click any event to open the full leave details modal
- **Filter Support** - Works with status filters (pending, approved, rejected)

## 🎨 Color Coding

| Status | Color | Hex Code |
|--------|-------|----------|
| **Pending** | Orange | #faad14 |
| **Approved** | Green | #52c41a |
| **Rejected** | Red | #ff4d4f |

## 📦 Installation

### 1. Install Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

This will install:
- `@fullcalendar/vue3` - Vue 3 wrapper
- `@fullcalendar/core` - Core functionality
- `@fullcalendar/daygrid` - Month/day grid view
- `@fullcalendar/timegrid` - Time grid view
- `@fullcalendar/interaction` - User interactions

### 2. Start the Application

```bash
npm run dev
```

## 🔧 Implementation Details

### New Files Created

#### 1. **`client/src/components/LeaveCalendar.vue`**
Reusable calendar component that:
- Accepts leave data as props
- Converts leaves to calendar events
- Handles event clicks
- Provides month/week view toggle
- Styled to match Ant Design theme

#### 2. **Updated `client/package.json`**
Added FullCalendar dependencies

#### 3. **Updated Dashboards**
- `Dashboard.vue` - Employee dashboard with personal calendar
- `AdminDashboard.vue` - Admin dashboard with team calendar

#### 4. **Updated Mock Data**
- `mockData.ts` - Added more leave entries for better calendar visualization

## 💡 Usage

### Employee View

```typescript
// In Dashboard.vue
<LeaveCalendar 
  :leaves="leaveStore.leaves" 
  :on-event-click="handleEventClick" 
/>
```

**What employees see:**
- Their own leave requests only
- Color-coded by status
- Click to view leave details in a message popup

### Admin View

```typescript
// In AdminDashboard.vue
<LeaveCalendar 
  :leaves="leaveStore.leaves" 
  :on-event-click="handleCalendarEventClick" 
/>
```

**What admins see:**
- All employees' leave requests
- Employee names on each event
- Click to open full details modal
- Can approve/reject directly from modal

## 🎯 Calendar Features

### Navigation
- **Prev/Next Buttons** - Navigate between months
- **Today Button** - Jump to current month
- **Month/Week Toggle** - Switch between views

### Event Display
- **Event Title Format**: `[Leave Type] - [Employee Name]`
  - Example: "Annual - John Doe"
- **Multi-day Events** - Spans across multiple days
- **Event Hover** - Slight opacity change on hover

### Interactions
- **Click Event** - Shows leave details
- **Responsive** - Adapts to screen size
- **Auto Height** - Adjusts based on content

## 🎨 Styling

The calendar is styled to match the Ant Design theme:

```css
- Primary Color: #1677ff (blue)
- Success Color: #52c41a (green)
- Warning Color: #faad14 (orange)
- Error Color: #ff4d4f (red)
- Background: #fff (white)
- Border Radius: 12px
- Box Shadow: 0 2px 8px rgba(0,0,0,0.1)
```

## 📊 Mock Data

The mock data now includes 6 leave entries distributed across different dates:

```typescript
- 2 pending leaves (John & Jane)
- 3 approved leaves (John & Jane)
- 1 rejected leave (John)
```

Dates are spread across:
- Past (2 weeks ago)
- Present (today)
- Future (next 3 weeks)

This provides a good visualization of the calendar feature.

## 🔄 How It Works

### Data Flow

1. **Fetch Leaves**
   ```typescript
   await leaveStore.fetchMyLeaves(); // Employee
   await leaveStore.fetchAllLeaves(); // Admin
   ```

2. **Convert to Events**
   ```typescript
   const events = leaves.map(leave => ({
     id: leave._id,
     title: `${leaveType} - ${employeeName}`,
     start: leave.startDate,
     end: leave.endDate,
     color: getColorByStatus(leave.status),
   }));
   ```

3. **Render Calendar**
   ```typescript
   <FullCalendar :options="calendarOptions" />
   ```

4. **Handle Clicks**
   ```typescript
   eventClick: (info) => {
     onEventClick(info.event.extendedProps.leave);
   }
   ```

## 🚀 Benefits

### For Employees
✅ **Visual Overview** - See all leaves at a glance
✅ **Easy Planning** - Identify available dates
✅ **Status Tracking** - Quickly see pending/approved leaves
✅ **Better UX** - More intuitive than table view

### For Admins
✅ **Team Overview** - See entire team's schedule
✅ **Conflict Detection** - Spot overlapping leaves
✅ **Quick Access** - Click to review/approve
✅ **Resource Planning** - Better team management

## 🎯 Future Enhancements

Potential improvements:
- **Drag & Drop** - Reschedule leaves by dragging
- **Public Holidays** - Mark holidays on calendar
- **Team View** - Filter by department/team
- **Export** - Download calendar as PDF/iCal
- **Notifications** - Reminders for upcoming leaves
- **Recurring Leaves** - Support for recurring patterns

## 📝 Example Usage

### Employee Dashboard

```vue
<template>
  <AppLayout>
    <!-- Stats Cards -->
    <StatsCards />
    
    <!-- Leave Calendar -->
    <div class="calendar-section">
      <h2>Leave Calendar</h2>
      <LeaveCalendar 
        :leaves="myLeaves" 
        :on-event-click="showLeaveDetails" 
      />
    </div>
    
    <!-- Recent Requests Table -->
    <RecentLeaves />
  </AppLayout>
</template>
```

### Admin Dashboard

```vue
<template>
  <AppLayout>
    <!-- Stats Cards -->
    <StatsCards />
    
    <!-- Team Leave Calendar -->
    <div class="calendar-section">
      <h2>Team Leave Calendar</h2>
      <LeaveCalendar 
        :leaves="allLeaves" 
        :on-event-click="openDetailsModal" 
      />
    </div>
    
    <!-- All Requests Table -->
    <AllLeaves />
  </AppLayout>
</template>
```

## 🐛 Troubleshooting

### Calendar Not Showing
```bash
# Make sure dependencies are installed
cd client
npm install

# Check if FullCalendar is imported
import FullCalendar from '@fullcalendar/vue3'
```

### Events Not Displaying
```typescript
// Ensure leaves have proper date format
startDate: new Date().toISOString() // ✅ Correct
startDate: "2025-10-23" // ✅ Also works
startDate: new Date() // ❌ Wrong (needs ISO string)
```

### Styling Issues
```vue
<!-- Make sure to import FullCalendar CSS -->
<style>
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
</style>
```

## 📚 Resources

- [FullCalendar Docs](https://fullcalendar.io/docs)
- [Vue 3 Integration](https://fullcalendar.io/docs/vue)
- [Event Object](https://fullcalendar.io/docs/event-object)
- [View API](https://fullcalendar.io/docs/view-api)

## ✅ Summary

The calendar feature provides:
- ✅ Visual leave management
- ✅ Color-coded status indicators
- ✅ Interactive event details
- ✅ Month/week view toggle
- ✅ Responsive design
- ✅ Ant Design theme integration
- ✅ Works with mock data
- ✅ Ready for production

---

**Enjoy the enhanced visual experience! 📅✨**
