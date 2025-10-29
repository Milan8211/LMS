<template>
  <div>
    <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">Leave Balance by Type</h3>
    
    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]">
        <a-col :span="24" v-if="balances.length === 0 && !loading">
          <a-empty description="No leave types available" />
        </a-col>
        
        <a-col :xs="24" :sm="12" :md="8" v-for="balance in balances" :key="balance.leaveTypeId">
          <div :style="{
            padding: '16px',
            border: `2px solid ${balance.colorCode}`,
            borderRadius: '8px',
            background: `${balance.colorCode}10`,
          }">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span :style="{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: balance.colorCode
              }">
                {{ balance.leaveTypeName }}
              </span>
              <div :style="{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: balance.colorCode,
              }"></div>
            </div>
            
            <div style="margin-bottom: 8px;">
              <div style="font-size: 24px; font-weight: 'bold'; color: #262626;">
                {{ balance.remainingDays }} / {{ balance.maxPaidDays }}
              </div>
              <div style="font-size: 12px; color: #8c8c8c;">
                days remaining
              </div>
            </div>
            
            <a-progress 
              :percent="getPercentage(balance)" 
              :stroke-color="balance.colorCode"
              :show-info="false"
              :size="'small'"
            />
            
            <div style="margin-top: 8px; font-size: 12px; color: #595959;">
              Used: {{ balance.usedDays }} days
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { leaveTypesAPI } from '@/api/leaveTypes';
import { leavesAPI } from '@/api/leaves';
import type { LeaveTypeConfig, Leave, LeaveTypeBalance } from '@/types';

const loading = ref(false);
const balances = ref<LeaveTypeBalance[]>([]);

const getPercentage = (balance: LeaveTypeBalance) => {
  if (balance.maxPaidDays === 0) return 0;
  return Math.round((balance.remainingDays / balance.maxPaidDays) * 100);
};

const fetchLeaveBalances = async () => {
  loading.value = true;
  try {
    // Fetch all leave types
    const leaveTypesResponse = await leaveTypesAPI.getAll();
    const leaveTypes: LeaveTypeConfig[] = leaveTypesResponse.leaveTypes;
    
    // Fetch user's leaves
    const leavesResponse = await leavesAPI.getMyLeaves();
    const myLeaves: Leave[] = leavesResponse.leaves;
    
    // Calculate balances for each leave type
    const calculatedBalances: LeaveTypeBalance[] = leaveTypes.map((leaveType) => {
      // Find all approved paid leaves of this type
      const approvedPaidLeaves = myLeaves.filter(
        (leave) => 
          leave.leaveTypeId === leaveType._id &&
          leave.status === 'approved' &&
          leave.isPaid === true
      );
      
      // Calculate used days
      const usedDays = approvedPaidLeaves.reduce((sum, leave) => sum + leave.daysCount, 0);
      const remainingDays = Math.max(0, leaveType.maxPaidDays - usedDays);
      
      return {
        leaveTypeId: leaveType._id,
        leaveTypeName: leaveType.name,
        maxPaidDays: leaveType.maxPaidDays,
        usedDays,
        remainingDays,
        colorCode: leaveType.colorCode,
      };
    });
    
    balances.value = calculatedBalances;
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to fetch leave balances');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLeaveBalances();
});

// Expose refresh method for parent components
defineExpose({
  refresh: fetchLeaveBalances,
});
</script>

<style scoped>
.ant-progress {
  margin-bottom: 0;
}
</style>
