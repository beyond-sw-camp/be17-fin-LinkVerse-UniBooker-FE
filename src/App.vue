<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import AdminNavbar from '@/components/AdminNavbar.vue'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import SuperLayout from './components/SuperLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 현재 라우트의 레이아웃 타입
const layoutType = computed(() => route.meta.layout || null)

// Admin NavBar 표시 여부
const showAdminNav = computed(() => route.meta.showAdminNav === true)

// ===== 탭 간 상태 동기화 =====

/**
 * localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 시)
 */
const handleStorageChange = (event) => {
  const currentPath = route.path

  // ===== 1. 로그아웃 감지 =====
  if (event.key === 'isLoggedIn') {
    console.log('다른 탭에서 로그인 상태 변경 감지:', event.newValue)

    if (event.newValue === null || event.newValue === 'false') {
      // 다른 탭에서 로그아웃 → 현재 탭도 로그아웃
      console.log('다른 탭에서 로그아웃 감지 - 현재 탭도 로그아웃 처리')

      const tempSlug = authStore.logout()

      // 권한별 로그인 페이지로 리다이렉트
      if (currentPath.startsWith('/admin')) {
        router.push('/admin/login')
      } else if (currentPath.startsWith('/super')) {
        router.push('/super/login')
      } else if (currentPath.startsWith('/c/')) {
        const slug = tempSlug || currentPath.match(/\/c\/([^/]+)/)?.[1] || 'default'
        router.push(`/c/${slug}/`)
      }

      return // 더 이상 처리하지 않음
    }
  }

  // ===== 2. 권한 변경 감지 (다른 권한으로 로그인) =====
  if (event.key === 'role' && event.newValue && event.oldValue !== event.newValue) {
    const oldRole = event.oldValue
    const newRole = event.newValue

    console.log('다른 탭에서 권한 변경 감지:', oldRole, '→', newRole)
    console.log('단일 세션 정책: 현재 탭의 세션을 무효화합니다')

    // ===== 단일 세션 정책: 현재 탭은 로그아웃 처리 =====

    // 1. 현재 탭의 Pinia store 초기화 (하지만 localStorage는 건드리지 않음)
    authStore.isLoggedIn = false
    authStore.user = null
    authStore.role = null
    authStore.companyId = null
    authStore.companySlug = null

    // 2. 기존 권한의 로그인 페이지로 리다이렉트 (새 권한이 아닌 기존 권한 기준)
    if (oldRole === 'ADMIN' || oldRole === 'MANAGER') {
      console.log('→ ADMIN 로그인 페이지로 리다이렉트')
      router.push('/admin/login')
    } else if (oldRole === 'SUPER') {
      console.log('→ SUPER 로그인 페이지로 리다이렉트')
      router.push('/super/login')
    } else if (oldRole === 'USER') {
      const slug = currentPath.match(/\/c\/([^/]+)/)?.[1] || 'default'
      console.log('→ USER 로그인 페이지로 리다이렉트:', `/c/${slug}/`)
      router.push(`/c/${slug}/`)
    } else {
      // oldRole을 알 수 없는 경우 현재 경로 기준으로 판단
      if (currentPath.startsWith('/admin')) {
        router.push('/admin/login')
      } else if (currentPath.startsWith('/super')) {
        router.push('/super/login')
      } else if (currentPath.startsWith('/c/')) {
        const slug = currentPath.match(/\/c\/([^/]+)/)?.[1] || 'default'
        router.push(`/c/${slug}/`)
      }
    }
  }
}

onMounted(async () => {
  // 인증 상태 복원 (localStorage → Pinia store)
  await authStore.checkAuth()
  console.log('인증 상태 복원 완료:', authStore.isLoggedIn, authStore.role)

  // storage 이벤트 리스너 등록
  window.addEventListener('storage', handleStorageChange)
  console.log('탭 간 동기화 리스너 등록 완료')
})

onUnmounted(() => {
  // storage 이벤트 리스너 해제
  window.removeEventListener('storage', handleStorageChange)
})
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
