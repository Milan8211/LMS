<template>
  <div :style="styles.authContainer">
    <div :style="styles.authCard">
      <h1 :style="styles.authTitle">Welcome Back</h1>
      <p :style="styles.authSubtitle">Sign in to your account to continue</p>
      
      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleSubmit"
        layout="vertical"
      >
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

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="userStore.loading"
          >
            Sign In
          </a-button>
        </a-form-item>

        <div style="text-align: center">
          <span style="color: #8c8c8c">Don't have an account? </span>
          <router-link to="/register" style="color: #1890ff">Sign up</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import { styles } from '@/styles/globalStyles';

const router = useRouter();
const userStore = useUserStore();

const formState = reactive({
  email: '',
  password: '',
});

const rules = {
  email: [
    { required: true, message: 'Please input your email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
  password: [
    { required: true, message: 'Please input your password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ],
};

const handleSubmit = async () => {
  const success = await userStore.login(formState);
  if (success) {
    if (userStore.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  }
};
</script>
