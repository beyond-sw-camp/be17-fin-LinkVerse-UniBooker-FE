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
  <header class="components-header">
    <div class="components-header-container">
      <!-- 로고 영역 -->
      <div class="components-header-logo">
        <img
          src="/assets/icons/admin-logo.png"
          alt="한화시스템 로고"
          class="components-header-logo-img"
        />
        <span class="components-header-logo-text">한화시스템</span>
      </div>

      <!-- 로그인 후 네비게이션 메뉴 -->
      <nav v-if="isLoggedIn" class="components-header-nav">
        <a href="/service" class="components-header-nav-item">서비스 목록</a>
        <a href="/reservation" class="components-header-nav-item">예약 내역</a>
        <a href="/mypage" class="components-header-nav-item">마이페이지</a>
        <button @click="handleLogout" class="components-header-nav-item components-header-logout">
          LOGOUT
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped></style>
