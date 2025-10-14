<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

const isEditModalOpen = ref(false)
const isAddModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const openAddModal = () => {
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
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
      <div class="manage-add-button-container card" @click="openAddModal">
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
        <div class="edit-modal-button-container">
          <button class="delete-button">계정삭제</button>
          <Button id="edit-button">수정</Button>
        </div>
      </div>
    </Modal>

    <!-- 관리자 추가 버튼 클릭 시 뜨는 모달 -->
    <Modal :open="isAddModalOpen" @close="isAddModalOpen = false">
      <div class="add-modal-container">
        <h3>관리자 추가</h3>
        <p>
          기업의 관리자를 추가할 수 있습니다. 입력하신 이메일로 가입에 필요한 계정 정보(이메일 및
          비밀번호)가 발송됩니다. 정확한 안내를 위해 이메일 주소를 신중하게 입력해주세요.
        </p>

        <div class="input-field-container">
          <div class="input-field-item">
            <label>이름 <span>*</span></label>
            <input type="text" placeholder="관리자의 이름을 입력해주세요." />
          </div>
          <div class="input-field-item">
            <label>이메일 <span>*</span></label>
            <input type="email" placeholder="관리자의 이메일을 입력해주세요." />
          </div>
          <div class="input-field-item">
            <label>연락처 <span>*</span></label>
            <input type="phone" placeholder="관리자의 연락처를 입력해주세요." />
          </div>
        </div>

        <div class="add-modal-button-container">
          <button class="delete-button">취소</button>
          <Button id="add-button">추가하기</Button>
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

.edit-modal-button-container {
  @apply mt-[40px] flex gap-3;
}

.edit-modal-button-container button,
.add-modal-button-container button {
  @apply rounded-[5px] text-center py-[8px] flex-1 text-[14px] font-medium;
}

.delete-button {
  @apply bg-gray-deep text-text hover:bg-[#c8c8c8];
}

#edit-button {
  @apply text-white px-0;
}

.edit-modal-container input {
  @apply border-b border-gray-deep;
}

/* 관리자 추가 모달 스타일 */
.add-modal-container {
  @apply px-[30px] py-[20px] flex flex-col;
}

h3 {
  @apply text-[18px] font-medium mb-[3px];
}

.add-modal-container p {
  @apply text-[12px] text-gray-dark;
}

.input-field-container {
  @apply mt-[35px] flex flex-col gap-6;
}

.input-field-item {
  @apply flex flex-col gap-1;
}

label {
  @apply text-[14px];
}

.input-field-item span {
  @apply text-[#FF2222];
}

.add-modal-container input {
  @apply bg-gray-line px-[14px] py-[10px] text-[14px] rounded-[3px];
}

.add-modal-button-container {
  @apply flex gap-3 mt-[70px];
}

.add-modal-button-container button {
  @apply py-[10px];
}

#add-button {
  @apply px-0;
}
</style>
