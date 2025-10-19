<script setup>
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'

// 모달 열림 상태
const showModal = ref(false)

// 선택된 카테고리
const selectedCategory = ref(null)

// 새 필드 입력값
const newFieldName = ref('')
const newFieldType = ref(null)
const newFieldDescription = ref('')

// 카테고리 옵션
const categoryOptions = [
  { label: 'RESERVATION', value: 1 },
  { label: 'SEAT', value: 2 },
  { label: 'EVENT', value: 3 },
]

// 필드 타입 옵션
const typeOptions = [
  { label: '텍스트', value: '텍스트' },
  { label: '숫자', value: '숫자' },
  { label: '시간', value: '시간' },
]

// 현재 등록된 필드 목록
const fields = ref([
  { id: 1, name: '서비스 시작 시간', type: '시간' },
  { id: 2, name: '서비스 종료 시간', type: '시간' },
  { id: 3, name: '이용 시간', type: '숫자' },
  { id: 4, name: '인원수', type: '숫자' },
])

// 모달 열기
const openModal = () => {
  showModal.value = true
}

// 모달 닫기 및 입력값 초기화
const closeModal = () => {
  showModal.value = false
  newFieldName.value = ''
  newFieldDescription.value = ''
  newFieldType.value = null
}

// 새 필드 추가
const addField = () => {
  // 입력값 없으면 추가 안함
  if (!newFieldName.value || !newFieldDescription.value || !newFieldType.value) return

  const newId = fields.value.length ? fields.value[fields.value.length - 1].id + 1 : 1

  fields.value.push({
    id: newId,
    name: newFieldName.value,
    type: newFieldType.value, // Dropdown에서 선택한 label
  })

  // 입력값 초기화
  newFieldName.value = ''
  newFieldType.value = null
  newFieldDescription.value = ''
  showModal.value = false
}

// 기존 필드 제거
const removeField = (index) => {
  fields.value.splice(index, 1)
}
</script>

<template>
  <!-- 페이지 타이틀 -->
  <span class="components-page-title">커스텀 필드 관리</span>

  <div class="components-white-container">
    <!-- 카테고리 선택 -->
    <Dropdown
      v-model="selectedCategory"
      :options="categoryOptions"
      placeholder="카테고리를 지정해주세요"
      class="w-60"
    />

    <!-- 기존 필드 리스트 -->
    <div class="fields mt-4">
      <div class="field-row" v-for="(field, index) in fields" :key="field.id">
        <div class="field-name">{{ field.name }}</div>
        <div class="field-type">{{ field.type }}</div>
        <button class="remove-btn" @click="removeField(index)">－</button>
      </div>
      <!-- 필드 추가 버튼 -->
      <button class="add-btn" @click="openModal">＋</button>
    </div>

    <!-- 새 필드 추가 모달 -->
    <Modal :open="showModal" :closeOnOverlay="false" @close="closeModal">
      <div class="space-y-4">
        <!-- 필드명 -->
        <div>
          <label class="flex items-center gap-1">
            <span>항목명</span><span class="red-text">*</span>
          </label>
          <Input class="new-field-name" v-model="newFieldName" placeholder="필드명(1~10자)" />
        </div>

        <!-- 필드 설명 -->
        <div>
          <label class="flex items-center gap-1">
            <span>설명</span><span class="red-text">*</span>
          </label>
          <textarea
            v-model="newFieldDescription"
            placeholder="항목 설명을 작성해주세요."
          ></textarea>
        </div>

        <!-- 타입 선택 -->
        <div>
          <label class="flex items-center gap-1">
            <span>타입</span><span class="red-text">*</span>
          </label>
          <Dropdown
            v-model="newFieldType"
            :options="typeOptions"
            placeholder="타입"
            class="new-field-type"
          />
        </div>

        <!-- 버튼 -->
        <div class="btn-container">
          <Button class="cancel-btn" @click="closeModal">취소</Button>
          <Button class="add-btn" @click="addField">추가</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
/* 필드 리스트 간격 */
.fields {
  @apply space-y-2;
}

/* 필드 한 줄 배치 */
.field-row,
.new-field-row {
  @apply flex items-center gap-2;
}

/* 필드명, 타입 배경 */
.field-name,
.field-type {
  @apply bg-gray-100;
}

/* 필드명 입력 영역 */
.field-name,
.new-field-name {
  @apply w-52 p-2 rounded;
}

/* 타입 선택 영역 */
.field-type,
.new-field-type {
  @apply w-28 p-2 rounded;
}

/* 버튼 스타일 */
.fields button {
  @apply w-10 h-10 bg-gray-100;
}
.fields button:hover,
.cancel-btn:hover {
  @apply bg-gray-200;
}
.cancel-btn {
  @apply bg-gray-100 text-black;
}

/* 모달 버튼 컨테이너 */
.btn-container {
  @apply flex gap-3;
}
.btn-container button {
  @apply grow;
}

/* 필수 표시 */
.red-text {
  @apply text-red-500;
}

/* textarea 스타일 */
textarea {
  @apply w-[500px] h-24 rounded-md p-3 border-b-2 resize-none focus:border-primary focus:outline-none;
}
</style>
