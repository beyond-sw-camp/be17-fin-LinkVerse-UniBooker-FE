import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 고객 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/c/:companySlug/login',
      name: 'UserLogin',
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
      path: '/c/:companySlug/mypage',
      name: 'userMypage',
      component: () => import('@/views/UserMypageView.vue'),
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
 * Navigation Guard: 인증 필요 페이지 접근 제어 (User 전용)
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 로그인 필요 페이지 체크
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    if (to.path.startsWith('/c/')) {
      const companySlug = to.params.companySlug || 'default'
      next(`/c/${companySlug}/login`)
    } else {
      next()
    }
    return
  }
  
  // ===== 추가: 기업별 로그인 검증 =====
  // 사용자 페이지이고 로그인 상태일 때
  if (to.path.startsWith('/c/') && authStore.isLoggedIn) {
    const urlCompanySlug = to.params.companySlug
    const loginCompanySlug = authStore.companySlug
    
    // 로그인한 기업과 다른 기업 페이지 접속 시도
    if (urlCompanySlug && loginCompanySlug && urlCompanySlug !== loginCompanySlug) {
      alert('다른 기업의 페이지입니다. 로그아웃됩니다.')
      authStore.logout()
      next(`/c/${urlCompanySlug}/login`)
      return
    }
  }
  
  next()
})

export default router