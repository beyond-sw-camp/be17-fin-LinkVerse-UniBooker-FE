import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import axiosInstance from '@/plugin/axiosInterceptor'

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
      meta: { layout: 'user', requiresAuth: false },
    },
    {
      path: '/c/:companySlug/signup',
      name: 'UserSignup',
      component: () => import('@/views/user/UserSignupView.vue'),
      meta: { layout: 'user', requiresAuth: false },
    },
    {
      path: '/c/:companySlug/user/mypage',
      name: 'userMypage',
      component: () => import('@/views/user/UserMypageView.vue'),
      meta: { layout: 'user', requiresAuth: true, role: 'USER' },
    },
    {
      path: '/c/:companySlug/reservation/completed',
      name: 'userReservationCompleted',
      component: () => import('@/views/user/ReservationCompletedView.vue'),
      meta: { layout: 'user', requiresAuth: false },
    },
    {
      path: '/c/:companySlug/services',
      name: 'UserServiceGroupList',
      component: () => import('@/views/user/ServiceGroupListView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/services/:serviceGroupId',
      name: 'UserServiceList',
      component: () => import('@/views/user/ServiceListView.vue'),
      meta: { layout: 'user' },
    },
    {
      path: '/c/:companySlug/myReservation',
      name: 'myReservation',
      component: () => import('@/views/user/UserMyReservation.vue'),
      meta: { layout: 'user', requiresAuth: true, role: 'USER' },
    },
    {
      path: '/c/:companySlug/myReservation/:id',
      name: 'myReservationDetail',
      component: () => import('@/views/user/UserMyReservationDetail.vue'),
      props: true,
      meta: { layout: 'user', requiresAuth: true, role: 'USER' },
    },
    {
      path: '/c/:companySlug/notification',
      name: 'UserNotification',
      component: () => import('@/views/user/UserNotificationView.vue'),
      meta: { layout: 'user', requiresAuth: true, role: 'USER' },
    },
    {
      path: '/c/:companySlug/find-password',
      name: 'FindPassword',
      component: () => import('@/views/user/FindPasswordView.vue'),
      meta: { layout: 'user', requiresGuest: true, title: '비밀번호 찾기' },
    },
    {
      path: '/c/:companySlug/find-id',
      name: 'FindId',
      component: () => import('@/views/user/FindIdView.vue'),
      meta: { layout: 'user', requiresGuest: true, title: '아이디 찾기' },
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 기업 관리자 관련 라우터
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/admin/AdminSignupView.vue'),
      meta: { showAdminNav: true, requiresAuth: false },
    },
    {
      path: '/admin/signup/status',
      name: 'adminStatus',
      component: () => import('@/views/admin/AdminSignupStatusView.vue'),
      meta: { showAdminNav: true, requiresAuth: false },
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { showAdminNav: true, requiresAuth: false },
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
      meta: { showAdminNav: true, requiresAuth: false },
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service',
      name: 'serviceIntro',
      component: () => import('@/views/admin/AdminServiceIntroView.vue'),
      meta: { showAdminNav: true, requiresAuth: false },
    },
    {
      path: '/admin/manager-management',
      name: 'ManagerManagement',
      component: () => import('@/views/admin/ManagerManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN', onlyAdmin: true },
    },
    {
      path: '/admin/notification',
      name: 'AdminNotification',
      component: () => import('@/views/admin/AdminNotificationView.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service-group-create',
      name: 'ServiceGroupCreate',
      component: () => import('@/views/admin/ServiceGroupCreate.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service-group-management',
      name: 'ServiceGroupManagement',
      component: () => import('@/views/admin/ServiceGroupManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service-group-edit/:id',
      name: 'ServiceGroupEdit',
      component: () => import('@/views/admin/ServiceGroupEdit.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/reservation-management/:serviceId',
      name: 'ReservationManagement',
      component: () => import('../views/admin/ReservationManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/seat-reservation-management',
      name: 'SeatReservationManagement',
      component: () => import('@/views/admin/SeatReservationManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service-create/:serviceGroupId',
      name: 'ServiceCreate',
      component: () => import('@/views/admin/ServiceCreate.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/service-edit/:serviceId',
      name: 'ServiceEdit',
      component: () => import('@/views/admin/ServiceEdit.vue'),
    },
    {
      path: '/admin/service-management/:serviceGroupId',
      name: 'ServiceManagement',
      component: () => import('@/views/admin/ServiceManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/event-reservation-management',
      name: 'EventReservationManagement',
      component: () => import('@/views/admin/EventReservationManagement.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/admin/event-reservation-status',
      name: 'EventReservationStatus',
      component: () => import('../views/admin/EventReservationStatus.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
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
      meta: { requiresAuth: true, role: 'SUPER' },
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
 * 전역 네비게이션 가드 (강화)
 * 1. 인증 상태 복원
 * 2. 인증 필요 페이지 접근 제어
 * 3. 역할 검증 (Manager는 Admin 페이지 접근 가능)
 * 4. Company slug 검증 (USER만)
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // ===== 역할 검증 헬퍼 함수 =====
  
  /**
   * 역할 검증 헬퍼 함수
   * - ADMIN 페이지는 ADMIN과 MANAGER 모두 허용
   * - 나머지 페이지는 정확한 역할 일치 필요
   */
  const isRoleAllowed = (currentRole, requiredRole, onlyAdmin) => {
    // onlyAdmin이 true면 ADMIN만 허용
    if (onlyAdmin === true) {
      return currentRole === 'ADMIN'
    }
  
    // Admin 페이지는 ADMIN과 MANAGER 모두 허용
    if (requiredRole === 'ADMIN' && (currentRole === 'ADMIN' || currentRole === 'MANAGER')) {
      return true
    }
  
    // 나머지는 정확히 일치해야 함
    return currentRole === requiredRole
  }
  
  // ===== 1. 인증 상태 복원 (localStorage 기반) =====
  authStore.checkAuth()

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role
  const currentSlug = to.params.companySlug

  // ===== 2. 인증 불필요 페이지는 바로 통과 =====
  if (requiresAuth === false) {
    return next()
  }

  // ===== 3. 인증 필요 페이지 접근 제어 =====
  if (requiresAuth === true) {
    // 3-1. localStorage에 인증 정보 없으면 로그아웃 처리
    if (!authStore.isLoggedIn) {
      console.warn('🚫 인증되지 않은 접근 시도 - 로그인 페이지로 리다이렉트')

      // 역할별 로그인 페이지로 리다이렉트
      if (requiredRole === 'USER') {
        const targetSlug = currentSlug || 'default'
        return next(`/c/${targetSlug}/`)
      } else if (requiredRole === 'ADMIN' || requiredRole === 'MANAGER') {
        return next('/admin/login')
      } else if (requiredRole === 'SUPER') {
        return next('/super/login')
      }

      // 기본 홈으로
      return next('/')
    }

    // 3-2. 역할 불일치 검증 (Manager는 Admin 페이지 접근 가능)
    const onlyAdmin = to.meta.onlyAdmin
    if (requiredRole && !isRoleAllowed(authStore.role, requiredRole, onlyAdmin)) {
      console.warn('🚫 권한 불일치:', {
        required: requiredRole,
        current: authStore.role,
      })

      alert('접근 권한이 없습니다.')

      // 현재 역할의 홈으로 리다이렉트
      if (authStore.role === 'USER') {
        const slug = authStore.companySlug || 'default'
        return next(`/c/${slug}/service/list`)
      } else if (authStore.role === 'ADMIN' || authStore.role === 'MANAGER') {
        return next('/admin/dashboard')
      } else if (authStore.role === 'SUPER') {
        return next('/super/dashboard')
      }

      return next('/')
    }

    // 3-3. USER 역할: Company slug 검증 (경고만)
    if (requiredRole === 'USER' && currentSlug) {
      if (authStore.companySlug && authStore.companySlug !== currentSlug) {
        console.warn('⚠️ Company Slug 불일치 (백엔드 검증 예정):', {
          stored: authStore.companySlug,
          current: currentSlug,
        })
        // 로그아웃하지 않고 계속 진행 (백엔드 401 처리)
      }
    }

    // 3-4. 서버 인증 상태 검증 (선택적 - 필요 시 활성화)
    // 매번 API 호출하면 성능 저하, 필요 시에만 사용
    /*
    try {
      // 역할별 현재 사용자 정보 조회
      let apiPath = ''
      if (requiredRole === 'USER') {
        apiPath = '/api/users/me'
      } else if (requiredRole === 'ADMIN') {
        apiPath = '/api/admins/me'
      } else if (requiredRole === 'SUPER') {
        apiPath = '/api/super/me'
      }
      
      if (apiPath) {
        await axiosInstance.get(apiPath)
      }
    } catch (error) {
      // 401 에러 → 쿠키 만료, axiosInterceptor에서 자동 로그아웃 처리
      console.error('서버 인증 실패:', error)
      return // axiosInterceptor가 리다이렉트 처리
    }
    */
  }

  // ===== 4. 모든 검증 통과 → 페이지 이동 =====
  next()
})

export default router
