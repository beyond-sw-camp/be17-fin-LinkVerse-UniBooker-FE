import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/AdminSignupView.vue'),
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/AdminLoginView.vue'),
    },
    {
      path: '/admin/home',
      name: 'adminHonme',
      component: () => import('@/views/AdminLandingView.vue'),
    },
    {
      path: '/admin/service',
      name: 'serviceIntro',
      component: () => import('../views/ServiceIntroView.vue'),
    },
    {
      path: '/admin/manager-management',
      name: 'ManagerManagement',
      component: () => import('../views/ManagerManagement.vue'),
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('@/views/UserLoginView.vue'),
    },
    {
      path: '/user/signup',
      name: 'userSignup',
      component: () => import('@/views/UserSignupView.vue'),
    },
    {
      path: '/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/ReservationCompletedView.vue'),
    },
    {
      // 서비스(리소스 그룹) 목록 페이지
      path: '/service/list',
      name: 'ServiceList',
      component: () => import('@/views/ServiceListView.vue'),
    },
    {
      // 서비스 항목(리소스) 목록 페이지
      path: '/service-item/list',
      name: 'ServiceItemList',
      component: () => import('@/views/ServiceItemListView.vue'),
    },
    {
      path: '/super/dashboard',
      name: 'superDashboard',
      component: () => import('@/views/super/DashboardView.vue'),
    },
    {
      path: '/super/management',
      name: 'superManagement',
      component: () => import('@/views/super/CompanyListView.vue'),
    },
    {
      path: '/super/management/:companyName',
      name: 'CompanyDetail',
      component: () => import('@/views/super/CompanyDetailView.vue'),
      props: true,
    },
    {
      path: '/super/management/:companyName/managers',
      name: 'ManagerList',
      component: () => import('@/views/super/ManagerListView.vue'),
      props: true,
    },
    {
      path: '/super/management/:companyName/services',
      name: 'ServiceGroupList',
      component: () => import('@/views/super/ServiceGroupListView.vue'),
      props: true,
    },
    {
      // 사용자 예약/신청 이력
      path: '/myReservation',
      name: 'myReservation',
      component: () => import('@/views/UserMyReservation.vue'),
    },
  ],
})

export default router
