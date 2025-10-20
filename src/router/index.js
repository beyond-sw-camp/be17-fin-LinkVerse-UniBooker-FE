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
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/signup',
      name: 'UserSignup',
      component: () => import('@/views/user/UserSignupView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/mypage',
      name: 'userMypage',
      component: () => import('@/views/UserMypageView.vue'),
      meta: { layout: 'user', requiresAuth: true },
    },
    {
      path: '/c/:companySlug/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/user/ReservationCompletedView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/service/list',
      name: 'ServiceList',
      component: () => import('@/views/user/ServiceListView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/service-item/list',
      name: 'ServiceItemList',
      component: () => import('@/views/user/ServiceItemListView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/myReservation',
      name: 'myReservation',
      component: () => import('@/views/user/UserMyReservation.vue'),
      meta: { layout: 'user', requiresAuth: true },
    },
    {
      path: '/c/:companySlug/myReservation/:id',
      name: 'myReservationDetail',
      component: () => import('@/views/user/UserMyReservationDetail.vue'),
      props: true,
      meta: { layout: 'user', requiresAuth: true },
    },
    {
      path: '/c/:companySlug/notification',
      name: 'UserNotification',
      component: () => import('@/views/user/UserNotificationView.vue'),
      meta: { layout: 'user', requiresAuth: true },
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
    {
      path: '/admin/notification',
      name: 'AdminNotification',
      component: () => import('@/views/admin/AdminNotificationView.vue'),
    },
    {
      path: '/admin/service-group-create',
      name: 'ServiceGroupCreate',
      component: () => import('../views/admin/ServiceGroupCreate.vue'),
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 플랫폼 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/super',
      name: 'super',
      component: () => import('@/components/SuperLayout.vue'),
      children: [
        // 대시보드 페이지: 전체 현황, 통계, 알림 등 요약 화면
        {
          path: 'dashboard',
          name: 'superDashboard',
          component: () => import('@/views/super/DashboardView.vue'),
        },

        // 기업 목록 페이지
        {
          path: 'companies',
          name: 'superCompanyList',
          component: () => import('@/views/super/CompanyListView.vue'),
        },

        // 특정 기업 상세 페이지
        {
          path: 'companies/:companyName',
          name: 'superCompanyDetail',
          component: () => import('@/views/super/CompanyDetailView.vue'),
          props: true,
        },

        // 특정 기업 관리자 목록 페이지
        {
          path: 'companies/:companyName/managers',
          name: 'superManagerList',
          component: () => import('@/views/super/ManagerListView.vue'),
          props: true,
        },

        // 특정 기업 서비스 그룹 목록 페이지
        {
          path: 'companies/:companyName/services',
          name: 'superServiceGroupList',
          component: () => import('@/views/super/ServiceGroupListView.vue'),
          props: true,
        },

        // 특정 서비스 그룹 상세 페이지
        {
          path: 'companies/:companyName/services/:serviceGroupName',
          name: 'superServiceGroupDetail',
          component: () => import('@/views/super/ServiceGroupDetailView.vue'),
          props: true,
        },

        // 특정 서비스 상세 페이지
        {
          path: 'companies/:companyName/services/:serviceGroupName/:serviceName',
          name: 'superServiceDetail',
          component: () => import('@/views/super/ServiceDetailView.vue'),
          props: true,
        },

        // 신청 목록 페이지
        {
          path: 'applications',
          name: 'superApplicationList',
          component: () => import('@/views/super/ApplicationListView.vue'),
          props: true,
        },

        // 특정 기업 신청 상세 페이지
        {
          path: 'applications/:companyId/details',
          name: 'superApplicationDetails',
          component: () => import('@/views/super/ApplicationDetailView.vue'),
          props: true,
        },

        // 시스템 관리 페이지: 권한, 환경설정 등
        {
          path: 'system-management',
          name: 'superSystemManagement',
          component: () => import('@/views/super/SystemManagementView.vue'),
          props: true,
        },

        // 플랫폼 관리자 알림 이력 페이지
        {
          path: 'notification',
          name: 'superNotification',
          component: () => import('@/views/super/SuperNotificationView.vue'),
        },
      ],
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
