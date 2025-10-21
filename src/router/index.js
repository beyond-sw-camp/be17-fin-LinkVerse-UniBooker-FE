import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 고객 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/c/:companySlug/',
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
      path: '/c/:companySlug/user/mypage',
      name: 'userMypage',
      component: () => import('@/views/user/UserMypageView.vue'),
      meta: { layout: 'user', requiresAuth: true },
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
      meta: { showAdminNav: true }
    },
    {
      path: '/admin/signup/status',
      name: 'adminStatus',
      component: () => import('@/views/admin/AdminSignupStatusView.vue'),
      meta: { showAdminNav: true }
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { showAdminNav: true }
    },
    {
      path: '/admin/firstPassword',
      name: 'firstPassword',
      component: () => import('@/views/admin/AdminPasswordResetView.vue'),
      meta: { showAdminNav: true },
      meta: { requiresAuth: false }
    },
    {
      path: '/admin/home',
      name: 'adminHonme',
      component: () => import('@/views/admin/AdminLandingView.vue'),
      meta: { showAdminNav: true }
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('../views/admin/AdminDashboardView.vue'),
    },
    {
      path: '/admin/service',
      name: 'serviceIntro',
      component: () => import('../views/admin/ServiceIntroView.vue'),
      meta: { showAdminNav: true }
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
      // 서비스 그룹 생성 페이지
      path: '/admin/service-group-create',
      name: 'ServiceGroupCreate',
      component: () => import('../views/admin/ServiceGroupCreate.vue'),
    },
    {
      // 서비스 그룹 관리 페이지
      path: '/admin/service-group-managation',
      name: 'ServiceGroupManagation',
      component: () => import('../views/admin/ServiceGroupManagation.vue'),
    },
    {
      // 서비스 그룹 수정 페이지
      path: '/admin/service-group-edit',
      name: 'ServiceGroupEdit',
      component: () => import('../views/admin/ServiceGroupEdit.vue'),
    },
    {
      path: '/admin/seat-reservation-management',
      name: 'SeatReservationManagement',
      component: () => import('../views/admin/SeatReservationManagement.vue'),
      // 서비스 생성 페이지
      path: '/admin/service-create',
      name: 'ServiceCreate',
      component: () => import('../views/admin/ServiceCreate.vue'),
    },
    {
      // 서비스 관리 페이지
      path: '/admin/service-management',
      name: 'ServiceManagement',
      component: () => import('../views/admin/ServiceManagement.vue'),
    },
    {
      path: '/admin/event-reservation-management',
      name: 'EventReservationManagement',
      component: () => import('../views/admin/EventReservationManagement.vue'),
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 플랫폼 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ===== 슈퍼 관리자 로그인 (추가) =====
    {
      path: '/super/login',
      name: 'SuperLogin',
      component: () => import('@/views/super/SuperLoginView.vue'),
      meta: { requiresAuth: false }
    },
    
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
          path: 'applications/:companyId',
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
