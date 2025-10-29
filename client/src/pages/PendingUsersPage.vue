<template>
  <AppLayout>
    <div :style="styles.container">
      <div :style="{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
        <h1 :style="{ fontSize: '24px', fontWeight: 'bold', margin: 0 }">Pending User Approvals</h1>
        <a-badge :count="pendingCount" :number-style="{ backgroundColor: '#faad14' }">
          <UserAddOutlined :style="{ fontSize: '24px' }" />
        </a-badge>
      </div>

      <!-- Info Alert -->
      <a-alert
        v-if="pendingCount > 0"
        :message="`${pendingCount} user${pendingCount > 1 ? 's' : ''} awaiting approval`"
        description="Review and approve new user registrations. You can assign passwords and set initial leave balances."
        type="info"
        show-icon
        closable
        :style="{ marginBottom: '24px' }"
      />

      <!-- Pending Users Table -->
      <div :style="styles.card">
        <PendingUsersTable @approved="handleUserApproved" @rejected="handleUserRejected" />
      </div>

      <!-- Statistics Cards -->
      <a-row :gutter="[16, 16]" :style="{ marginTop: '24px' }">
        <a-col :xs="24" :sm="12" :md="6">
          <div :style="statsCardStyle">
            <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Total Users</div>
            <div :style="{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }">{{ stats.total }}</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <div :style="statsCardStyle">
            <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Pending</div>
            <div :style="{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }">{{ stats.pending }}</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <div :style="statsCardStyle">
            <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Approved</div>
            <div :style="{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }">{{ stats.approved }}</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <div :style="statsCardStyle">
            <div :style="{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }">Rejected</div>
            <div :style="{ fontSize: '28px', fontWeight: 'bold', color: '#ff4d4f' }">{{ stats.rejected }}</div>
          </div>
        </a-col>
      </a-row>

      <!-- Department Distribution -->
      <div :style="{ ...styles.card, marginTop: '24px' }">
        <h2 :style="{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }">Users by Department</h2>
        <a-row :gutter="[16, 16]">
          <a-col v-for="dept in stats.byDepartment" :key="dept._id" :xs="24" :sm="12" :md="8">
            <div :style="deptCardStyle">
              <TeamOutlined :style="{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }" />
              <div :style="{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }">{{ dept._id }}</div>
              <div :style="{ fontSize: '24px', color: '#1890ff' }">{{ dept.count }}</div>
              <div :style="{ fontSize: '12px', color: '#8c8c8c' }">employees</div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import PendingUsersTable from '@/components/PendingUsersTable.vue';
import { styles } from '@/styles/globalStyles';
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons-vue';
import { userManagementAPI } from '@/api/userManagement';
import { message } from 'ant-design-vue';
import type { UserStats } from '@/types';

const stats = ref<UserStats>({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  byDepartment: [],
});

const pendingCount = computed(() => stats.value.pending);

const statsCardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center' as const,
};

const deptCardStyle = {
  padding: '20px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  border: '1px solid #d9d9d9',
  textAlign: 'center' as const,
  transition: 'all 0.3s',
  cursor: 'pointer',
};

const fetchStats = async () => {
  try {
    const response = await userManagementAPI.getUserStats();
    stats.value = response.stats;
  } catch (error: any) {
    console.error('Failed to fetch user stats:', error);
    message.error(error.message || 'Failed to load statistics');
  }
};

const handleUserApproved = () => {
  message.success('User approved successfully');
  fetchStats();
};

const handleUserRejected = () => {
  message.success('User rejected successfully');
  fetchStats();
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.ant-alert {
  border-radius: 8px;
}
</style>
