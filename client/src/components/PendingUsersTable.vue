<template>
  <div>
    <h2 style="margin-bottom: 16px; font-size: 20px; font-weight: 600;">Pending User Approvals</h2>
    
    <a-table 
      :columns="columns" 
      :data-source="pendingUsers" 
      :loading="loading"
      :pagination="{ pageSize: 10 }"
      row-key="_id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="primary" size="small" @click="showApproveModal(record)">
              <template #icon><CheckOutlined /></template>
              Approve
            </a-button>
            <a-button danger size="small" @click="handleReject(record.id)">
              <template #icon><CloseOutlined /></template>
              Reject
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    
    <!-- Approve Modal -->
    <a-modal 
      v-model:visible="approveModalVisible" 
      title="Approve User"
      @ok="handleApprove"
      :confirm-loading="approving"
    >
      <div v-if="selectedUser">
        <p><strong>Name:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Department:</strong> {{ selectedUser.department }}</p>
        
        <a-divider />
        
        <a-form layout="vertical">
          <a-form-item label="Assign Password" required>
            <a-input-password 
              v-model:value="assignPassword" 
              placeholder="Enter initial password for user"
              :min-length="6"
            />
            <div style="margin-top: 4px; font-size: 12px; color: #8c8c8c;">
              Minimum 6 characters. User will use this to login.
            </div>
          </a-form-item>
          
          <a-form-item label="Leave Balance (Days)">
            <a-input-number 
              v-model:value="leaveBalance" 
              :min="0" 
              :max="365"
              style="width: 100%;"
            />
            <div style="margin-top: 4px; font-size: 12px; color: #8c8c8c;">
              Default: 20 days
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { userManagementAPI } from '@/api/userManagement';
import type { User } from '@/types';
import dayjs from 'dayjs';

const pendingUsers = ref<User[]>([]);
const loading = ref(false);
const approveModalVisible = ref(false);
const selectedUser = ref<User | null>(null);
const assignPassword = ref('');
const leaveBalance = ref(20);
const approving = ref(false);

const columns = [
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
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: 'Requested On',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
  },
];

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY');
};

const fetchPendingUsers = async () => {
  loading.value = true;
  try {
    const response = await userManagementAPI.getPendingUsers();
    pendingUsers.value = response.users;
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to fetch pending users');
  } finally {
    loading.value = false;
  }
};

const showApproveModal = (user: User) => {
  selectedUser.value = user;
  assignPassword.value = '';
  leaveBalance.value = 20;
  approveModalVisible.value = true;
};

const handleApprove = async () => {
  if (!selectedUser.value) return;
  
  if (!assignPassword.value || assignPassword.value.length < 6) {
    message.error('Password must be at least 6 characters');
    return;
  }
  
  approving.value = true;
  try {
    await userManagementAPI.approveUser(selectedUser.value.id, {
      password: assignPassword.value,
      leaveBalance: leaveBalance.value,
    });
    
    message.success(`${selectedUser.value.name} has been approved successfully`);
    approveModalVisible.value = false;
    selectedUser.value = null;
    assignPassword.value = '';
    
    // Refresh the list
    await fetchPendingUsers();
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to approve user');
  } finally {
    approving.value = false;
  }
};

const handleReject = async (userId: string) => {
  try {
    await userManagementAPI.rejectUser(userId);
    message.success('User has been rejected');
    
    // Refresh the list
    await fetchPendingUsers();
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to reject user');
  }
};

onMounted(() => {
  fetchPendingUsers();
});
</script>

<style scoped>
.ant-table {
  background: white;
  border-radius: 8px;
}
</style>
