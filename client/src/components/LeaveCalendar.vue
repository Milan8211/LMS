<template>
  <div class="calendar-container">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Leave } from '@/types';

interface Props {
  leaves: Leave[];
  onEventClick?: (leave: Leave) => void;
}

const props = defineProps<Props>();

// Convert leaves to calendar events
const events = computed(() => {
  return props.leaves.map((leave) => {
    // Determine color based on status and leave type
    let color = '#1677ff'; // Default blue
    
    if (leave.status === 'approved') {
      color = '#52c41a'; // Green for approved
    } else if (leave.status === 'rejected') {
      color = '#ff4d4f'; // Red for rejected
    } else if (leave.status === 'pending') {
      color = '#faad14'; // Orange for pending
    }
    
    // Get employee name
    const employeeName = typeof leave.userId === 'object' ? leave.userId.name : 'Employee';
    
    // Create title with leave type and employee name
    const leaveTypeLabel = leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1);
    const title = `${leaveTypeLabel} - ${employeeName}`;
    
    return {
      id: leave._id,
      title,
      start: leave.startDate,
      end: leave.endDate,
      color,
      extendedProps: {
        leave,
      },
    };
  });
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  },
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: events.value,
  eventClick: (info: any) => {
    if (props.onEventClick) {
      props.onEventClick(info.event.extendedProps.leave);
    }
  },
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
  },
  height: 'auto',
}));
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.fc) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

:deep(.fc-toolbar-title) {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

:deep(.fc-button) {
  background-color: #1677ff;
  border-color: #1677ff;
  text-transform: capitalize;
  font-weight: 500;
}

:deep(.fc-button:hover) {
  background-color: #4096ff;
  border-color: #4096ff;
}

:deep(.fc-button-active) {
  background-color: #0958d9 !important;
  border-color: #0958d9 !important;
}

:deep(.fc-daygrid-day-number) {
  color: #262626;
  font-weight: 500;
}

:deep(.fc-col-header-cell-cushion) {
  color: #8c8c8c;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
}

:deep(.fc-event) {
  cursor: pointer;
  border: none;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: 500;
}

:deep(.fc-event:hover) {
  opacity: 0.85;
}

:deep(.fc-daygrid-day-top) {
  justify-content: center;
}

:deep(.fc-day-today) {
  background-color: #e6f4ff !important;
}
</style>
