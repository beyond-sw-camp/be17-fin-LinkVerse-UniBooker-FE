<script setup>
import { ref } from 'vue'
import Input from './Input.vue'
import Dropdown from './Dropdown.vue'

const props = defineProps({
  customFields: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['add-field', 'delete-field'])

const modalFieldName = ref('')
const modalFieldType = ref('')
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

const types = ref([
  { label: '숫자', value: 'NUMBER' },
  { label: '텍스트', value: 'TEXT' },
  { label: '날짜', value: 'DATE' },
  { label: '시간', value: 'TIME' },
  { label: '단일선택', value: 'RADIO' },
  { label: '다중선택', value: 'CHECKBOX' },
  { label: '여부확인', value: 'BOOLEAN' },
])

const addFieldFromModal = () => {
  if (!modalFieldName.value) return
  emit('add-field', {
    name: modalFieldName.value,
    type: modalFieldType.value,
  })
  modalFieldName.value = ''
  modalFieldType.value = 'TEXT'
  closeModal()
}
</script>

<template>
  <!-- 커스텀 필드 반복 -->
  <div class="field-box" v-for="(field, index) in customFields" :key="index">
    <Input
      class="input-style"
      type="text"
      v-model="field.name"
      placeholder="항목명"
      :disabled="true"
    />
    <Input
      class="input-style !w-[150px]"
      :options="types"
      v-model="field.type"
      placeholder="데이터 타입"
      :disabled="true"
    />
    <div class="field-delete-button">
      <img src="/public/assets/icons/ic-delete-dark-gray.png" alt="삭제" />
    </div>
  </div>

  <!-- 커스텀 필드 추가 버튼 -->
  <div class="field-box mt-[10px]">
    <div class="fake-input-style">항목명</div>
    <div class="fake-dropdown-style">
      <span>데이터 타입</span>
      <img src="/public/assets/icons/ic-down-arrow-black.png" alt="드롭다운" />
    </div>
    <button class="add-button-style" @click="openModal">
      <img src="/public/assets/icons/ic-plus-white.png" alt="추가" />
    </button>
  </div>

  <!-- 커스텀 필드 추가 모달 -->
  <Modal :open="isModalOpen" @close="isModalOpen = false">
    <div class="modal-container">
      <h3>입력 항목 추가</h3>

      <div class="add-field-items-container">
        <div class="field-label-container">항목명 <span>*</span></div>
        <input
          class="modal-input-focus-style"
          type="text"
          v-model="modalFieldName"
          placeholder="항목명을 작성해주세요."
        />
      </div>

      <div class="add-field-items-container">
        <div class="field-label-container">항목 설명 <span>*</span></div>
        <textarea placeholder="항목 설명을 작성해주세요."></textarea>
      </div>

      <div class="add-field-items-container">
        <div class="field-label-container">항목 데이터 타입 <span>*</span></div>
        <Dropdown
          class="dropdown-style"
          :options="types"
          v-model="modalFieldType"
          placeholder="데이터 타입"
          bgColor="gray"
          :maxHeight="'20vh'"
        />
      </div>

      <div class="button-container">
        <Button @click="closeModal" theme="gray">취소</Button>
        <Button @click="addFieldFromModal">추가</Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.field-box {
  @apply flex items-center gap-2;
}

.input-style {
  @apply w-[300px] text-[14px];
}

.add-button-style {
  @apply rounded-[3px] bg-gray-300 hover:bg-gray-400 flex justify-center items-center w-[42px] h-[42px];
}

.add-button-style img {
  @apply w-[20px];
}

.fake-input-style {
  @apply px-2.5 py-2.5 rounded bg-white w-48 text-[14px];
}

.fake-dropdown-style {
  @apply flex items-center gap-3 rounded px-3.5 py-2.5 bg-white h-[42px] text-[14px];
}

.fake-dropdown-style img {
  @apply w-[16px] h-[16px];
}

.modal-container {
  @apply px-[30px] py-[20px] flex flex-col;
}

h3 {
  @apply text-[18px] font-medium mb-[10px];
}

.add-field-items-container {
  @apply flex flex-col gap-1 mt-[15px];
}

.field-label-container {
  @apply text-[14px];
}

.field-label-container span {
  @apply text-[#FF2222];
}

.add-field-items-container input,
.add-field-items-container textarea {
  @apply bg-gray-line px-[10px] py-[10px] text-[14px] rounded-[3px];
}

.modal-input-focus-style,
textarea {
  @apply border-b-2 focus:border-primary;
}

textarea {
  @apply resize-none rounded placeholder-gray-400 outline-none transition-all duration-200 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-[14px] px-2.5 py-2.5 w-full min-w-[490px] h-[125px];
}

.dropdown-style {
  @apply text-[14px];
}

.button-container {
  @apply mt-[50px] w-full flex gap-2;
}

.button-container button {
  @apply flex-1;
}

.field-delete-button {
  @apply rounded-[3px] flex justify-center items-center w-[22px] h-[22px] cursor-pointer;
}

.field-delete-button img {
  @apply w-[10px];
}
</style>
