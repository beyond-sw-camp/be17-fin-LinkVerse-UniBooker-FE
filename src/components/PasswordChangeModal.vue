<script setup>
import { reactive, ref, watch } from 'vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

// 비밀번호 데이터
const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 비밀번호 강도 상태
const passwordStrength = ref('')
const passwordStrengthColor = ref('')

// 유효성 검사 메시지
const validationMessage = ref('')

/**
 * 비밀번호 강도 체크
 */
const checkPasswordStrength = () => {
  const password = passwordData.newPassword

  if (!password) {
    passwordStrength.value = ''
    passwordStrengthColor.value = ''
    return
  }

  let strength = 0

  // 길이 체크
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // 영문 포함
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++

  // 숫자 포함
  if (/\d/.test(password)) strength++

  // 특수문자 포함
  if (/[@$!%*#?&]/.test(password)) strength++

  if (strength <= 2) {
    passwordStrength.value = '약함'
    passwordStrengthColor.value = 'text-red-600'
  } else if (strength <= 4) {
    passwordStrength.value = '보통'
    passwordStrengthColor.value = 'text-yellow-600'
  } else {
    passwordStrength.value = '강함'
    passwordStrengthColor.value = 'text-green-600'
  }
}

/**
 * 비밀번호 유효성 검사
 */
const validatePassword = () => {
  validationMessage.value = ''

  // 현재 비밀번호 확인
  if (!passwordData.currentPassword) {
    validationMessage.value = '현재 비밀번호를 입력해주세요.'
    return false
  }

  // 새 비밀번호 확인
  if (!passwordData.newPassword) {
    validationMessage.value = '새 비밀번호를 입력해주세요.'
    return false
  }

  // 비밀번호 형식 검사
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  if (!passwordPattern.test(passwordData.newPassword)) {
    validationMessage.value = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
    return false
  }

  // 새 비밀번호 확인 일치 여부
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    validationMessage.value = '새 비밀번호가 일치하지 않습니다.'
    return false
  }

  // 현재 비밀번호와 새 비밀번호 동일 여부
  if (passwordData.currentPassword === passwordData.newPassword) {
    validationMessage.value = '현재 비밀번호와 다른 비밀번호를 입력해주세요.'
    return false
  }

  return true
}

/**
 * 비밀번호 변경 제출
 */
const handleSubmit = () => {
  if (validatePassword()) {
    emit('submit', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    })
  }
}

/**
 * 모달 닫기
 */
const handleClose = () => {
  // 입력 필드 초기화
  passwordData.currentPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
  passwordStrength.value = ''
  validationMessage.value = ''

  emit('close')
}

// 새 비밀번호 입력 시 강도 체크
watch(
  () => passwordData.newPassword,
  () => {
    checkPasswordStrength()
  },
)
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2 class="modal-title">비밀번호 변경</h2>
        <button @click="handleClose" class="modal-close-button">✕</button>
      </div>

      <!-- 모달 바디 -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- 현재 비밀번호 -->
        <div class="form-field">
          <label for="currentPassword" class="form-label">현재 비밀번호</label>
          <Input
            id="currentPassword"
            v-model="passwordData.currentPassword"
            type="password"
            placeholder="현재 비밀번호"
            class="form-input"
          />
        </div>

        <!-- 새 비밀번호 -->
        <div class="form-field">
          <label for="newPassword" class="form-label">새 비밀번호</label>
          <Input
            id="newPassword"
            v-model="passwordData.newPassword"
            type="password"
            placeholder="새 비밀번호 (8자 이상, 영문, 숫자, 특수문자 포함)"
            class="form-input"
          />
          <!-- 비밀번호 강도 표시 -->
          <p v-if="passwordStrength" :class="['password-strength', passwordStrengthColor]">
            비밀번호 강도: {{ passwordStrength }}
          </p>
        </div>

        <!-- 새 비밀번호 확인 -->
        <div class="form-field">
          <label for="confirmPassword" class="form-label">새 비밀번호 확인</label>
          <Input
            id="confirmPassword"
            v-model="passwordData.confirmPassword"
            type="password"
            placeholder="새 비밀번호 확인"
            class="form-input"
          />
        </div>

        <!-- 유효성 검사 메시지 -->
        <p v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </p>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <Button type="button" @click="handleClose" class="cancel-button"> 취소 </Button>
          <Button type="submit" class="submit-button"> 변경 </Button>
        </div>
      </form>
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

/* 폼 필드 */
.form-field {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-600 mb-2;
}

.form-input {
  @apply w-full;
}

/* 비밀번호 강도 */
.password-strength {
  @apply text-sm font-medium mt-2;
}

/* 유효성 검사 메시지 */
.validation-message {
  @apply text-sm text-red-600 mb-4;
}

/* 버튼 그룹 */
.button-group {
  @apply flex gap-3 mt-6;
}

.cancel-button {
  @apply flex-1 py-2 bg-white text-gray-600 border border-gray-line;
  @apply hover:bg-gray-100 transition-all duration-200;
}

.submit-button {
  @apply flex-1 py-2 bg-primary text-white;
  @apply hover:bg-primary-hover transition-all duration-200;
}
</style>
