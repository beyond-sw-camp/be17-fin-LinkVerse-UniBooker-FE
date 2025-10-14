import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/AdminSignupView.vue'),
      component: () => import('@/views/AdminSignupView.vue'),
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/AdminLoginView.vue'),
      component: () => import('@/views/AdminLoginView.vue'),
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('@/views/UserLoginView.vue')
    },
    { // 예약 완료 페이지
      path: '/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/ReservationCompletedView.vue'),
    },
    {
      path: '/super/dashboard',
      name: 'superDashboard',
      component: () => import('@/views/SuperDashboardView.vue'),
    },
    {
      path: '/super/management',
      name: 'superManagement',
      component: () => import('@/views/SuperManagementView.vue'),
    },
  ],
})

export default router
