<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import userApi from '@/services/user/user_api'
import axiosInstance from '@/plugin/axiosInterceptor'
import notifyApi from '@/services/notification/notification_api'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const isDropdownOpen = ref(false)
const notifications = ref([])
const slug = route.params.companySlug || authStore.companySlug || 'default'

// ===== 실제 인증 상태 (서버 검증) =====
const isActuallyAuthenticated = ref(false)
const isCheckingAuth = ref(false)

/**
 * 인증 검증이 필요 없는 페이지 확인
 * - 로그인 페이지, 회원가입 페이지, 아이디 찾기, 비밀번호 찾기는 검증 불필요
 * - 경로 기반으로 판단 (route.name 대신 route.path 사용)
 */
const isAuthPage = computed(() => {
  const currentPath = route.path

  // 로그인 페이지 패턴
  const isLoginPage =
    currentPath === '/' || currentPath.endsWith('/') || currentPath.includes('/login')

  // 회원가입 페이지 패턴
  const isSignupPage = currentPath.includes('/signup')

  // 아이디/비밀번호 찾기 페이지 패턴
  const isFindPage = currentPath.includes('/find-id') || currentPath.includes('/find-password')

  return isLoginPage || isSignupPage || isFindPage
})

/**
 * 서버에 실제 인증 상태 확인
 * - localStorage가 아닌 쿠키 기반 서버 검증
 * - 현재 페이지의 companySlug와 서버 토큰의 companySlug 비교
 * - 로그인/회원가입 페이지에서는 실행하지 않음
 */
const checkServerAuth = async () => {
  // 인증 페이지에서는 검증하지 않음
  if (isAuthPage.value) {
    isActuallyAuthenticated.value = false
    console.log('🔇 인증 페이지 - 검증 생략')
    return
  }

  if (isCheckingAuth.value) return

  const currentSlug = route.params.companySlug
  if (!currentSlug) {
    isActuallyAuthenticated.value = false
    return
  }

  isCheckingAuth.value = true

  try {
    // Silent 플래그 추가 (401 알림 표시 안 함)
    const response = await axiosInstance.get('/api/users/me', {
      _silentAuth: true,
    })

    if (response.data.isSuccess) {
      const userData = response.data.data

      console.log('✅ 서버 인증 성공:', {
        serverSlug: userData.companySlug,
        currentSlug: currentSlug,
      })

      // 현재 페이지의 slug와 서버 토큰의 slug 비교
      if (userData.companySlug === currentSlug) {
        isActuallyAuthenticated.value = true

        // localStorage 상태도 동기화
        if (!authStore.isLoggedIn || authStore.companySlug !== currentSlug) {
          authStore.login(
            { userId: userData.id, name: userData.name, email: userData.email },
            'USER',
            userData.companyId,
            userData.companySlug,
          )
        }
      } else {
        // slug 불일치 → 다른 기업으로 로그인된 상태
        isActuallyAuthenticated.value = false

        console.warn('⚠️ Company Slug 불일치:', {
          server: userData.companySlug,
          current: currentSlug,
        })

        // localStorage 정리
        if (authStore.companySlug === currentSlug) {
          console.warn('⚠️ 다른 기업으로 로그인됨 - 현재 페이지 인증 해제')
          authStore.forceLogout()
        }
      }
    }
  } catch (error) {
    // 401 에러 → 인증 안 됨 (알림 표시 안 함)
    isActuallyAuthenticated.value = false

    console.warn('❌ 서버 인증 실패 (401):', error.response?.status)

    // localStorage에는 있는데 서버는 인증 실패 → 좀비 세션
    if (authStore.isLoggedIn && authStore.companySlug === currentSlug) {
      console.warn('⚠️ 좀비 세션 감지 - 서버 인증 실패')
      authStore.forceLogout()
    }
  } finally {
    isCheckingAuth.value = false
  }
}

// ===== 주기적 인증 확인 =====
let authCheckInterval = null

onMounted(async () => {
  console.log('📡 UserHeader 마운트 - 초기화 시작')

  // 초기 localStorage 복원
  authStore.checkAuth()

  // 로그인 페이지가 아닐 때만 서버 인증 확인
  if (!isAuthPage.value) {
    console.log('📡 서비스 페이지 - 인증 검증 시작')
    await checkServerAuth()

    // 10초마다 주기적 검증
    authCheckInterval = setInterval(checkServerAuth, 10000)

    console.log('📡 헤더 인증 검증 시작 (10초 간격)')
  } else {
    console.log('🔇 인증 페이지 - 검증하지 않음')
  }
})

onUnmounted(() => {
  if (authCheckInterval) {
    clearInterval(authCheckInterval)
    console.log('📡 헤더 인증 검증 중지')
  }
})

// ===== URL 변경 감지 =====
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      console.log('🔄 URL 변경 감지:', { old: oldPath, new: newPath })

      // 인증 페이지로 이동 시 interval 정리
      if (isAuthPage.value) {
        if (authCheckInterval) {
          clearInterval(authCheckInterval)
          authCheckInterval = null
          console.log('📡 인증 페이지 이동 - 검증 중지')
        }
        isActuallyAuthenticated.value = false
      } else {
        // 서비스 페이지로 이동 시 즉시 검증 + interval 시작
        console.log('📡 서비스 페이지 이동 - 즉시 검증')
        await checkServerAuth()

        if (!authCheckInterval) {
          authCheckInterval = setInterval(checkServerAuth, 10000)
          console.log('📡 주기적 검증 시작')
        }
      }
    }
  },
)

// ===== 유효한 로그인 상태 (서버 검증 기반) =====
const isValidLogin = computed(() => {
  return isActuallyAuthenticated.value && !isAuthPage.value
})

// ===== 네비게이션 핸들러 =====
const goToHome = () => {
  if (isValidLogin.value) {
    router.push(`/c/${slug}/service/list`)
  } else {
    router.push(`/c/${slug}`)
  }
}

const goToService = () => {
  router.push(`/c/${slug}/services`)
}

const goToReservation = () => {
  router.push(`/c/${slug}/reservations`)
}

const goToMypage = () => {
  router.push(`/c/${slug}/user/mypage`)
}

// 알림 아이콘 클릭 토글
const notiToggleDropdown = async () => {
  router.push(`/c/${slug}/notification`)
}

// ===== 로그아웃 핸들러 =====
const handleLogout = async () => {
  const targetSlug = route.params.companySlug || authStore.companySlug || 'default'

  try {
    await userApi.logoutUser()
    console.log('✅ 서버 로그아웃 성공')
  } catch (error) {
    console.error('❌ 서버 로그아웃 실패:', error)
  } finally {
    // 성공/실패 관계없이 클라이언트 정리
    isActuallyAuthenticated.value = false
    authStore.logout()
    alert('로그아웃되었습니다.')
    router.push(`/c/${targetSlug}`)
  }
}
</script>

<template>
  <header class="user-header">
    <div class="user-header-container">
      <!-- 로고 영역 -->
      <div class="user-header-logo-wrapper" @click="goToHome">
        <img src="/assets/images/admin_logo.png" alt="로고" class="user-header-logo-img" />
      </div>

      <!-- 로그인 후 네비게이션 메뉴 (서버 검증 기반) -->
      <nav v-if="isValidLogin" class="user-header-nav">
        <div class="user-header-nav-container">
          <button @click="goToService" class="user-header-nav-item">서비스 목록</button>
          <button @click="goToReservation" class="user-header-nav-item">예약 내역</button>
          <button @click="goToMypage" class="user-header-nav-item">내 계정</button>
        </div>
      </nav>

      <!-- 로그인 후 알림 + 로그아웃 버튼 (서버 검증 기반) -->
      <div v-if="isValidLogin" class="user-btn-container">
        <button @click.stop="notiToggleDropdown" class="notify-btn">
          <img
            :src="
              notificationStore.hasNotification
                ? '/assets/icons/ic-new-notify.png'
                : '/assets/icons/ic-no-notify.png'
            "
            alt="알림 아이콘"
            class="user-header-alam"
          />
        </button>
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.user-header {
  @apply w-full bg-white border-b border-gray-200 shadow-sm;
}

.user-header-container {
  @apply w-full mx-auto px-20 py-1 flex justify-between;
}

.user-header-logo-wrapper {
  @apply flex items-center cursor-pointer;
}

.user-header-logo-img {
  @apply h-9 w-auto;
}

.user-header-nav {
  @apply flex items-center;
}

.user-header-nav-container {
  @apply flex justify-between min-w-[450px] mx-40;
}

.user-header-nav-item {
  @apply text-base font-normal text-gray-500 hover:font-medium hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none;
}

.notification-btn {
  @apply inline-flex items-center bg-transparent border-none cursor-pointer;
}

.user-header-alam {
  @apply w-6 h-auto cursor-pointer hover:scale-105 hover:opacity-80 transition-opacity;
}

.user-btn-container {
  @apply flex items-center gap-5;
}

.logout-btn {
  @apply px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all cursor-pointer border-none text-sm font-medium;
}
</style>
