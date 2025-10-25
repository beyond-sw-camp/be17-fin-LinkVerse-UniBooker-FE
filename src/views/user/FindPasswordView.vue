<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import userApi from '@/services/user/user_api'

const router = useRouter()
const route = useRoute()

const companyInfo = ref(null)
const isLoadingCompany = ref(false)
const isSubmitting = ref(false)

const formData = reactive({
  email: '',
})

// ========== 컴포넌트 마운트 시 기업 정보 로드 ==========

onMounted(async () => {
  await loadCompanyInfo()
})

/**
 * URL에서 companySlug 추출하여 기업 정보 로드
 */
const loadCompanyInfo = async () => {
  const companySlug = route.params.companySlug

  if (!companySlug) {
    alert('잘못된 접근입니다. 기업 링크를 통해 접속해주세요.')
    router.push('/')
    return
  }

  isLoadingCompany.value = true
  try {
    const response = await userApi.getCompanyBySlug(companySlug)

    if (response.isSuccess && response.data) {
      companyInfo.value = response.data
    } else {
      alert('기업 정보를 찾을 수 없습니다.')
      router.push('/')
    }
  } catch (error) {
    console.error('기업 정보 로드 실패:', error)
    alert('기업 정보를 불러오는데 실패했습니다.')
    router.push('/')
  } finally {
    isLoadingCompany.value = false
  }
}

// ========== 비밀번호 찾기 처리 ==========

/**
 * 비밀번호 찾기 처리
 */
const handleResetPassword = async () => {
  if (!companyInfo.value) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    alert('올바른 이메일 형식을 입력해주세요.')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const response = await userApi.resetPassword(formData.email, companyInfo.value.id)

    if (response.isSuccess) {
      alert(response.data || '임시 비밀번호가 이메일로 발송되었습니다.')
      router.push(`/c/${companyInfo.value.companySlug}`)
    } else {
      alert(response.message || '비밀번호 찾기에 실패했습니다.')
    }
  } catch (error) {
    console.error('비밀번호 찾기 실패:', error)

    const errorMessage = error.response?.data?.message

    if (errorMessage) {
      if (errorMessage.includes('찾을 수 없습니다') || errorMessage.includes('존재하지')) {
        alert('등록된 이메일이 아닙니다. 이메일을 확인해주세요.')
      } else if (errorMessage.includes('정지')) {
        alert('정지된 계정입니다. 관리자에게 문의하세요.')
      } else if (errorMessage.includes('이메일 발송')) {
        alert('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      } else {
        alert(errorMessage)
      }
    } else {
      alert('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// ========== 페이지 이동 ==========

const goToLogin = () => {
  if (companyInfo.value) {
    router.push(`/c/${companyInfo.value.companySlug}`)
  }
}
</script>

<template>
  <div class="find-password-page">
    <!-- 메인 컨텐츠 -->
    <main class="find-password-main">
      <!-- 기업명 표시 -->
      <div v-if="companyInfo" class="find-password-welcome">
        <span class="find-password-welcome-highlight">{{ companyInfo.companyName }}</span>
      </div>

      <!-- 로딩 중 -->
      <div v-else class="find-password-welcome">
        <span class="find-password-welcome-text">로딩 중...</span>
      </div>

      <!-- 비밀번호 찾기 카드 -->
      <div class="find-password-card">
        <h2 class="find-password-title">비밀번호 찾기</h2>

        <p class="find-password-description">
          가입하신 이메일 주소를 입력해주세요.<br />
          임시 비밀번호를 발송해드립니다.
        </p>

        <form @submit.prevent="handleResetPassword" class="find-password-form">
          <!-- 이메일 입력 -->
          <div class="find-password-field">
            <label for="email" class="find-password-label">이메일</label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="example@email.com"
              class="find-password-input"
              :disabled="isSubmitting"
            />
          </div>

          <!-- 안내 메시지 -->
          <div class="find-password-notice">
            <p>• 임시 비밀번호는 입력하신 이메일로 발송됩니다.</p>
            <p>• 로그인 후 비밀번호 변경을 권장합니다.</p>
          </div>

          <!-- 임시 비밀번호 발급 버튼 -->
          <Button type="submit" class="find-password-submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? '발송 중...' : '임시 비밀번호 발급' }}
          </Button>

          <!-- 로그인 페이지로 이동 -->
          <Button
            type="button"
            @click="goToLogin"
            class="find-password-back-button"
            :disabled="isSubmitting"
          >
            로그인으로 돌아가기
          </Button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.find-password-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.find-password-main {
  @apply flex-1 flex flex-col items-center justify-center py-8 px-4;
}

/* 기업명 표시 */
.find-password-welcome {
  @apply mb-[20px] text-center;
}

.find-password-welcome-highlight {
  @apply text-xl font-semibold text-primary;
}

.find-password-welcome-text {
  @apply text-lg font-medium text-gray-600;
}

/* 비밀번호 찾기 카드 */
.find-password-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-md p-10;
}

.find-password-title {
  @apply text-[23px] font-bold text-center mb-4 text-gray-600;
}

.find-password-description {
  @apply text-sm text-gray-500 text-center mb-6 leading-relaxed;
}

/* 폼 레이아웃 */
.find-password-form {
  @apply flex flex-col items-center;
}

.find-password-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-4;
}

.find-password-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1;
}

.find-password-input {
  @apply flex-1 w-[300px] rounded-sm text-sm;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* 안내 메시지 */
.find-password-notice {
  @apply w-full max-w-[300px] bg-blue-50 border border-blue-200 rounded-md p-3 mb-10;
}

.find-password-notice p {
  @apply text-xs text-blue-700 mb-1 last:mb-0;
}

/* 버튼 */
.find-password-submit-button {
  @apply w-[300px] mb-3 py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
  @apply disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.find-password-back-button {
  @apply w-[300px] py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
  @apply disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed;
}
</style>
