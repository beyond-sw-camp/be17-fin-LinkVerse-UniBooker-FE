<script setup>
import { useAuthStore } from '@/stores/UserStore'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <header class="components-header">
    <div class="components-header-container">
      <div class="components-header-logo">
        <img
          src="@/assets/icons/admin_logo.png"
          alt="한화시스템 로고"
          class="components-header-logo-img"
        />
      </div>

      <nav v-if="authStore.isLoggedIn" class="components-header-nav">
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
