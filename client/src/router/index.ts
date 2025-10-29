import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/userStore';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/apply-leave',
    name: 'ApplyLeave',
    component: () => import('@/pages/ApplyLeave.vue'),
    meta: { requiresAuth: true, role: 'employee' },
  },
  {
    path: '/leave-history',
    name: 'LeaveHistory',
    component: () => import('@/pages/LeaveHistory.vue'),
    meta: { requiresAuth: true, role: 'employee' },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/pages/EnhancedAdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/pending-users',
    name: 'PendingUsers',
    component: () => import('@/pages/PendingUsersPage.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/leave-types',
    name: 'LeaveTypes',
    component: () => import('@/pages/LeaveTypesPage.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/department/:department',
    name: 'DepartmentView',
    component: () => import('@/pages/DepartmentViewPage.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Try to fetch current user if not already loaded
  if (!userStore.user && to.meta.requiresAuth) {
    await userStore.fetchCurrentUser();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.role as string | undefined;

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else if (!requiresAuth && userStore.isAuthenticated) {
    // Redirect authenticated users away from login/register
    if (userStore.isAdmin) {
      next('/admin/dashboard');
    } else {
      next('/');
    }
  } else if (requiredRole && userStore.user?.role !== requiredRole) {
    // Role-based access control
    if (userStore.isAdmin) {
      next('/admin/dashboard');
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
