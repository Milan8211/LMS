<template>
  <AppLayout>
    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 24px;">Admin Dashboard</h1>
    
    <a-tabs v-model:activeKey="activeTab" type="card" size="large">
      <!-- Tab 1: Pending Approvals -->
      <a-tab-pane key="pending" tab="Pending Approvals">
        <template #tab>
          <span>
            <UserAddOutlined />
            Pending Approvals
            <a-badge :count="pendingCount" :offset="[10, 0]" />
          </span>
        </template>
        <PendingUsersTable @approved="handleUserApproved" />
      </a-tab-pane>

      <!-- Tab 2: Leave Requests -->
      <a-tab-pane key="leaves" tab="Leave Requests">
        <template #tab>
          <span>
            <FileTextOutlined />
            Leave Requests
          </span>
        </template>
        
        <!-- Filters -->
        <div style="margin-bottom: 24px; padding: 16px; background: #fafafa; border-radius: 8px;">
          <a-row :gutter="16">
            <a-col :xs="24" :sm="8">
              <a-select 
                v-model:value="departmentFilter" 
                placeholder="Filter by Department"
                style="width: 100%;"
                @change="fetchLeaves"
              >
                <a-select-option value="">All Departments</a-select-option>
                <a-select-option v-for="dept in departments" :key="dept" :value="dept">
                  {{ dept }}
                </a-select-option>
              </a-select>
            </a-col>
            
            <a-col :xs="24" :sm="8">
              <a-select 
                v-model:value="statusFilter" 
                placeholder="Filter by Status"
                style="width: 100%;"
                @change="fetchLeaves"
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="pending">Pending</a-select-option>
                <a-select-option value="approved">Approved</a-select-option>
                <a-select-option value="rejected">Rejected</a-select-option>
              </a-select>
            </a-col>
            
            <a-col :xs="24" :sm="8">
              <a-checkbox v-model:checked="priorityOnly" @change="fetchLeaves">
                Show Priority Only (Sick/Medical)
              </a-checkbox>
            </a-col>
          </a-row>
        </div>
        
        <!-- Leave Requests Table -->
        <a-table 
          :columns="leaveColumns" 
          :data-source="filteredLeaves" 
          :loading="loadingLeaves"
          row-key="_id"
          :pagination="{ pageSize: 10 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'employee'">
              <div>
                <div style="font-weight: 500;">{{ getUserName(record.userId) }}</div>
                <div style="font-size: 12px; color: #8c8c8c;">
                  {{ getUserDepartment(record.userId) }}
                </div>
              </div>
            </template>
            <template v-if="column.key === 'dates'">
              {{ formatDate(record.startDate) }} - {{ formatDate(record.endDate) }}
            </template>
            <template v-if="column.key === 'priority'">
              <a-tag v-if="record.priority === 'high'" color="red">
                🚨 Priority
              </a-tag>
              <span v-else style="color: #8c8c8c;">Normal</span>
            </template>
            <template v-if="column.key === 'isPaid'">
              <a-tag :color="record.isPaid ? 'blue' : 'default'">
                {{ record.isPaid ? 'Paid' : 'Unpaid' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status.toUpperCase() }}
              </a-tag>
            </template>
            <template v-if="column.key === 'actions'">
              <a-space>
                <a-button 
                  v-if="record.status === 'pending'" 
                  type="primary" 
                  size="small"
                  @click="reviewLeave(record._id, 'approved')"
                >
                  Approve
                </a-button>
                <a-button 
                  v-if="record.status === 'pending'" 
                  danger 
                  size="small"
                  @click="reviewLeave(record._id, 'rejected')"
                >
                  Reject
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- Tab 3: Calendar View -->
      <a-tab-pane key="calendar" tab="Calendar View">
        <template #tab>
          <span>
            <CalendarOutlined />
            Calendar View
          </span>
        </template>
        <div style="padding: 24px; background: white; border-radius: 8px;">
          <LeaveCalendar :leaves="allLeaves" />
        </div>
      </a-tab-pane>

      <!-- Tab 4: Statistics -->
      <a-tab-pane key="stats" tab="Statistics">
        <template #tab>
          <span>
            <BarChartOutlined />
            Statistics
          </span>
        </template>
        
        <!-- User Statistics -->
        <div style="margin-bottom: 24px;">
          <h2 style="margin-bottom: 16px;">User Statistics</h2>
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Total Users" :value="userStats.total" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Pending Approvals" :value="userStats.pending" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Approved Users" :value="userStats.approved" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Rejected Users" :value="userStats.rejected" />
            </a-col>
          </a-row>
        </div>

        <!-- Leave Statistics -->
        <div style="margin-bottom: 24px;">
          <h2 style="margin-bottom: 16px;">Leave Statistics</h2>
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Total Leaves" :value="leaveStats.total" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Pending Leaves" :value="leaveStats.pending" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Approved Leaves" :value="leaveStats.approved" />
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-statistic title="Rejected Leaves" :value="leaveStats.rejected" />
            </a-col>
          </a-row>
        </div>

        <!-- Department Distribution -->
        <div>
          <h2 style="margin-bottom: 16px;">Users by Department</h2>
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="8" v-for="dept in userStats.byDepartment" :key="dept._id">
              <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px;">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
                  {{ dept._id }}
                </div>
                <div style="font-size: 24px; color: #1677ff;">
                  {{ dept.count }} employees
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-tab-pane>
    </a-tabs>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { 
  UserAddOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  BarChartOutlined 
} from '@ant-design/icons-vue';
import AppLayout from '@/components/AppLayout.vue';
import PendingUsersTable from '@/components/PendingUsersTable.vue';
import LeaveCalendar from '@/components/LeaveCalendar.vue';
import { userManagementAPI } from '@/api/userManagement';
import { leavesAPI } from '@/api/leaves';
import type { User, Leave, UserStats, LeaveStats } from '@/types';
import dayjs from 'dayjs';

const activeTab = ref('pending');
const pendingCount = ref(0);
const departments = ref<string[]>([]);
const departmentFilter = ref('');
const statusFilter = ref('');
const priorityOnly = ref(false);
const allLeaves = ref<Leave[]>([]);
const filteredLeaves = ref<Leave[]>([]);
const loadingLeaves = ref(false);

const userStats = ref<UserStats>({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  byDepartment: [],
});

const leaveStats = ref<LeaveStats>({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
});

const leaveColumns = [
  {
    title: 'Employee',
    key: 'employee',
    width: 200,
  },
  {
    title: 'Leave Type',
    dataIndex: 'leaveType',
    key: 'leaveType',
  },
  {
    title: 'Dates',
    key: 'dates',
    width: 200,
  },
  {
    title: 'Days',
    dataIndex: 'daysCount',
    key: 'daysCount',
  },
  {
    title: 'Priority',
    key: 'priority',
  },
  {
    title: 'Type',
    key: 'isPaid',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
  },
];

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY');
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status] || 'default';
};

const getUserName = (userId: User | string) => {
  if (typeof userId === 'string') return userId;
  return userId.name;
};

const getUserDepartment = (userId: User | string) => {
  if (typeof userId === 'string') return '';
  return userId.department;
};

const fetchPendingCount = async () => {
  try {
    const response = await userManagementAPI.getPendingUsers();
    pendingCount.value = response.users.length;
  } catch (error: any) {
    console.error('Failed to fetch pending count:', error);
  }
};

const fetchDepartments = async () => {
  try {
    const response = await userManagementAPI.getDepartments();
    departments.value = response.departments;
  } catch (error: any) {
    message.error('Failed to fetch departments');
  }
};

const fetchLeaves = async () => {
  loadingLeaves.value = true;
  try {
    const response = await leavesAPI.getAllLeaves(statusFilter.value);
    allLeaves.value = response.leaves;
    
    // Apply filters
    let filtered = [...allLeaves.value];
    
    // Department filter
    if (departmentFilter.value) {
      filtered = filtered.filter((leave) => {
        const user = leave.userId as User;
        return user.department === departmentFilter.value;
      });
    }
    
    // Priority filter
    if (priorityOnly.value) {
      filtered = filtered.filter((leave) => leave.priority === 'high');
    }
    
    // Sort by priority (high first) and then by date
    filtered.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    filteredLeaves.value = filtered;
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to fetch leaves');
  } finally {
    loadingLeaves.value = false;
  }
};

const fetchUserStats = async () => {
  try {
    const response = await userManagementAPI.getUserStats();
    userStats.value = response.stats;
  } catch (error: any) {
    console.error('Failed to fetch user stats:', error);
  }
};

const fetchLeaveStats = async () => {
  try {
    const response = await leavesAPI.getLeaveStats();
    leaveStats.value = response.stats;
  } catch (error: any) {
    console.error('Failed to fetch leave stats:', error);
  }
};

const reviewLeave = async (leaveId: string, status: 'approved' | 'rejected') => {
  try {
    await leavesAPI.reviewLeave(leaveId, { status });
    message.success(`Leave ${status} successfully`);
    await fetchLeaves();
    await fetchLeaveStats();
  } catch (error: any) {
    message.error(error.response?.data?.message || `Failed to ${status} leave`);
  }
};

const handleUserApproved = () => {
  fetchPendingCount();
  fetchUserStats();
};

onMounted(() => {
  fetchPendingCount();
  fetchDepartments();
  fetchLeaves();
  fetchUserStats();
  fetchLeaveStats();
});
</script>

<style scoped>
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
  padding: 12px 24px;
  font-weight: 500;
}

.ant-statistic {
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
