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

// 인증 핸들러
const handleLogin = () => {
  router.push('/login')
}

const handleSignup = () => {
  router.push('/signup')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
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
        <button @click="goToMypage" class="user-header-nav-item">마이페이지</button>
      </nav>

      <!-- 로그인 전: LOGIN | SIGNUP -->
      <div v-if="!authStore.isLoggedIn" class="user-btn-container">
        <button @click="handleLogin" class="user-header-btn">LOGIN</button>
        <span class="user-btn-divider">|</span>
        <button @click="handleSignup" class="user-header-btn">SIGNUP</button>
      </div>

      <!-- 로그인 후: LOGOUT -->
      <div v-else class="user-btn-container">
        <button @click="handleLogout" class="user-header-btn">LOGOUT</button>
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
  @apply flex items-center gap-12 ml-10;
}

.user-header-nav-item {
  @apply text-base font-medium text-gray-500 hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none;
}

.user-btn-container {
  @apply flex items-center gap-5;
}

.user-btn-divider {
  @apply text-gray-400;
}

.user-header-btn {
  @apply text-base font-normal text-gray-400 hover:text-primary-hover hover:font-medium transition-colors cursor-pointer bg-transparent border-none;
}
</style>
