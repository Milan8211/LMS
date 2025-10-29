<template>
  <AppLayout>
    <div :style="{ padding: '24px' }">
      <!-- Header -->
      <div :style="{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
        <div>
          <a-button type="text" @click="$router.back()" :style="{ marginBottom: '8px' }">
            <template #icon><ArrowLeftOutlined /></template>
            Back
          </a-button>
          <h1 :style="{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }">
            <TeamOutlined />
            {{ department }} Department
          </h1>
        </div>
      </div>

      <!-- Department View Component -->
      <DepartmentView :department="department" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import DepartmentView from '@/components/DepartmentView.vue';
import { ArrowLeftOutlined, TeamOutlined } from '@ant-design/icons-vue';

defineProps<{
  department: string;
}>();
</script>
