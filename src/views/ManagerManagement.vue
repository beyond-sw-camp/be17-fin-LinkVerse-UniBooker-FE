<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}
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
      <div class="manager-info-card card" @click="openEditModal">
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

    <!-- 관리자 카드 클릭 시 뜨는 모달 -->
    <Modal :open="isEditModalOpen" @close="isEditModalOpen = false">
      <div class="edit-modal-container">
        <div class="manager-profile-image">
          <img src="/public/assets/icons/ic-manager-profile.png" alt="관리자 프로필 이미지" />
        </div>
        <div class="manager-name">
          <input type="text" />
          <span>관리자</span>
        </div>
        <div class="manager-info-modal">
          <span>이메일</span>
          <p>test01@test.com</p>
        </div>
        <div class="manager-info-modal">
          <span>연락처</span>
          <input type="text" />
        </div>
        <div class="modal-button-container">
          <button id="delete-button">계정삭제</button>
          <Button id="edit-button">수정</Button>
        </div>
      </div>
    </Modal>
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

/* 관리자 카드 클릭 시 뜨는 모달 스타일 */
.edit-modal-container {
  @apply flex flex-col px-[20px] py-[10px];
}

.manager-profile-image img {
  @apply w-[100px];
}

.manager-name {
  @apply flex items-center gap-2 mt-[18px] mb-[20px] px-[8px];
}

.manager-name input {
  @apply w-[60px] text-[18px] font-medium;
}

.manager-info-modal {
  @apply flex gap-3 mb-[15px] px-[8px] text-[14px];
}

.manager-info-modal P {
    @apply text-gray-dark;
}

.modal-button-container {
  @apply mt-[40px] flex gap-3;
}

.modal-button-container button {
  @apply rounded-[5px] text-center py-[11px] flex-1 text-[14px] font-medium;
}

#delete-button {
  @apply bg-gray-deep text-text hover:bg-[#c8c8c8];
}

#edit-button {
  @apply text-white px-0;
}

input {
    @apply border-b border-gray-deep
}
</style>
