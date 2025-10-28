<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useAuthStore } from '@/stores/UseStore'
import superApi from '@/services/super/super_api'
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const selectedMenu = ref(route.path)
const notificationStore = useNotificationStore()

/**
 * 현재 로그인한 사용자 이름 계산
 */
const userName = computed(() => {
  return authStore.user?.name || '운영자'
})

// 메뉴 배열 정의
const menuItems = [
  { label: '대시보드', path: '/super/dashboard' },
  { label: '기업 관리', path: '/super/companies' },
  { label: '신청 관리', path: '/super/applications' },
  { label: '시스템 관리', path: '/super/system-management' },
]

const goMenu = (path) => {
  router.push(path)
  selectedMenu.value = path
}

// 알림 관련 상태, 예시
const isDropdownOpen = ref(false)
const notifications = ref([
  { id: 1, message: '신규 기업 회원가입 요청이 도착했습니다.', time: '2분 전' },
  { id: 2, message: '서버 점검이 내일 오전 9시에 예정되어 있습니다.', time: '1시간 전' },
  { id: 3, message: '신청서가 검토 완료되었습니다.', time: '어제' },
])
// 알림 아이콘 클릭 토글
const toggleDropdown = () => {
  notificationStore.reset() // 알림 이미지 변경
  isDropdownOpen.value = !isDropdownOpen.value
}

// ===== 로그아웃 핸들러 =====

/**
 * 로그아웃 처리
 * - 서버에 로그아웃 API 호출 (쿠키 삭제)
 * - Store 초기화
 * - 로그인 페이지로 리다이렉트
 */
const handleLogout = async () => {
  try {
    // 서버에 로그아웃 요청 (쿠키 삭제)
    await superApi.logout()

    // 스토어 로그아웃 처리
    authStore.logout()

    // 로그인 페이지로 리다이렉트
    router.push('/super/login')
  } catch (error) {
    // 실패해도 프론트엔드 상태는 초기화
    authStore.logout()
    router.push('/super/login')
  }
}
</script>

<template>
  <div class="super-layout">
    <!-- 서브메뉴바 -->
    <div class="sub-bar-container">
      <!-- UniBooker 로고 -->
      <div class="logo-section">
        <img src="/assets/images/unibooker_white_logo.png" alt="UniBooker 로고 이미지" />
      </div>

      <!-- 메뉴 섹션 -->
      <div class="sub-menu-section">
        <div class="sub-menu-items-container">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMenu === item.path }"
            @click="goMenu(item.path)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <!-- 로그아웃 버튼 -->
      <div class="sub-menu-logout-button-container" @click="handleLogout">
        <img src="/assets/icons/ic-logout.png" alt="로그아웃" />
        Logout
      </div>
    </div>

    <!-- 계정 -->
    <div class="content-body">
      <div class="content-top">
        <div class="super-badge">
          <img src="/assets/images/unibooker_blue_logo.svg" alt="기업 로고 이미지" />
          <span>{{ userName }}님</span>
          <button @click.stop="toggleDropdown" class="super-notify-btn">
            <img
              :src="
                notificationStore.hasNotification
                  ? '/assets/icons/ic-new-notify.png'
                  : '/assets/icons/ic-no-notify.png'
              "
              alt="알림 아이콘"
              class="notify-icon"
            />
          </button>
          <NotificationDropdown
            type="super"
            v-if="isDropdownOpen"
            :notifications="notifications"
            @close="isDropdownOpen = false"
          />
        </div>
      </div>
      <div class="content-slot">
        <!-- 여기에 내용이 들어갑니다! -->
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-bar-container {
  @apply bg-gray-dark h-screen  text-white overflow-hidden flex flex-col max-w-[240px] w-full pr-[20px];
}

.logo-section {
  @apply w-[100px] mx-[14px] my-[15px];
}

.service-group-create-button-container {
  @apply mx-[11px] max-w-[240px] w-full py-[8px] text-sm flex justify-center items-center border-2 border-white rounded-[3px] mt-[15px] cursor-pointer hover:bg-primary-hover;
}

.sub-menu-section {
  @apply mt-[25px];
}

.sub-menu-label {
  @apply mx-[16px] mb-[10px] block text-sm;
}

.sub-menu-item {
  @apply max-w-[252px] pl-[30px] py-[10px] text-sm cursor-pointer
    hover:border-l-4
    hover:border-white
    hover:bg-[rgba(255,255,255,0.44)];
}

.selected-menu-item {
  @apply border-l-4 border-white bg-[rgba(255,255,255,0.44)];
}

.sub-menu-logout-button-container {
  @apply flex mt-auto gap-3 items-center ml-[16px] mb-[20px] text-sm cursor-pointer hover:font-medium w-fit;
}

.sub-menu-logout-button-container img {
  @apply w-[15px] h-[15px];
}

.sub-menu-scroll {
  @apply flex-1 overflow-y-auto max-h-[280px];
}

.service-group-menu-item {
  @apply bg-[rgba(105,105,105,0.52)] text-[13px] pl-[34px] py-2 cursor-pointer text-[#C0C0C0]
  hover:text-white
  hover:font-medium;
}

.selected-service-group-item {
  @apply text-white font-medium;
}

.super-layout {
  @apply flex;
}

.content-body {
  @apply h-screen overflow-y-auto bg-gray-line flex-1 ml-[-20px] rounded-tl-[20px] rounded-bl-[20px] px-[30px] py-[22px];
}

.content-top {
  @apply w-full flex justify-end;
}

.super-badge {
  @apply bg-white flex gap-2 items-center rounded-[20px] px-[15px] py-[10px] text-[13px] text-[#7D7D7D] font-medium cursor-pointer relative;
}

.super-badge img:first-child {
  @apply w-[90px];
}

.super-badge span {
  @apply ml-[3px];
}

.super-badge img:last-child {
  @apply w-[17px] h-[18px];
}

.content-slot {
  @apply mt-[10px] w-full;
}
</style>
