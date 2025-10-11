<script setup>
import { ref } from 'vue'

// 로그인 상태 (실제로는 Pinia store에서 관리)
const isLoggedIn = ref(true)

const handleLogout = () => {
  // 로그아웃 로직
  console.log('로그아웃 처리')
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- 로고 영역 -->
      <div class="header-logo">
        <img
          src="/public/assets/images/admin_logo.png"
          alt="한화시스템 로고"
          class="header-logo-img"
        />
        <span class="header-logo-text">한화시스템</span>
      </div>

      <!-- 로그인 후 네비게이션 메뉴 -->
      <nav v-if="isLoggedIn" class="header-nav">
        <a href="/service" class="header-nav-item">서비스 목록</a>
        <a href="/reservation" class="header-nav-item">예약 내역</a>
        <a href="/mypage" class="header-nav-item">마이페이지</a>
        <button @click="handleLogout" class="header-nav-item header-logout">LOGOUT</button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* 헤더 스타일 */
.header {
  @apply w-full bg-white border-b border-gray-200 shadow-sm;
}

.header-container {
  @apply max-w-7xl mx-auto px-6 py-4 flex items-center justify-between;
}

.header-logo {
  @apply flex items-center gap-3;
}

.header-logo-img {
  @apply h-8 w-auto;
}

.header-logo-text {
  @apply text-xl font-bold text-gray-800;
}

/* 네비게이션 메뉴 스타일 */
.header-nav {
  @apply flex items-center gap-8;
}

.header-nav-item {
  @apply text-base font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer;
}

.header-logout {
  @apply bg-transparent border-none;
}
</style>
