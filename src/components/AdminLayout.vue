<script setup>
import { ref } from 'vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'

// 예시 서비스 그룹 목록입니다.
const services = ref([
  { label: '동아리 모집' },
  { label: '회의실 예약' },
  { label: '통근버스 신청' },
  { label: '캠핑카 이용 신청' },
])

// 서비스 그룹의 드롭다운 메뉴 항목
const dropdownItems = ['전체 분석', '예약 현황', '예약 관리', '서비스 관리']

const openDropdown = ref(null) // 열려있는 서비스 그룹
const selectedMenuItems = ref(
  // 드롭다운 메뉴 항목의 초기값은 첫 번째 메뉴인 '전체 분석'
  // 이후에는 마지막으로 머물렀던 메뉴 항목을 유지
  Object.fromEntries(services.value.map((_, i) => [i, dropdownItems[0]])),
)

// 드롭다운 토글
const toggleDropdown = (index) => {
  if (openDropdown.value === index) {
    openDropdown.value = null
  } else {
    openDropdown.value = index
  }
}

// 드롭다운 메뉴 선택
const selectMenuItem = (serviceIndex, menu) => {
  selectedMenuItems.value[serviceIndex] = menu
}

// 알림 관련 상태, 예시
const isDropdownOpen = ref(false)
const notifications = ref([
  { id: 1, message: '신규 기업 회원가입 요청이 도착했습니다.', time: '2분 전' },
  { id: 2, message: '서버 점검이 내일 오전 9시에 예정되어 있습니다.', time: '1시간 전' },
  { id: 3, message: '신청서가 검토 완료되었습니다.', time: '어제' },
])

// 알림 아이콘 클릭 토글
const notiToggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>

<template>
  <div class="admin-layout">
    <!-- 서브메뉴바 -->
    <div class="sub-bar-contaienr">
      <!-- UniBooker 로고 -->
      <div class="logo-section">
        <img src="/public/assets/images/unibooker_white_logo.png" alt="UniBooker 로고 이미지" />
      </div>

      <!-- 리소스 그룹 생성 버튼 -->
      <router-link to="/admin/service-group-create" class="service-group-create-button-container"
        >서비스 그룹 생성</router-link
      >

      <!-- Control 섹션 -->
      <div class="sub-menu-section">
        <span class="sub-menu-label">Control</span>
        <div class="sub-menu-items-container">
          <router-link class="sub-menu-item" to="/admin/dashboard">전체 현황</router-link>
          <router-link class="sub-menu-item" to="/admin/manager-management"
            >관리자 관리</router-link
          >
          <router-link class="sub-menu-item" to="/admin/service-group-managation"
            >서비스 그룹 관리</router-link
          >
        </div>
      </div>

      <!-- Service Groups 섹션 -->
      <div class="sub-menu-section flex-1">
        <span class="sub-menu-label">Service Groups</span>
        <div class="sub-menu-items-container sub-menu-scroll">
          <div v-for="(item, index) in services" :key="index">
            <router-link
              to="#!"
              class="sub-menu-item"
              :class="{ 'selected-menu-item': openDropdown === index }"
              @click="toggleDropdown(index)"
            >
              {{ item.label }}
            </router-link>
            <div v-if="openDropdown === index">
              <router-link
                v-for="child in dropdownItems"
                to="#!"
                :key="child"
                class="service-group-menu-item"
                :class="{ 'selected-service-group-item': selectedMenuItems[index] === child }"
                @click.stop="selectMenuItem(index, child)"
              >
                {{ child }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 로그아웃 버튼 -->
      <div class="sub-menu-logout-button-container">
        <img src="/public/assets/icons/ic-logout.png" alt="로그아웃" />
        Logout
      </div>
    </div>

    <!-- 서브메뉴 별 내용이 표시되는 곳 -->
    <div class="content-body">
      <div class="content-top">
        <div class="admin-badge">
          <img src="/public/assets/images/admin_logo.png" alt="기업 로고 이미지" />
          <span>김아영 관리자님</span>
          <button @click.stop="notiToggleDropdown" class="super-notify-btn">
            <img src="/assets/icons/ic-new-notify.png" alt="알림 아이콘" class="notify-icon" />
          </button>
          <NotificationDropdown
            type="admin"
            v-if="isDropdownOpen"
            :notifications="notifications"
            @close="isDropdownOpen = false"
          />
        </div>
      </div>
      <div class="content-slot">
        <!-- 여기에 내용이 들어갑니다! -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-bar-contaienr {
  @apply bg-primary h-screen text-white overflow-hidden flex flex-col max-w-[280px] w-full pr-[20px];
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
  @apply max-w-[252px] pl-[30px] py-[10px] text-sm cursor-pointer block
    hover:border-l-4
    hover:border-white
    hover:bg-[rgba(255,255,255,0.44)];
}

.selected-menu-item {
  @apply border-l-4 border-white bg-[rgba(255,255,255,0.44)];
}

.sub-menu-logout-button-container {
  @apply flex gap-3 items-center ml-[16px] mb-[20px] text-sm cursor-pointer hover:font-medium w-fit;
}

.sub-menu-logout-button-container img {
  @apply w-[15px] h-[15px];
}

.sub-menu-scroll {
  @apply flex-1 overflow-y-auto max-h-[280px];
}

.service-group-menu-item {
  @apply bg-[rgba(105,105,105,0.52)] text-[13px] pl-[34px] py-2 cursor-pointer text-[#C0C0C0] block
  hover:text-white
  hover:font-medium;
}

.selected-service-group-item {
  @apply text-white font-medium;
}

.admin-layout {
  @apply flex flex-row;
}

.content-body {
  @apply h-screen overflow-y-auto bg-gray-line flex-1 ml-[-20px] rounded-tl-[20px] rounded-bl-[20px] px-[30px] py-[22px];
}

.content-top {
  @apply w-full flex justify-end;
}

.admin-badge {
  @apply bg-white flex items-center rounded-[20px] px-[12px] py-[6px] text-xs text-[#7D7D7D] font-medium cursor-pointer relative;
}

.admin-badge img:first-child {
  @apply w-[90px];
}

.admin-badge span {
  @apply ml-[3px] mr-[12px];
}

.admin-badge img:last-child {
  @apply w-[17px] h-[18px];
}

.content-slot {
  @apply mt-[10px] w-full;
}
</style>
