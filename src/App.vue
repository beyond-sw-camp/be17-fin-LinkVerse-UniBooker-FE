<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminNavbar from '@/components/AdminNavbar.vue'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import SuperLayout from './components/SuperLayout.vue'

const route = useRoute()

// 현재 라우트의 레이아웃 타입
const layoutType = computed(() => route.meta.layout || null)

// Admin NavBar 표시 여부
const showAdminNav = computed(() => route.meta.showAdminNav === true)
</script>

<template>
  <!-- User 레이아웃: UserHeader + RouterView + UserFooter -->
  <div v-if="layoutType === 'user'" class="user-layout">
    <UserHeader />
    <main class="user-content">
      <RouterView />
    </main>
    <UserFooter />
  </div>

  <!-- Super 레이아웃 -->
  <div v-else-if="layoutType === 'super'">
    <RouterView />
  </div>

  <!-- Admin 레이아웃: AdminNavbar + RouterView -->
  <div v-else-if="showAdminNav" class="admin-layout">
    <div class="admin-nav">
      <AdminNavbar />
    </div>
    <main class="admin-content">
      <RouterView />
    </main>
  </div>

  <!-- 레이아웃 없음: RouterView만 -->
  <RouterView v-else />
</template>

<style scoped>
.user-layout {
  @apply min-h-screen flex flex-col;
}

.user-content {
  @apply flex-1;
}

/* Admin 레이아웃 스타일 추가 */
.admin-layout {
  @apply min-h-screen flex bg-gray-line;
}

.admin-nav {
  @apply flex justify-center absolute w-full px-40 mt-8;
}

.admin-content {
  @apply flex-1 pt-20;
}
</style>
