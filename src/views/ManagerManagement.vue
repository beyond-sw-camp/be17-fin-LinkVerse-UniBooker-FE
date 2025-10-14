<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
</script>

<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <span>관리자 관리</span>
    </div>

    <!-- 매니저 목록 컴포넌트 -->
    <div class="manage-list-container">
      <!-- 매니저 추가 버튼 -->
      <div class="manage-add-button-container card">
        <img src="/public/assets/icons/ic-plus-circle.png" alt="매니저 추가" />
      </div>

      <!-- 매니저 정보 카드 -->
      <div class="manager-info-card card">
        <div class="card-top">
          <span>김아영</span>
          <img src="/public/assets/icons/ic-delete-trash.png" alt="매니저 삭제" />
        </div>

        <div class="manager-info-row">
            <img src="/public/assets/icons/ic-email.png" alt="이메일" />
            <span>DK8IJE32@gmail.com</span>
        </div>
        <div class="manager-info-row">
            <img src="/public/assets/icons/ic-phone.png" alt="연락처" />
            <span>010-1234-5678</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.manage-list-container {
    @apply flex flex-wrap gap-3 mt-[15px] ml-[4px] pb-[30px];
}

.card {
    @apply rounded-[5px] w-[230px] h-[140px] cursor-pointer;
}

.manage-add-button-container {
    @apply bg-[#F5F5F5] flex justify-center items-center;
}

.manage-add-button-container img {
    @apply w-[45px];
}

.manager-info-card {
    @apply bg-[#F8F8F8] px-[22px] pt-[23px] pb-[21px];
}

.card-top {
    @apply flex justify-between items-center font-medium mb-[22px];
}

.card-top img {
    @apply w-[16px] h-[16px] cursor-pointer;
}

.manager-info-row {
    @apply flex items-center gap-3 mb-[8px];
}

.manager-info-row span {
    @apply text-[14px] max-w-[156px] truncate;
}

.manager-info-row img {
    @apply w-[16px] h-[16px];
}
</style>
