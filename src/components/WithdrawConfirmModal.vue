<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'confirm'])

// 비밀번호 입력
const password = ref('')
const agreeChecked = ref(false)

/**
 * 회원탈퇴 확인
 */
const handleConfirm = () => {
  if (!password.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  if (!agreeChecked.value) {
    alert('회원탈퇴에 동의해주세요.')
    return
  }

  emit('confirm', password.value)
}

/**
 * 모달 닫기
 */
const handleClose = () => {
  password.value = ''
  agreeChecked.value = false
  emit('close')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2 class="modal-title">회원탈퇴 확인</h2>
        <button @click="handleClose" class="modal-close-button">✕</button>
      </div>

      <!-- 모달 바디 -->
      <div class="modal-body">
        <!-- 경고 메시지 -->
        <div class="warning-box">
          <p class="warning-title">⚠️ 회원탈퇴 시 주의사항</p>
          <ul class="warning-list">
            <li>모든 예약 정보가 삭제됩니다.</li>
            <li>회원정보 복구가 불가능합니다.</li>
            <li>동일한 이메일로 재가입이 가능합니다.</li>
          </ul>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-field">
          <label for="withdrawPassword" class="form-label"> 비밀번호 확인 </label>
          <Input
            id="withdrawPassword"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="form-input"
          />
        </div>

        <!-- 동의 체크박스 -->
        <div class="agree-box">
          <label class="agree-label">
            <input type="checkbox" v-model="agreeChecked" class="agree-checkbox" />
            <span class="agree-text"> 위 내용을 확인했으며 회원탈퇴에 동의합니다. </span>
          </label>
        </div>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <Button type="button" @click="handleClose" class="cancel-button"> 취소 </Button>
          <Button type="button" @click="handleConfirm" class="confirm-button"> 탈퇴하기 </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

/* 모달 컨테이너 */
.modal-container {
  @apply bg-white rounded-lg w-full max-w-md mx-4;
}

/* 모달 헤더 */
.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-line;
}

.modal-title {
  @apply text-xl font-bold text-gray-600;
}

.modal-close-button {
  @apply text-2xl text-gray-400 hover:text-gray-600 transition-colors;
}

/* 모달 바디 */
.modal-body {
  @apply px-6 py-5;
}

/* 경고 박스 */
.warning-box {
  @apply bg-red-50 border border-red-200 rounded-lg p-4 mb-5;
}

.warning-title {
  @apply text-red-600 font-bold mb-2;
}

.warning-list {
  @apply list-disc list-inside text-sm text-red-600 space-y-1;
}

/* 폼 필드 */
.form-field {
  @apply mb-5;
}

.form-label {
  @apply block text-sm font-medium text-gray-600 mb-2;
}

.form-input {
  @apply w-full;
}

/* 동의 박스 */
.agree-box {
  @apply mb-5;
}

.agree-label {
  @apply flex items-start gap-2 cursor-pointer;
}

.agree-checkbox {
  @apply mt-1 w-4 h-4 cursor-pointer;
}

.agree-text {
  @apply text-sm text-gray-600;
}

/* 버튼 그룹 */
.button-group {
  @apply flex gap-3;
}

.cancel-button {
  @apply flex-1 py-2 bg-white text-gray-600 border border-gray-line;
  @apply hover:bg-gray-100 transition-all duration-200;
}

.confirm-button {
  @apply flex-1 py-2 bg-red-600 text-white;
  @apply hover:bg-red-700 transition-all duration-200;
}
</style>
