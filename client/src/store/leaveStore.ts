import { defineStore } from 'pinia';
import { ref } from 'vue';
import { leavesAPI } from '@/api/leaves';
import { Leave, LeaveRequest, LeaveReview, LeaveStats } from '@/types';
import { message } from 'ant-design-vue';

export const useLeaveStore = defineStore('leave', () => {
  const leaves = ref<Leave[]>([]);
  const currentLeave = ref<Leave | null>(null);
  const stats = ref<LeaveStats | null>(null);
  const loading = ref(false);

  const createLeave = async (data: LeaveRequest) => {
    try {
      loading.value = true;
      const response = await leavesAPI.createLeave(data);
      message.success('Leave request created successfully');
      await fetchMyLeaves();
      return true;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchMyLeaves = async (status?: string) => {
    try {
      loading.value = true;
      const response = await leavesAPI.getMyLeaves(status);
      leaves.value = response.leaves;
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchAllLeaves = async (status?: string, userId?: string) => {
    try {
      loading.value = true;
      const response = await leavesAPI.getAllLeaves(status, userId);
      leaves.value = response.leaves;
    } catch (error) {
      console.error('Error fetching all leaves:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchLeaveById = async (id: string) => {
    try {
      loading.value = true;
      const response = await leavesAPI.getLeaveById(id);
      currentLeave.value = response.leave;
    } catch (error) {
      console.error('Error fetching leave:', error);
    } finally {
      loading.value = false;
    }
  };

  const reviewLeave = async (id: string, data: LeaveReview) => {
    try {
      loading.value = true;
      await leavesAPI.reviewLeave(id, data);
      message.success(`Leave ${data.status} successfully`);
      await fetchAllLeaves();
      return true;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteLeave = async (id: string) => {
    try {
      loading.value = true;
      await leavesAPI.deleteLeave(id);
      message.success('Leave request deleted successfully');
      await fetchMyLeaves();
      return true;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leavesAPI.getLeaveStats();
      stats.value = response.stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return {
    leaves,
    currentLeave,
    stats,
    loading,
    createLeave,
    fetchMyLeaves,
    fetchAllLeaves,
    fetchLeaveById,
    reviewLeave,
    deleteLeave,
    fetchStats,
  };
});
