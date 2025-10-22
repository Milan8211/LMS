<template>
  <AppLayout>
    <h1 :style="{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }">Admin Dashboard - All Leave Requests</h1>

    <!-- Stats Cards -->
    <a-row :gutter="[16, 16]" style="margin-bottom: 24px">
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
          <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Total Requests</div>
          <div :style="{ fontSize: '30px', fontWeight: '600' }">{{ leaveStore.stats?.total || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
          <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Pending</div>
          <div :style="{ fontSize: '30px', fontWeight: '600', color: '#faad14' }">{{ leaveStore.stats?.pending || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
          <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Approved</div>
          <div :style="{ fontSize: '30px', fontWeight: '600', color: '#52c41a' }">{{ leaveStore.stats?.approved || 0 }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div :style="{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
          <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Rejected</div>
          <div :style="{ fontSize: '30px', fontWeight: '600', color: '#ff4d4f' }">{{ leaveStore.stats?.rejected || 0 }}</div>
        </div>
      </a-col>
    </a-row>

    <!-- Leave Calendar -->
    <div :style="{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }">
      <h2 style="margin-bottom: 16px">Team Leave Calendar</h2>
      <LeaveCalendar :leaves="leaveStore.leaves" :on-event-click="handleCalendarEventClick" />
    </div>

    <!-- All Leave Requests Table -->
    <div :style="{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '24px' }">
      <div style="margin-bottom: 16px">
        <a-space>
          <a-select
            v-model:value="filterStatus"
            style="width: 200px"
            @change="handleFilterChange"
          >
            <a-select-option value="">All Status</a-select-option>
            <a-select-option value="pending">Pending</a-select-option>
            <a-select-option value="approved">Approved</a-select-option>
            <a-select-option value="rejected">Rejected</a-select-option>
          </a-select>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="leaveStore.leaves"
        :loading="leaveStore.loading"
        row-key="_id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'employee'">
            <div>
              <div style="font-weight: 500">{{ getEmployeeName(record) }}</div>
              <div style="font-size: 12px; color: #8c8c8c">{{ getEmployeeEmail(record) }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'dates'">
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
          <template v-else-if="column.key === 'balance'">
            {{ getEmployeeBalance(record) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button
                type="link"
                size="small"
                @click="showDetails(record)"
              >
                View
              </a-button>
              <a-button
                v-if="record.status === 'pending'"
                type="primary"
                size="small"
                @click="showReviewModal(record, 'approved')"
              >
                Approve
              </a-button>
              <a-button
                v-if="record.status === 'pending'"
                danger
                size="small"
                @click="showReviewModal(record, 'rejected')"
              >
                Reject
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Details Modal -->
    <a-modal
      v-model:open="detailsVisible"
      title="Leave Request Details"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedLeave">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="Employee">
            {{ getEmployeeName(selectedLeave) }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ getEmployeeEmail(selectedLeave) }}
          </a-descriptions-item>
          <a-descriptions-item label="Leave Balance">
            {{ getEmployeeBalance(selectedLeave) }} days
          </a-descriptions-item>
          <a-descriptions-item label="Leave Type">
            <a-tag>{{ selectedLeave.leaveType.toUpperCase() }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Start Date">
            {{ formatDate(selectedLeave.startDate) }}
          </a-descriptions-item>
          <a-descriptions-item label="End Date">
            {{ formatDate(selectedLeave.endDate) }}
          </a-descriptions-item>
          <a-descriptions-item label="Days Count">
            {{ selectedLeave.daysCount }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(selectedLeave.status)">
              {{ selectedLeave.status.toUpperCase() }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Reason">
            {{ selectedLeave.reason }}
          </a-descriptions-item>
          <a-descriptions-item label="Applied On">
            {{ formatDate(selectedLeave.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedLeave.reviewedAt" label="Reviewed On">
            {{ formatDate(selectedLeave.reviewedAt) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedLeave.reviewComment" label="Review Comment">
            {{ selectedLeave.reviewComment }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- Review Modal -->
    <a-modal
      v-model:open="reviewVisible"
      :title="`${reviewAction === 'approved' ? 'Approve' : 'Reject'} Leave Request`"
      @ok="handleReview"
      :confirm-loading="leaveStore.loading"
    >
      <a-form layout="vertical">
        <a-form-item label="Comment (Optional)">
          <a-textarea
            v-model:value="reviewComment"
            :rows="4"
            placeholder="Add a comment for the employee"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLeaveStore } from '@/store/leaveStore';
import AppLayout from '@/components/AppLayout.vue';
import LeaveCalendar from '@/components/LeaveCalendar.vue';
import { message } from 'ant-design-vue';
// Styles are inline
import { Leave, User } from '@/types';
import dayjs from 'dayjs';

const leaveStore = useLeaveStore();
const filterStatus = ref('');
const detailsVisible = ref(false);
const reviewVisible = ref(false);
const selectedLeave = ref<Leave | null>(null);
const reviewAction = ref<'approved' | 'rejected'>('approved');
const reviewComment = ref('');

const columns = [
  { title: 'Employee', key: 'employee', width: 200 },
  { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType', width: 120 },
  { title: 'Dates', key: 'dates', width: 200 },
  { title: 'Days', dataIndex: 'daysCount', key: 'daysCount', width: 80 },
  { title: 'Balance', key: 'balance', width: 100 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
  { title: 'Applied On', dataIndex: 'createdAt', key: 'createdAt', width: 150, customRender: ({ text }: any) => formatDate(text) },
  { title: 'Actions', key: 'actions', width: 200, fixed: 'right' },
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

const getEmployeeName = (leave: Leave) => {
  return typeof leave.userId === 'object' ? leave.userId.name : 'N/A';
};

const getEmployeeEmail = (leave: Leave) => {
  return typeof leave.userId === 'object' ? leave.userId.email : 'N/A';
};

const getEmployeeBalance = (leave: Leave) => {
  return typeof leave.userId === 'object' ? leave.userId.leaveBalance : 'N/A';
};

const handleFilterChange = () => {
  leaveStore.fetchAllLeaves(filterStatus.value || undefined);
};

const showDetails = (leave: Leave) => {
  selectedLeave.value = leave;
  detailsVisible.value = true;
};

const showReviewModal = (leave: Leave, action: 'approved' | 'rejected') => {
  selectedLeave.value = leave;
  reviewAction.value = action;
  reviewComment.value = '';
  reviewVisible.value = true;
};

const handleReview = async () => {
  if (!selectedLeave.value) return;

  const success = await leaveStore.reviewLeave(selectedLeave.value._id, {
    status: reviewAction.value,
    reviewComment: reviewComment.value || undefined,
  });

  if (success) {
    reviewVisible.value = false;
    await leaveStore.fetchStats();
  }
};

const handleCalendarEventClick = (leave: Leave) => {
  showDetails(leave);
};

onMounted(async () => {
  await leaveStore.fetchAllLeaves();
  await leaveStore.fetchStats();
});
</script>
