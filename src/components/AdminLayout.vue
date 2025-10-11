<script setup></script>

<template>
  <div class="sub-bar-contaienr">
    <!-- UniBooker 로고 -->
    <div class="logo-section">
      <img src="/public/assets/images/unibooker_white_logo.png" alt="UniBooker 로고 이미지" />
    </div>

    <!-- 리소스 그룹 생성 버튼 -->
    <div class="service-group-create-button-container">서비스 그룹 생성</div>

    <!-- Control 섹션 -->
    <div class="sub-menu-section">
      <span class="sub-menu-label">Control</span>
      <div class="sub-menu-items-container">
        <div class="sub-menu-item">전체 현황</div>
        <div class="sub-menu-item">관리자 관리</div>
        <div class="sub-menu-item">서비스 그룹 관리</div>
      </div>
    </div>

    <!-- Service Groups 섹션 -->
    <div class="sub-menu-section flex-1">
      <span class="sub-menu-label">Service Groups</span>
      <div class="sub-menu-items-container sub-menu-scroll">
        <div class="sub-menu-item">동아리 모집</div>
        <div class="sub-menu-item">회의실 예약</div>
        <div class="sub-menu-item">통근버스 신청</div>
        <div class="sub-menu-item">캠핑카 이용 신청</div>
      </div>
    </div>

    <!-- 로그아웃 버튼 -->
    <div class="sub-menu-logout-button-container">
      <img src="/public/assets/icons/ic-logout.png" alt="로그아웃" />
      Logout
    </div>
  </div>
</template>

<style scoped>
.sub-bar-contaienr {
  @apply bg-primary h-screen text-white overflow-hidden flex flex-col max-w-[260px];
}

.logo-section {
  @apply w-[100px] mx-[14px] my-[15px];
}

.service-group-create-button-container {
  @apply mx-[11px] max-w-[240px] w-full py-[8px] text-sm flex justify-center items-center border-2 border-white rounded-[3px] mt-[15px] cursor-pointer hover:bg-primary-hover;
}

.sub-menu-section {
  @apply mt-[30px];
}

.sub-menu-label {
  @apply mx-[16px] mb-[10px] block text-sm;
}

.sub-menu-item {
  @apply 
    w-[252px] pl-[30px] py-[10px] text-sm cursor-pointer
    hover:border-l-4
    hover:border-white
    hover:bg-[rgba(255,255,255,0.44)];
}

.sub-menu-logout-button-container {
  @apply flex gap-3 items-center ml-[16px] mb-[20px] text-sm cursor-pointer; 
}

.sub-menu-logout-button-container img {
  @apply w-[15px] h-[15px];
}

.sub-menu-scroll {
  @apply flex-1 overflow-y-auto max-h-[280px];
}
</style>
