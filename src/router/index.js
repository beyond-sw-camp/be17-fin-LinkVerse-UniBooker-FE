import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 고객 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/user/home',
      name: 'userLogin',
      component: () => import('@/views/user/UserLoginView.vue'),
    },
    {
      path: '/user/signup',
      name: 'userSignup',
      component: () => import('@/views/user/UserSignupView.vue'),
    },
    {
      path: '/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/user/ReservationCompletedView.vue'),
    },
    {
      // 서비스(리소스 그룹) 목록 페이지
      path: '/service/list',
      name: 'ServiceList',
      component: () => import('@/views/user/ServiceListView.vue'),
    },
    {
      // 서비스 항목(리소스) 목록 페이지
      path: '/service-item/list',
      name: 'ServiceItemList',
      component: () => import('@/views/user/ServiceItemListView.vue'),
    },
    {
      // 사용자 예약/신청 이력
      path: '/myReservation',
      name: 'myReservation',
      component: () => import('@/views/user/UserMyReservation.vue'),
    },
    {
      // 사용자 예약/신청 이력 상세 페이지
      path: '/myReservation/:id',
      name: 'myReservationDetail',
      component: () => import('@/views/user/UserMyReservationDetail.vue'),
      props: true,
    },



    

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 기업 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/admin/AdminSignupView.vue'),
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/admin/AdminLoginView.vue'),
    },
    {
      path: '/admin/home',
      name: 'adminHonme',
      component: () => import('@/views/admin/AdminLandingView.vue'),
    },
    {
      path: '/admin/service',
      name: 'serviceIntro',
      component: () => import('../views/admin/ServiceIntroView.vue'),
    },
    {
      path: '/admin/manager-management',
      name: 'ManagerManagement',
      component: () => import('../views/admin/ManagerManagement.vue'),
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 플랫폼 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  ],
})

export default router
