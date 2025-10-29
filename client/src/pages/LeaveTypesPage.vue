<template>
  <AppLayout>
    <div :style="{ padding: '24px' }">
      <div :style="{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
        <h1 :style="{ fontSize: '24px', fontWeight: 'bold', margin: 0 }">Leave Types Management</h1>
        <a-button type="primary" size="large" @click="showCreateModal">
          <template #icon><PlusOutlined /></template>
          Add Leave Type
        </a-button>
      </div>

      <!-- Leave Types Grid -->
      <a-row :gutter="[16, 16]">
        <a-col v-for="leaveType in leaveTypes" :key="leaveType._id" :xs="24" :sm="12" :md="8" :lg="6">
          <a-card
            :hoverable="true"
            :style="{ 
              borderLeft: `4px solid ${leaveType.colorCode}`,
              height: '100%'
            }"
          >
            <template #title>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
                <div :style="{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: leaveType.colorCode 
                }" />
                {{ leaveType.name }}
              </div>
            </template>
            <template #extra>
              <a-dropdown>
                <MoreOutlined :style="{ fontSize: '20px', cursor: 'pointer' }" />
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="editLeaveType(leaveType)">
                      <EditOutlined /> Edit
                    </a-menu-item>
                    <a-menu-item danger @click="deleteLeaveType(leaveType._id)">
                      <DeleteOutlined /> Delete
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>

            <div :style="{ marginBottom: '12px' }">
              <div :style="{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }">Max Paid Days</div>
              <div :style="{ fontSize: '32px', fontWeight: 'bold', color: leaveType.colorCode }">
                {{ leaveType.maxPaidDays }}
              </div>
            </div>

            <a-tag :color="leaveType.isActive ? 'success' : 'default'">
              {{ leaveType.isActive ? 'Active' : 'Inactive' }}
            </a-tag>
          </a-card>
        </a-col>
      </a-row>

      <!-- Create/Edit Modal -->
      <a-modal
        v-model:open="modalVisible"
        :title="editingLeaveType ? 'Edit Leave Type' : 'Create Leave Type'"
        @ok="handleSubmit"
        @cancel="handleCancel"
      >
        <a-form :model="formData" layout="vertical">
          <a-form-item label="Name" required>
            <a-input v-model:value="formData.name" placeholder="e.g., Annual Leave" />
          </a-form-item>

          <a-form-item label="Max Paid Days" required>
            <a-input-number
              v-model:value="formData.maxPaidDays"
              :min="0"
              :max="365"
              :style="{ width: '100%' }"
            />
          </a-form-item>

          <a-form-item label="Color Code" required>
            <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
              <input
                v-model="formData.colorCode"
                type="color"
                :style="{ width: '60px', height: '40px', cursor: 'pointer', border: '1px solid #d9d9d9', borderRadius: '4px' }"
              />
              <a-input v-model:value="formData.colorCode" placeholder="#1890ff" />
            </div>
          </a-form-item>

          <a-form-item label="Status">
            <a-switch v-model:checked="formData.isActive" checked-children="Active" un-checked-children="Inactive" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { leaveTypesAPI } from '@/api/leaveTypes';
import { message, Modal } from 'ant-design-vue';
import type { LeaveTypeConfig } from '@/types';

const leaveTypes = ref<LeaveTypeConfig[]>([]);
const modalVisible = ref(false);
const editingLeaveType = ref<LeaveTypeConfig | null>(null);

const formData = ref({
  name: '',
  maxPaidDays: 0,
  colorCode: '#1890ff',
  isActive: true,
});

const fetchLeaveTypes = async () => {
  try {
    const response = await leaveTypesAPI.getAll();
    leaveTypes.value = response.leaveTypes;
  } catch (error: any) {
    console.error('Failed to fetch leave types:', error);
    message.error(error.message || 'Failed to load leave types');
  }
};

const showCreateModal = () => {
  editingLeaveType.value = null;
  formData.value = {
    name: '',
    maxPaidDays: 0,
    colorCode: '#1890ff',
    isActive: true,
  };
  modalVisible.value = true;
};

const editLeaveType = (leaveType: LeaveTypeConfig) => {
  editingLeaveType.value = leaveType;
  formData.value = {
    name: leaveType.name,
    maxPaidDays: leaveType.maxPaidDays,
    colorCode: leaveType.colorCode,
    isActive: leaveType.isActive,
  };
  modalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    if (!formData.value.name || formData.value.maxPaidDays < 0) {
      message.error('Please fill in all required fields');
      return;
    }

    if (editingLeaveType.value) {
      await leaveTypesAPI.update(editingLeaveType.value._id, formData.value);
      message.success('Leave type updated successfully');
    } else {
      await leaveTypesAPI.create(formData.value);
      message.success('Leave type created successfully');
    }

    modalVisible.value = false;
    fetchLeaveTypes();
  } catch (error: any) {
    console.error('Failed to save leave type:', error);
    message.error(error.message || 'Failed to save leave type');
  }
};

const handleCancel = () => {
  modalVisible.value = false;
  editingLeaveType.value = null;
};

const deleteLeaveType = (id: string) => {
  Modal.confirm({
    title: 'Delete Leave Type',
    content: 'Are you sure you want to delete this leave type? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await leaveTypesAPI.delete(id);
        message.success('Leave type deleted successfully');
        fetchLeaveTypes();
      } catch (error: any) {
        console.error('Failed to delete leave type:', error);
        message.error(error.message || 'Failed to delete leave type');
      }
    },
  });
};

onMounted(() => {
  fetchLeaveTypes();
});
</script>

<style scoped>
.ant-card {
  transition: all 0.3s;
}

.ant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
