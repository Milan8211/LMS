<template>
  <AppLayout>
    <h1 :style="{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }">Apply for Leave</h1>

    <div :style="{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }">
      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleSubmit"
        layout="vertical"
        style="max-width: 600px"
      >
        <a-form-item label="Leave Type" name="leaveType">
          <a-select v-model:value="formState.leaveType" size="large">
            <a-select-option value="sick">Sick Leave</a-select-option>
            <a-select-option value="casual">Casual Leave</a-select-option>
            <a-select-option value="annual">Annual Leave</a-select-option>
            <a-select-option value="unpaid">Unpaid Leave</a-select-option>
          </a-select>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Start Date" name="startDate">
              <a-date-picker
                v-model:value="formState.startDate"
                size="large"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="End Date" name="endDate">
              <a-date-picker
                v-model:value="formState.endDate"
                size="large"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Reason" name="reason">
          <a-textarea
            v-model:value="formState.reason"
            :rows="4"
            placeholder="Please provide a detailed reason for your leave request"
          />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="leaveStore.loading"
            >
              Submit Request
            </a-button>
            <a-button size="large" @click="router.push('/')">
              Cancel
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLeaveStore } from '@/store/leaveStore';
import AppLayout from '@/components/AppLayout.vue';
// Styles are inline
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const router = useRouter();
const leaveStore = useLeaveStore();

const formState = reactive<{
  leaveType: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  reason: string;
}>({
  leaveType: 'sick',
  startDate: null,
  endDate: null,
  reason: '',
});

const rules = {
  leaveType: [{ required: true, message: 'Please select leave type!' }],
  startDate: [{ required: true, message: 'Please select start date!' }],
  endDate: [{ required: true, message: 'Please select end date!' }],
  reason: [
    { required: true, message: 'Please provide a reason!' },
    { min: 10, message: 'Reason must be at least 10 characters!' },
  ],
};

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

const handleSubmit = async () => {
  if (!formState.startDate || !formState.endDate) return;

  const data = {
    leaveType: formState.leaveType as any,
    startDate: formState.startDate.toISOString(),
    endDate: formState.endDate.toISOString(),
    reason: formState.reason,
  };

  const success = await leaveStore.createLeave(data);
  if (success) {
    router.push('/');
  }
};
</script>
