import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 고객 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/c/:companySlug',
      name: 'UserLanding',
      component: () => import('@/views/user/UserLoginView.vue'),
      meta: { layout: 'user' }
    },
    {
      path: '/c/:companySlug/signup',
      name: 'UserSignup',
      component: () => import('@/views/user/UserSignupView.vue'),
      meta: { layout: 'user' }
    },
    {
      path: '/c/:companySlug/user/mypage',
      name: 'userMypage',
      component: () => import('@/views/user/UserMypageView.vue'),
      meta: { layout: 'user', requiresAuth: true }
    },
    {
      path: '/c/:companySlug/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/user/ReservationCompletedView.vue'),
      meta: { layout: 'user' }
    },
    {
      path: '/c/:companySlug/service/list',
      name: 'ServiceList',
      component: () => import('@/views/user/ServiceListView.vue'),
      meta: { layout: 'user' }
    },
    {
      path: '/c/:companySlug/service-item/list',
      name: 'ServiceItemList',
      component: () => import('@/views/user/ServiceItemListView.vue'),
      meta: { layout: 'user' }
    },
    {
      path: '/c/:companySlug/myReservation',
      name: 'myReservation',
      component: () => import('@/views/user/UserMyReservation.vue'),
      meta: { layout: 'user', requiresAuth: true }
    },
    {
      path: '/c/:companySlug/myReservation/:id',
      name: 'myReservationDetail',
      component: () => import('@/views/user/UserMyReservationDetail.vue'),
      props: true,
      meta: { layout: 'user', requiresAuth: true }
    },
    {
      path: '/c/:companySlug/notification',
      name: 'UserNotification',
      component: () => import('@/views/user/UserNotificationView.vue'),
      meta: { layout: 'user', requiresAuth: true }
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
      path: '/admin/signup_status',
      name: 'adminStatus',
      component: () => import('@/views/admin/AdminSignupStatusView.vue'),
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
    {
      path: '/admin/notification',
      name: 'AdminNotification',
      component: () => import('@/views/admin/AdminNotificationView.vue'),
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
      path: '/super/companies',
      name: 'superCompanyList',
      component: () => import('@/views/super/CompanyListView.vue'),
    },
    {
      path: '/super/companies/:companyName',
      name: 'CompanyDetail',
      component: () => import('@/views/super/CompanyDetailView.vue'),
      props: true,
    },
    {
      path: '/super/companies/:companyName/managers',
      name: 'ManagerList',
      component: () => import('@/views/super/ManagerListView.vue'),
      props: true,
    },
    {
      path: '/super/companies/:companyName/services',
      name: 'ServiceGroupList',
      component: () => import('@/views/super/ServiceGroupListView.vue'),
      props: true,
    },
    {
      path: '/super/companies/:companyName/services/:serviceGroupName',
      name: 'ServiceGroupDetail',
      component: () => import('@/views/super/ServiceGroupDetailView.vue'),
      props: true,
    },
    {
      path: '/super/applications',
      name: 'superApplicationList',
      component: () => import('@/views/super/ApplicationListView.vue'),
      props: true,
    },
    {
      path: '/super/applications/:companyId/details',
      name: 'superApplicationDetails',
      component: () => import('@/views/super/ApplicationDetailView.vue'),
      props: true,
    },
    {
      path: '/super/notification',
      name: 'SuperNotification',
      component: () => import('@/views/super/SuperNotificationView.vue'),
    },
  ],
})

/**
 * 전역 네비게이션 가드
 * - 로그인 상태에서 랜딩 페이지 접근 시 서비스 목록으로 리다이렉트
 * - 회사별 페이지 접근 시 companySlug 검증
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const currentSlug = to.params.companySlug

  // 1. 로그인 상태에서 랜딩 페이지 접근 시 서비스 목록으로 리다이렉트
  if (to.name === 'UserLanding' && authStore.isLoggedIn && currentSlug === authStore.companySlug) {
    return next(`/c/${currentSlug}/service/list`)
  }

  // 2. company 페이지인 경우 companySlug 검증
  if (currentSlug) {
    const isValid = authStore.validateCompanyContext(currentSlug)
    
    if (!isValid) {
      return next(`/c/${currentSlug}`)
    }
  }

  next()
})

export default router