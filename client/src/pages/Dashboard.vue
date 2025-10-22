<template>
  <AppLayout>
    <h1 :style="{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }">Employee Dashboard</h1>

    <!-- Stats Cards -->
    <a-row :gutter="[16, 16]" style="margin-bottom: 24px">
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }">
          <div :style="{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }">Leave Balance</div>
          <div :style="{ fontSize: '24px', color: '#52c41a' }">{{ leaveStore.stats?.leaveBalance || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }">
          <div :style="{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }">Pending Requests</div>
          <div :style="{ fontSize: '24px', color: '#faad14' }">{{ leaveStore.stats?.pending || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }">
          <div :style="{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }">Approved</div>
          <div :style="{ fontSize: '24px', color: '#1890ff' }">{{ leaveStore.stats?.approved || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }">
          <div :style="{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }">Rejected</div>
          <div :style="{ fontSize: '24px', color: '#ff4d4f' }">{{ leaveStore.stats?.rejected || 0 }}</div>
        </div>
      </a-col>
    </a-row>

    <!-- Leave Calendar -->
    <div :style="styles.card">
      <h2 style="margin-bottom: 16px">Leave Calendar</h2>
      <LeaveCalendar :leaves="leaveStore.leaves" :on-event-click="handleEventClick" />
    </div>

    <!-- Quick Actions -->
    <div :style="styles.card">
      <h2 style="margin-bottom: 16px">Quick Actions</h2>
      <a-space>
        <a-button type="primary" size="large" @click="router.push('/apply-leave')">
          <template #icon><FileAddOutlined /></template>
          Apply for Leave
        </a-button>
        <a-button size="large" @click="router.push('/leave-history')">
          <template #icon><HistoryOutlined /></template>
          View History
        </a-button>
      </a-space>
    </div>

    <!-- Recent Leave Requests -->
    <div :style="styles.card">
      <h2 style="margin-bottom: 16px">Recent Leave Requests</h2>
      <a-table
        :columns="columns"
        :data-source="leaveStore.leaves"
        :loading="leaveStore.loading"
        :pagination="{ pageSize: 5 }"
        row-key="_id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dates'">
            {{ formatDate(record.startDate) }} - {{ formatDate(record.endDate) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'leaveType'">
            <a-tag>{{ record.leaveType.toUpperCase() }}</a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLeaveStore } from '@/store/leaveStore';
import AppLayout from '@/components/AppLayout.vue';
import LeaveCalendar from '@/components/LeaveCalendar.vue';
import { styles } from '@/styles/globalStyles';
import { FileAddOutlined, HistoryOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Leave } from '@/types';
import dayjs from 'dayjs';

const router = useRouter();
const leaveStore = useLeaveStore();

const columns = [
  { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
  { title: 'Dates', key: 'dates' },
  { title: 'Days', dataIndex: 'daysCount', key: 'daysCount' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Applied On', dataIndex: 'createdAt', key: 'createdAt', customRender: ({ text }: any) => formatDate(text) },
];

const formatDate = (date: string) => {
  return dayjs(date).format('MMM DD, YYYY');
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status] || 'default';
};

const handleEventClick = (leave: Leave) => {
  const employeeName = typeof leave.userId === 'object' ? leave.userId.name : 'Employee';
  const statusText = leave.status.charAt(0).toUpperCase() + leave.status.slice(1);
  
  message.info({
    content: `${leave.leaveType.toUpperCase()} Leave - ${employeeName}\nStatus: ${statusText}\nDays: ${leave.daysCount}\nReason: ${leave.reason}`,
    duration: 5,
  });
};

onMounted(async () => {
  await leaveStore.fetchMyLeaves();
  await leaveStore.fetchStats();
});
</script>
