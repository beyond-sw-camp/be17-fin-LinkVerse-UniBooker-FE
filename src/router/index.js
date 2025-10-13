import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/AdminSignupView.vue')
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/AdminLoginView.vue')
    },
    {
      path: '/admin/home',
      name: 'adminHonme',
      component: () => import('@/views/AdminLandingView.vue')
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('@/views/UserLoginView.vue')
    },
    {
      path: '/user/signup',
      name: 'userSignup',
      component: () => import('@/views/UserSignupView.vue')
    },
    { // 예약 완료 페이지
      path: '/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/ReservationCompletedView.vue')
    }
  ]
})

export default router