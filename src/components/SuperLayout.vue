<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goDashboard = () => {
  router.push('/super/dashboard')
}

const goManagement = () => {
  router.push('/super/management')
}
</script>

<template>
  <div class="super-layout">
    <!-- 서브메뉴바 -->
    <div class="sub-bar-contaienr">
      <!-- UniBooker 로고 -->
      <div class="logo-section">
        <img src="/public/assets/images/unibooker_white_logo.png" alt="UniBooker 로고 이미지" />
      </div>

      <!-- 메뉴 섹션 -->
      <div class="sub-menu-section">
        <div class="sub-menu-items-container">
          <div class="sub-menu-item" @click="goDashboard">대시보드</div>
          <div class="sub-menu-item" @click="goManagement">기업 관리</div>
        </div>
      </div>

      <!-- 로그아웃 버튼 -->
      <div class="sub-menu-logout-button-container">
        <img src="/public/assets/icons/ic-logout.png" alt="로그아웃" />
        Logout
      </div>
    </div>

    <!-- 계정 -->
    <div class="content-body">
      <div class="content-top">
        <div class="super-badge">
          <img src="/public/assets/images/unibooker_blue_logo.svg" alt="기업 로고 이미지" />
          <span>홍서연 운영자님</span>
          <img src="/public/assets/icons/ic-new-notify.png" alt="알림 이미지" />
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
  @apply bg-white flex items-center rounded-[20px] overflow-hidden px-[12px] py-[6px] text-xs text-[#7D7D7D] font-medium cursor-pointer;
}

.super-badge img:first-child {
  @apply w-[90px];
}

.super-badge span {
  @apply ml-[3px] mr-[12px];
}

.super-badge img:last-child {
  @apply w-[17px] h-[18px];
}

.content-slot {
  @apply mt-[10px] w-full;
}
</style>
