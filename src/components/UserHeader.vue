<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ===== 페이지 로드 시 인증 상태 확인 =====

onMounted(() => {
  authStore.checkAuth()
  console.log('🎯 UserHeader 마운트:', {
    isLoggedIn: authStore.isLoggedIn,
    role: authStore.role,
    companyId: authStore.companyId,
    companySlug: authStore.companySlug,
  })
})

// ===== 현재 페이지의 회사와 로그인한 회사가 일치하는지 확인 =====

/**
 * 유효한 로그인 상태 검증
 * - 로그인 상태 && USER 권한 && 현재 URL의 companySlug와 저장된 companySlug 일치
 */
const isValidLogin = computed(() => {
  // 로그인 상태가 아니면 false
  if (!authStore.isLoggedIn || authStore.role !== 'USER') {
    return false
  }

  // URL에서 현재 회사 slug 추출
  const currentSlug = route.params.companySlug

  // company 페이지가 아니면 false (헤더 비표시)
  if (!currentSlug) {
    return false
  }

  // 현재 URL의 slug와 저장된 slug 비교
  const isValid = authStore.companySlug === currentSlug

  if (!isValid) {
    console.warn('⚠️ Header: 다른 회사 페이지 감지', {
      saved: authStore.companySlug,
      current: currentSlug,
    })
  }

  return isValid
})

// ===== 로그인 상태 변경 감지 =====

watch(
  () => authStore.isLoggedIn,
  (newValue) => {
    console.log('👀 로그인 상태 변경:', newValue, 'role:', authStore.role)
  },
)

// ===== 네비게이션 핸들러 =====

/**
 * 홈/랜딩 페이지로 이동
 * - 로그인 상태: /c/:companySlug/service/list
 * - 비로그인 상태: /c/:companySlug
 */
const goToHome = () => {
  const currentSlug = route.params.companySlug || authStore.companySlug || 'default'

  if (isValidLogin.value) {
    // 로그인 상태면 서비스 목록으로
    router.push(`/c/${currentSlug}/service/list`)
  } else {
    // 비로그인 상태면 랜딩 페이지로
    router.push(`/c/${currentSlug}`)
  }
}

/**
 * 서비스 목록 페이지로 이동
 */
const goToService = () => {
  const slug = authStore.companySlug || 'default'
  router.push(`/c/${slug}/service/list`)
}

/**
 * 예약 내역 페이지로 이동
 */
const goToReservation = () => {
  const slug = authStore.companySlug || 'default'
  router.push(`/c/${slug}/myReservation`)
}

/**
 * 내 계정 페이지로 이동
 */
const goToMypage = () => {
  const slug = authStore.companySlug || 'default'
  router.push(`/c/${slug}/mypage`)
}

/**
 * 알림 페이지로 이동
 */
const goToNotification = () => {
  const slug = authStore.companySlug || 'default'
  router.push(`/c/${slug}/notification`)
}

// ===== 로그아웃 핸들러 =====

/**
 * 로그아웃 처리
 * - Store의 companySlug를 사용하여 리다이렉트
 */
const handleLogout = () => {
  const targetSlug = authStore.companySlug || route.params.companySlug || 'default'
  authStore.logout()
  alert('로그아웃되었습니다.')
  router.push(`/c/${targetSlug}/`)
}
</script>

<template>
  <header class="user-header">
    <div class="user-header-container">
      <!-- 로고 영역 (클릭 시 홈으로 이동) -->
      <div class="user-header-logo-wrapper" @click="goToHome">
        <img src="/assets/images/admin_logo.png" alt="로고" class="user-header-logo-img" />
      </div>

      <!-- 로그인 후 네비게이션 메뉴 (유효한 로그인 상태일 때만 표시) -->
      <nav v-if="isValidLogin" class="user-header-nav">
        <button @click="goToService" class="user-header-nav-item">서비스 목록</button>
        <button @click="goToReservation" class="user-header-nav-item">예약 내역</button>
        <button @click="goToMypage" class="user-header-nav-item">내 계정</button>
      </nav>

      <!-- 로그인 후 알림 + 로그아웃 버튼 (유효한 로그인 상태일 때만 표시) -->
      <div v-if="isValidLogin" class="user-btn-container">
        <button @click="goToNotification" class="notification-btn">
          <img src="/assets/icons/ic-no-notify.png" class="user-header-alam" alt="알림" />
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
  @apply max-w-7xl mx-auto px-6 py-1 flex items-center justify-between;
}

.user-header-logo-wrapper {
  @apply flex items-center cursor-pointer;
}

.user-header-logo-img {
  @apply h-9 w-auto;
}

.user-header-nav {
  @apply flex items-center gap-20 mr-5;
}

.user-header-nav-item {
  @apply text-base font-medium text-gray-500 hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none;
}

.notification-btn {
  @apply inline-flex items-center bg-transparent border-none cursor-pointer;
}

.user-header-alam {
  @apply w-6 h-auto cursor-pointer hover:opacity-80 transition-opacity ml-20;
}

.user-btn-container {
  @apply flex items-center gap-5;
}

.login-btn {
  @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all cursor-pointer border-none text-sm font-medium;
}

.logout-btn {
  @apply px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all cursor-pointer border-none text-sm font-medium;
}
</style>
