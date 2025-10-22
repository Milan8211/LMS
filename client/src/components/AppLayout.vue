<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <CalendarOutlined v-if="collapsed" style="font-size: 24px; color: white" />
        <span v-else>LMS</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item v-if="isEmployee" key="/">
          <DashboardOutlined />
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item v-if="isEmployee" key="/apply-leave">
          <FileAddOutlined />
          <span>Apply Leave</span>
        </a-menu-item>
        <a-menu-item v-if="isEmployee" key="/leave-history">
          <HistoryOutlined />
          <span>Leave History</span>
        </a-menu-item>
        <a-menu-item v-if="isAdmin" key="/admin/dashboard">
          <TeamOutlined />
          <span>All Requests</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0; display: flex; justify-content: space-between; align-items: center">
        <MenuUnfoldOutlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <div style="padding-right: 24px; display: flex; align-items: center; gap: 16px">
          <a-badge :count="userStore.user?.leaveBalance || 0" :number-style="{ backgroundColor: '#52c41a' }">
            <CalendarOutlined style="font-size: 20px" />
          </a-badge>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <UserOutlined style="margin-right: 8px" />
              {{ userStore.user?.name }}
              <DownOutlined style="margin-left: 8px" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <UserOutlined />
                  Profile
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  FileAddOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const collapsed = ref(false);
const selectedKeys = ref<string[]>([route.path]);

const isEmployee = computed(() => userStore.isEmployee);
const isAdmin = computed(() => userStore.isAdmin);

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
  }
);

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.ant-dropdown-link {
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
}
</style>
