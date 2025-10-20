<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import SuperLayout from './components/SuperLayout.vue'

const route = useRoute()

// 현재 라우트의 레이아웃 타입
const layoutType = computed(() => route.meta.layout || null)
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
</style>
