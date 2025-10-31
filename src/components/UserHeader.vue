<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import userApi from '@/services/user/user_api'
import { useNotificationStore } from '@/stores/notificationStore'
import { getCompanyLogoUrl } from '@/utils/imageUrl'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// ===== 기업 로고 상태 =====
const companyLogo = ref('/assets/images/admin_logo.png')
const isLogoLoading = ref(false)

// ===== 현재 companySlug =====
const currentSlug = computed(() => route.params.companySlug || authStore.companySlug || 'default')

// ===== 유효한 로그인 상태 =====
const isValidLogin = computed(() => {
  return authStore.isLoggedIn && authStore.role === 'USER'
})

// ===== 기업 정보 로드 (항상 API 호출) =====
const loadCompanyInfo = async () => {
  try {
    if (!currentSlug.value) {
      companyLogo.value = '/assets/images/admin_logo.png'
      return
    }

    isLogoLoading.value = true

    // ✅ 항상 현재 companySlug 기반으로 API 호출
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/companies/slug/${currentSlug.value}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (result.isSuccess && result.data?.logoUrl) {
      companyLogo.value = getCompanyLogoUrl(result.data.logoUrl)
    } else {
      companyLogo.value = '/assets/images/admin_logo.png'
    }
  } catch (error) {
    console.error('기업 정보 로드 실패:', error)
    companyLogo.value = '/assets/images/admin_logo.png'
  } finally {
    isLogoLoading.value = false
  }
}

// ===== companySlug 변경 감지 =====
watch(
  () => route.params.companySlug,
  (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
      loadCompanyInfo()
    }
  },
)

// ===== 네비게이션 핸들러 =====
const goToHome = () => {
  if (isValidLogin.value) {
    router.push(`/c/${currentSlug.value}/service/list`)
  } else {
    router.push(`/c/${currentSlug.value}`)
  }
}

const goToService = () => {
  router.push(`/c/${currentSlug.value}/services`)
}

const goToReservation = () => {
  router.push(`/c/${currentSlug.value}/reservations`)
}

const goToMypage = () => {
  router.push(`/c/${currentSlug.value}/user/mypage`)
}

const notiToggleDropdown = async () => {
  router.push(`/c/${currentSlug.value}/notification`)
}

// ===== 로그아웃 핸들러 =====
const handleLogout = async () => {
  try {
    await userApi.logoutUser()
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error)
  } finally {
    authStore.logout()
    alert('로그아웃되었습니다.')
    router.push(`/c/${currentSlug.value}`)
  }
}

// ===== 컴포넌트 마운트 시 로고 로드 =====
onMounted(() => {
  loadCompanyInfo()
})
</script>

<template>
  <header class="user-header">
    <div class="user-header-container">
      <!-- 로고 영역 -->
      <div class="user-header-logo-wrapper" @click="goToHome">
        <img
          v-if="!isLogoLoading"
          :src="companyLogo"
          alt="기업 로고"
          class="user-header-logo-img"
          @error="companyLogo = '/assets/images/admin_logo.png'"
        />
        <div v-else class="user-header-logo-skeleton"></div>
      </div>

      <!-- 로그인 후 네비게이션 메뉴 -->
      <nav v-if="isValidLogin" class="user-header-nav">
        <div class="user-header-nav-container">
          <button @click="goToService" class="user-header-nav-item">서비스 목록</button>
          <button @click="goToReservation" class="user-header-nav-item">예약 내역</button>
          <button @click="goToMypage" class="user-header-nav-item">내 계정</button>
        </div>
      </nav>

      <!-- 로그인 후 알림 + 로그아웃 버튼 -->
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
  @apply w-full mx-auto px-20 py-1 pt-[8px] flex justify-between min-h-[50px];
}

.user-header-logo-wrapper {
  @apply flex items-center cursor-pointer;
}

.user-header-logo-img {
  @apply h-6 w-auto;
}

/* 로고 로딩 스켈레톤 */
.user-header-logo-skeleton {
  @apply h-6 w-32 bg-gray-200 rounded animate-pulse;
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
