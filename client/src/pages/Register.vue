<template>
  <div :style="styles.authContainer">
    <div :style="styles.authCard">
      <h1 :style="styles.authTitle">Create Account</h1>
      <p :style="styles.authSubtitle">Sign up to get started</p>
      
      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleSubmit"
        layout="vertical"
      >
        <a-form-item label="Full Name" name="name">
          <a-input
            v-model:value="formState.name"
            size="large"
            placeholder="Enter your full name"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Email" name="email">
          <a-input
            v-model:value="formState.email"
            size="large"
            placeholder="Enter your email"
          >
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="Enter your password"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="Role" name="role">
          <a-select v-model:value="formState.role" size="large">
            <a-select-option value="employee">Employee</a-select-option>
            <a-select-option value="admin">Admin</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="userStore.loading"
          >
            Sign Up
          </a-button>
        </a-form-item>

        <div style="text-align: center">
          <span style="color: #8c8c8c">Already have an account? </span>
          <router-link to="/login" style="color: #1890ff">Sign in</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import { styles } from '@/styles/globalStyles';

const router = useRouter();
const userStore = useUserStore();

const formState = reactive({
  name: '',
  email: '',
  password: '',
  role: 'employee' as 'employee' | 'admin',
});

const rules = {
  name: [
    { required: true, message: 'Please input your name!' },
    { min: 2, message: 'Name must be at least 2 characters!' },
  ],
  email: [
    { required: true, message: 'Please input your email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
  password: [
    { required: true, message: 'Please input your password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ],
  role: [{ required: true, message: 'Please select a role!' }],
};

const handleSubmit = async () => {
  const success = await userStore.register(formState);
  if (success) {
    if (userStore.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  }
};
</script>
