<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import adminApi from '@/services/admin/admin_api'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

// 비밀번호 유효성 검증 상태
const passwordValidation = computed(() => {
  const password = passwordForm.newPassword
  return {
    length: password.length >= 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  }
})

// 비밀번호 일치 여부
const passwordMatch = computed(() => {
  return (
    passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.confirmPassword !== ''
  )
})

// 모든 유효성 검증 통과 여부
const isValidPassword = computed(() => {
  return (
    passwordValidation.value.length &&
    passwordValidation.value.hasLowerCase &&
    passwordValidation.value.hasUpperCase &&
    passwordValidation.value.hasNumber &&
    passwordValidation.value.hasSpecialChar &&
    passwordMatch.value
  )
})

// 비밀번호 재설정 처리
const handlePasswordReset = async () => {
  // 기본 유효성 검증
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    errorMessage.value = '모든 항목을 입력해주세요.'
    return
  }

  // 비밀번호 규칙 검증
  if (!isValidPassword.value) {
    errorMessage.value = '비밀번호 규칙을 모두 충족해주세요.'
    return
  }

  // 비밀번호 일치 검증
  if (!passwordMatch.value) {
    errorMessage.value = '새 비밀번호가 일치하지 않습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // API 호출
    const response = await adminApi.resetPassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    })

    // 성공 처리
    alert(
      '✅ 비밀번호가 성공적으로 변경되었습니다!\n\n이제 UniBooker의 모든 기능을 이용하실 수 있습니다.',
    )

    // 대시보드로 이동
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1000)
  } catch (error) {
    console.error('비밀번호 변경 실패:', error)

    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = '비밀번호 변경에 실패했습니다. 다시 시도해주세요.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="admin-password-reset-container">
    <div class="admin-password-reset-card">
      <!-- 헤더 영역 -->
      <div class="admin-password-reset-header">
        <h1 class="admin-password-reset-title">환영합니다 <span>{{ authStore.userName || '관리자' }}</span> 님!</h1>
        <p class="admin-password-reset-subtitle">계정 보안을 위해 비밀번호를 재설정해 주세요.</p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handlePasswordReset" class="admin-password-reset-form">
        <div class="admin-password-reset-inputs">
          <!-- 임시 비밀번호 -->
          <div class="admin-password-reset-field">
            <label class="admin-password-reset-label">임시 비밀번호</label>
            <Input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="임시 비밀번호를 입력해주세요."
              :disabled="isLoading"
              class="admin-password-input"
            />
          </div>

          <!-- 탭 영역 (동적 업데이트) -->
          <div class="admin-password-reset-tabs">
            <span 
              :class="['admin-password-reset-tab', { active: passwordValidation.length }]"
            >
              8자 이상
            </span>
            <span 
              :class="['admin-password-reset-tab', { active: passwordValidation.hasLowerCase }]"
            >
              소문자
            </span>
            <span 
              :class="['admin-password-reset-tab', { active: passwordValidation.hasUpperCase }]"
            >
              대문자
            </span>
            <span 
              :class="['admin-password-reset-tab', { active: passwordValidation.hasNumber }]"
            >
              숫자
            </span>
            <span 
              :class="['admin-password-reset-tab', { active: passwordValidation.hasSpecialChar }]"
            >
              특수문자
            </span>
          </div>

          <!-- 새 비밀번호 -->
          <div class="admin-password-reset-field">
            <label class="admin-password-reset-label">새 비밀번호</label>
            <Input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
              :disabled="isLoading"
              class="admin-password-input"
            />
          </div>

          <!-- 새 비밀번호 확인 -->
          <div class="admin-password-reset-field">
            <label class="admin-password-reset-label">새 비밀번호 확인</label>
            <Input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="새 비밀번호를 확인해주세요."
              :disabled="isLoading"
              class="admin-password-input"
            />
          </div>
        </div>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="admin-password-reset-error">{{ errorMessage }}</p>

        <!-- 비밀번호 변경 버튼 -->
        <Button type="submit" class="admin-password-reset-button" :disabled="isLoading">
          {{ isLoading ? '변경 중...' : '비밀번호 변경하기' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-password-reset-container {
  @apply min-h-screen bg-[#eeeeee] flex flex-col items-center justify-center px-4;
}

/* 카드 */
.admin-password-reset-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-[1194px] p-20;
}

/* 헤더 영역 */
.admin-password-reset-header {
  @apply text-center mb-10;
}

.admin-password-reset-title {
  @apply text-2xl font-bold text-[#222222] mb-2;
}

.admin-password-reset-subtitle {
  @apply text-base text-gray-600;
}

/* 탭 영역 */
.admin-password-reset-tabs {
  @apply flex justify-between mb-2 max-w-[330px] w-full;
}

.admin-password-reset-tab {
  @apply px-2 py-1 text-xs font-medium rounded-full border border-gray-200 bg-white text-gray-400 
         hover:bg-gray-50 transition-colors;
}

.admin-password-reset-tab.active {
  @apply bg-primary text-white border-primary;
}

/* 폼 영역 */
.admin-password-reset-form {
  @apply flex flex-col items-center;
}

.admin-password-reset-inputs {
  @apply w-full flex flex-col items-center text-sm;
}

/* 입력 필드 */
.admin-password-reset-field {
  @apply flex items-center max-w-[350px] w-full mb-10;
}

.admin-password-reset-label {
  @apply min-w-[100px] text-center text-sm text-gray-600 font-medium mr-4;
}

.admin-password-input {
  @apply w-full text-center text-sm;
}

/* 비밀번호 변경 버튼 */
.admin-password-reset-button {
  @apply w-[350px] rounded-[50px] text-sm font-medium mt-5;
}

/* 에러 메시지 */
.admin-password-reset-error {
  @apply text-red-500 text-sm text-center mt-1;
}
</style>
