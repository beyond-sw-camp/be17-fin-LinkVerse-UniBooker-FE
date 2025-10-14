<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const router = useRouter()
const authStore = useAuthStore()

// 페이지 로드 시 인증 상태 확인
onMounted(() => {
  authStore.checkAuth()
})

// 네비게이션 핸들러
const goToService = () => {
  router.push('/service')
}

const goToReservation = () => {
  router.push('/reservation')
}

const goToMypage = () => {
  router.push('/mypage')
}
</script>

<template>
  <header class="user-header">
    <div class="user-header-container">
      <!-- 로고 영역 -->
      <div class="user-header-logo-wrapper">
        <img
          src="/assets/images/admin_logo.png"
          alt="한화시스템 로고"
          class="user-header-logo-img"
        />
      </div>

      <!-- 로그인 후 네비게이션 메뉴 -->
      <nav v-if="authStore.isLoggedIn" class="user-header-nav">
        <button @click="goToService" class="user-header-nav-item">서비스 목록</button>
        <button @click="goToReservation" class="user-header-nav-item">예약 내역</button>
        <button @click="goToMypage" class="user-header-nav-item">내 계정</button>
      </nav>

      <!-- 로그인 후 알림 아이콘 -->
      <div v-if="authStore.isLoggedIn" class="user-btn-container">
        <a href="/notification" class="notification-link">
          <img src="/public/assets/icons/ic-no-notify.png" class="user-header-alam" alt="알림" />
        </a>
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
  @apply flex items-center;
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

.notification-link {
  @apply inline-flex items-center;
}

.user-header-alam {
  @apply w-6 h-auto cursor-pointer hover:opacity-80 transition-opacity ml-20;
}

.user-btn-container {
  @apply flex items-center gap-5;
}
</style>
