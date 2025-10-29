<template>
  <div>
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">
        {{ department }} Department
      </h2>
      <p style="color: #8c8c8c;">View employees and leave requests for this department</p>
    </div>

    <a-tabs v-model:activeKey="activeTab">
      <!-- Employees Tab -->
      <a-tab-pane key="employees" tab="Employees">
        <a-table 
          :columns="employeeColumns" 
          :data-source="employees" 
          :loading="loadingEmployees"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'approvalStatus'">
              <a-tag :color="getStatusColor(record.approvalStatus)">
                {{ record.approvalStatus.toUpperCase() }}
              </a-tag>
            </template>
            <template v-if="column.key === 'leaveBalance'">
              <span :style="{ color: record.leaveBalance < 5 ? '#ff4d4f' : '#52c41a' }">
                {{ record.leaveBalance }} days
              </span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- Leave Requests Tab -->
      <a-tab-pane key="leaves" tab="Leave Requests">
        <div style="margin-bottom: 16px;">
          <a-space>
            <a-select 
              v-model:value="statusFilter" 
              placeholder="Filter by Status"
              style="width: 150px;"
              @change="fetchLeaves"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="approved">Approved</a-select-option>
              <a-select-option value="rejected">Rejected</a-select-option>
            </a-select>
          </a-space>
        </div>

        <a-table 
          :columns="leaveColumns" 
          :data-source="leaves" 
          :loading="loadingLeaves"
          row-key="_id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'employee'">
              {{ getUserName(record.userId) }}
            </template>
            <template v-if="column.key === 'dates'">
              {{ formatDate(record.startDate) }} - {{ formatDate(record.endDate) }}
            </template>
            <template v-if="column.key === 'priority'">
              <a-tag v-if="record.priority === 'high'" color="red">
                🚨 Priority
              </a-tag>
              <span v-else>Normal</span>
            </template>
            <template v-if="column.key === 'isPaid'">
              <a-tag :color="record.isPaid ? 'blue' : 'default'">
                {{ record.isPaid ? 'Paid' : 'Unpaid' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getLeaveStatusColor(record.status)">
                {{ record.status.toUpperCase() }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { userManagementAPI } from '@/api/userManagement';
import { leavesAPI } from '@/api/leaves';
import type { User, Leave } from '@/types';
import dayjs from 'dayjs';

const props = defineProps<{
  department: string;
}>();

const activeTab = ref('employees');
const employees = ref<User[]>([]);
const leaves = ref<Leave[]>([]);
const loadingEmployees = ref(false);
const loadingLeaves = ref(false);
const statusFilter = ref('');

const employeeColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
  },
  {
    title: 'Leave Balance',
    dataIndex: 'leaveBalance',
    key: 'leaveBalance',
  },
];

const leaveColumns = [
  {
    title: 'Employee',
    key: 'employee',
  },
  {
    title: 'Leave Type',
    dataIndex: 'leaveType',
    key: 'leaveType',
  },
  {
    title: 'Dates',
    key: 'dates',
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

const getLeaveStatusColor = (status: string) => {
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

const fetchEmployees = async () => {
  loadingEmployees.value = true;
  try {
    const response = await userManagementAPI.getUsersByDepartment(props.department);
    employees.value = response.users;
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to fetch employees');
  } finally {
    loadingEmployees.value = false;
  }
};

const fetchLeaves = async () => {
  loadingLeaves.value = true;
  try {
    const response = await leavesAPI.getAllLeaves(statusFilter.value);
    // Filter leaves by department
    const allLeaves = response.leaves;
    leaves.value = allLeaves.filter((leave: Leave) => {
      const user = leave.userId as User;
      return user.department === props.department;
    });
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to fetch leaves');
  } finally {
    loadingLeaves.value = false;
  }
};

onMounted(() => {
  fetchEmployees();
  fetchLeaves();
});
</script>

<style scoped>
.ant-table {
  background: white;
  border-radius: 8px;
}
</style>
