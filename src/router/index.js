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
      meta: { showAdminNav: true },
    },
    {
      path: '/admin/signup/status',
      name: 'adminStatus',
      component: () => import('@/views/admin/AdminSignupStatusView.vue'),
      meta: { showAdminNav: true },
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { showAdminNav: true },
    },
    {
      path: '/admin/firstPassword',
      name: 'firstPassword',
      component: () => import('@/views/admin/AdminPasswordResetView.vue'),
      meta: { showAdminNav: true, requiresAuth: false },
    },
    {
      path: '/admin/home',
      name: 'adminHome',
      component: () => import('@/views/admin/AdminLandingView.vue'),
      meta: { showAdminNav: true },
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
    },
    {
      path: '/admin/service',
      name: 'serviceIntro',
      component: () => import('@/views/admin/AdminServiceIntroView.vue'),
      meta: { showAdminNav: true },
    },
    {
      path: '/admin/manager-management',
      name: 'ManagerManagement',
      component: () => import('@/views/admin/ManagerManagement.vue'),
    },
    {
      path: '/admin/notification',
      name: 'AdminNotification',
      component: () => import('@/views/admin/AdminNotificationView.vue'),
    },
    {
      path: '/admin/service-group-create',
      name: 'ServiceGroupCreate',
      component: () => import('@/views/admin/ServiceGroupCreate.vue'),
    },
    {
      path: '/admin/service-group-managation',
      name: 'ServiceGroupManagation',
      component: () => import('@/views/admin/ServiceGroupManagation.vue'),
    },
    {
      path: '/admin/service-group-edit/:id',
      name: 'ServiceGroupEdit',
      component: () => import('@/views/admin/ServiceGroupEdit.vue'),
    },
    {
      path: '/admin/reservation-management',
      name: 'ReservationManagement',
      component: () => import('../views/admin/ReservationManagement.vue'),
    },
    {
      path: '/admin/seat-reservation-management',
      name: 'SeatReservationManagement',
      component: () => import('@/views/admin/SeatReservationManagement.vue'),
    },
    {
      path: '/admin/service-create',
      name: 'ServiceCreate',
      component: () => import('@/views/admin/ServiceCreate.vue'),
    },
    {
      path: '/admin/service-management',
      name: 'ServiceManagement',
      component: () => import('@/views/admin/ServiceManagement.vue'),
    },
    {
      // 신청형 예약 관리
      path: '/admin/event-reservation-management',
      name: 'EventReservationManagement',
      component: () => import('@/views/admin/EventReservationManagement.vue'),
    },
    {
      // 신청형 예약 현황
      path: '/admin/event-reservation-status',
      name: 'EventReservationStatus',
      component: () => import('../views/admin/EventReservationStatus.vue'),
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 플랫폼 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/super/login',
      name: 'SuperLogin',
      component: () => import('@/views/super/SuperLoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/super',
      name: 'super',
      component: () => import('@/components/SuperLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'superDashboard',
          component: () => import('@/views/super/DashboardView.vue'),
        },
        {
          path: 'companies',
          name: 'superCompanyList',
          component: () => import('@/views/super/CompanyListView.vue'),
        },
        {
          path: 'companies/:companyName',
          name: 'superCompanyDetail',
          component: () => import('@/views/super/CompanyDetailView.vue'),
          props: true,
        },
        {
          path: 'companies/:companyName/managers',
          name: 'superManagerList',
          component: () => import('@/views/super/ManagerListView.vue'),
          props: true,
        },
        {
          path: 'companies/:companyName/services',
          name: 'superServiceGroupList',
          component: () => import('@/views/super/ServiceGroupListView.vue'),
          props: true,
        },
        {
          path: 'companies/:companyName/services/:serviceGroupName',
          name: 'superServiceGroupDetail',
          component: () => import('@/views/super/ServiceGroupDetailView.vue'),
          props: true,
        },
        {
          path: 'companies/:companyName/services/:serviceGroupName/:serviceName',
          name: 'superServiceDetail',
          component: () => import('@/views/super/ServiceDetailView.vue'),
          props: true,
        },
        {
          path: 'applications',
          name: 'superApplicationList',
          component: () => import('@/views/super/ApplicationListView.vue'),
          props: true,
        },
        {
          path: 'applications/:companyId',
          name: 'superApplicationDetails',
          component: () => import('@/views/super/ApplicationDetailView.vue'),
          props: true,
        },
        {
          path: 'system-management',
          name: 'superSystemManagement',
          component: () => import('@/views/super/SystemManagementView.vue'),
          props: true,
        },
        {
          path: 'notification',
          name: 'superNotification',
          component: () => import('@/views/super/SuperNotificationView.vue'),
        },
      ],
    },
  ],

  /**
   * 스크롤 동작 설정
   */
  scrollBehavior(to, from, savedPosition) {
    if (to.query.section) {
      return false
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

/**
 * 전역 네비게이션 가드
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const currentSlug = to.params.companySlug

  if (to.name === 'UserLanding' && authStore.isLoggedIn && currentSlug === authStore.companySlug) {
    return next(`/c/${currentSlug}/service/list`)
  }

  if (currentSlug) {
    const isValid = authStore.validateCompanyContext(currentSlug)
    if (!isValid) {
      return next(`/c/${currentSlug}`)
    }
  }

  next()
})

export default router
