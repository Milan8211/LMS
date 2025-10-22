<template>
  <AppLayout>
    <h1 :style="{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }">Leave History</h1>

    <div :style="{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
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
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button
                type="link"
                size="small"
                @click="showDetails(record)"
              >
                View
              </a-button>
              <a-popconfirm
                v-if="record.status === 'pending'"
                title="Are you sure you want to delete this request?"
                @confirm="handleDelete(record._id)"
              >
                <a-button type="link" danger size="small">
                  Delete
                </a-button>
              </a-popconfirm>
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
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLeaveStore } from '@/store/leaveStore';
import AppLayout from '@/components/AppLayout.vue';
// Styles are inline
import { Leave } from '@/types';
import dayjs from 'dayjs';

const leaveStore = useLeaveStore();
const filterStatus = ref('');
const detailsVisible = ref(false);
const selectedLeave = ref<Leave | null>(null);

const columns = [
  { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
  { title: 'Dates', key: 'dates' },
  { title: 'Days', dataIndex: 'daysCount', key: 'daysCount' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Applied On', dataIndex: 'createdAt', key: 'createdAt', customRender: ({ text }: any) => formatDate(text) },
  { title: 'Actions', key: 'actions' },
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

const handleFilterChange = () => {
  leaveStore.fetchMyLeaves(filterStatus.value || undefined);
};

const showDetails = (leave: Leave) => {
  selectedLeave.value = leave;
  detailsVisible.value = true;
};

const handleDelete = async (id: string) => {
  await leaveStore.deleteLeave(id);
};

onMounted(() => {
  leaveStore.fetchMyLeaves();
});
</script>
