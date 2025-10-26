<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import userApi from '@/services/user/user_api'

const router = useRouter()
const route = useRoute()

const companyInfo = ref(null)
const isLoadingCompany = ref(false)
const isSubmitting = ref(false)
const foundEmail = ref(null)

const formData = reactive({
  name: '',
  phone: '',
  birthDate: '',
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

// ========== 아이디 찾기 처리 ==========

/**
 * 아이디 찾기 처리
 */
const handleFindEmail = async () => {
  if (!companyInfo.value) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!formData.name) {
    alert('이름을 입력해주세요.')
    return
  }

  if (!formData.phone && !formData.birthDate) {
    alert('전화번호 또는 생년월일 중 하나를 입력해주세요.')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const requestData = {
      name: formData.name,
      companyId: companyInfo.value.id,
      phone: formData.phone || null,
      birthDate: formData.birthDate || null,
    }

    const response = await userApi.findEmail(requestData)

    if (response.isSuccess && response.data) {
      foundEmail.value = response.data
    } else {
      alert(response.message || '아이디 찾기에 실패했습니다.')
    }
  } catch (error) {
    console.error('아이디 찾기 실패:', error)

    const errorMessage = error.response?.data?.message

    if (errorMessage) {
      if (errorMessage.includes('찾을 수 없습니다') || errorMessage.includes('존재하지')) {
        alert('일치하는 계정 정보를 찾을 수 없습니다.\n이름, 전화번호, 생년월일을 확인해주세요.')
      } else if (errorMessage.includes('정지')) {
        alert('정지된 계정입니다. 관리자에게 문의하세요.')
      } else {
        alert(errorMessage)
      }
    } else {
      alert('아이디 찾기에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// ========== 전화번호 자동 형식화 ==========

/**
 * 전화번호 입력 시 자동으로 하이픈 추가
 */
watch(
  () => formData.phone,
  (newValue, oldValue) => {
    if (!newValue) return

    // 숫자만 추출
    const numbers = newValue.replace(/[^0-9]/g, '')

    // 최대 11자리까지만
    if (numbers.length > 11) {
      formData.phone = oldValue
      return
    }

    // 형식 적용
    let formatted = ''
    if (numbers.length <= 3) {
      formatted = numbers
    } else if (numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    }

    // 형식이 변경된 경우에만 업데이트 (무한 루프 방지)
    if (formatted !== newValue) {
      formData.phone = formatted
    }
  },
)

// ========== 페이지 이동 ==========

const goToLogin = () => {
  if (companyInfo.value) {
    router.push(`/c/${companyInfo.value.companySlug}`)
  }
}

const goToFindPassword = () => {
  if (companyInfo.value) {
    router.push(`/c/${companyInfo.value.companySlug}/find-password`)
  }
}

const resetForm = () => {
  foundEmail.value = null
  formData.name = ''
  formData.phone = ''
  formData.birthDate = ''
}
</script>

<template>
  <div class="find-id-page">
    <!-- 메인 컨텐츠 -->
    <main class="find-id-main">
      <!-- 기업명 표시 -->
      <div v-if="companyInfo" class="find-id-welcome">
        <span class="find-id-welcome-highlight">{{ companyInfo.companyName }}</span>
      </div>

      <!-- 로딩 중 -->
      <div v-else class="find-id-welcome">
        <span class="find-id-welcome-text">로딩 중...</span>
      </div>

      <!-- 아이디 찾기 카드 -->
      <div class="find-id-card">
        <!-- 결과를 찾지 못한 경우 -->
        <div v-if="!foundEmail">
          <h2 class="find-id-title">아이디 찾기</h2>

          <p class="find-id-description">
            가입 시 입력한 정보를 입력해주세요.<br />
            가입하신 이메일을 찾아드립니다.
          </p>

          <form @submit.prevent="handleFindEmail" class="find-id-form">
            <!-- 이름 입력 -->
            <div class="find-id-field">
              <label for="name" class="find-id-label">이름 *</label>
              <Input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="홍길동"
                class="find-id-input"
                :disabled="isSubmitting"
              />
            </div>

            <!-- 전화번호 입력 -->
            <div class="find-id-field">
              <label for="phone" class="find-id-label">전화번호</label>
              <Input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="010-1234-5678"
                class="find-id-input"
                :disabled="isSubmitting"
              />
            </div>

            <!-- 생년월일 입력 -->
            <div class="find-id-field">
              <label for="birthDate" class="find-id-label">생년월일</label>
              <Input
                id="birthDate"
                v-model="formData.birthDate"
                type="date"
                class="find-id-input"
                :disabled="isSubmitting"
              />
            </div>

            <!-- 안내 메시지 -->
            <div class="find-id-notice">
              <p>• 전화번호 또는 생년월일 중 하나는 반드시 입력해주세요.</p>
              <p>• 가입 시 입력한 정보와 일치해야 찾을 수 있습니다.</p>
            </div>

            <!-- 아이디 찾기 버튼 -->
            <Button type="submit" class="find-id-submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? '검색 중...' : '아이디 찾기' }}
            </Button>

            <!-- 로그인 페이지로 이동 -->
            <Button
              type="button"
              @click="goToLogin"
              class="find-id-back-button"
              :disabled="isSubmitting"
            >
              로그인으로 돌아가기
            </Button>
          </form>
        </div>

        <!-- 결과를 찾은 경우 -->
        <div v-else class="find-id-result">
          <h2 class="find-id-title">아이디 찾기 결과</h2>

          <div class="find-id-result-card">
            <p class="find-id-result-label">가입하신 이메일</p>
            <p class="find-id-result-email">{{ foundEmail.maskedEmail }}</p>
            <p class="find-id-result-date">
              가입일: {{ new Date(foundEmail.createdAt).toLocaleDateString('ko-KR') }}
            </p>
          </div>

          <div class="find-id-actions">
            <Button @click="goToLogin" class="find-id-action-button primary"> 로그인하기 </Button>
            <Button @click="goToFindPassword" class="find-id-action-button"> 비밀번호 찾기 </Button>
            <Button @click="resetForm" class="find-id-action-button"> 다시 찾기 </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.find-id-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.find-id-main {
  @apply flex-1 flex flex-col items-center justify-center py-8 px-4;
}

/* 기업명 표시 */
.find-id-welcome {
  @apply mb-[20px] text-center;
}

.find-id-welcome-highlight {
  @apply text-xl font-semibold text-primary;
}

.find-id-welcome-text {
  @apply text-lg font-medium text-gray-600;
}

/* 아이디 찾기 카드 */
.find-id-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-md p-10;
}

.find-id-title {
  @apply text-[23px] font-bold text-center mb-4 text-gray-600;
}

.find-id-description {
  @apply text-sm text-gray-500 text-center mb-6 leading-relaxed;
}

/* 폼 레이아웃 */
.find-id-form {
  @apply flex flex-col items-center;
}

.find-id-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-4;
}

.find-id-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1;
}

.find-id-input {
  @apply flex-1 w-[300px] rounded-sm text-sm;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* 안내 메시지 */
.find-id-notice {
  @apply w-full max-w-[300px] bg-blue-50 border border-blue-200 rounded-md p-3 mb-10;
}

.find-id-notice p {
  @apply text-xs text-blue-700 mb-1 last:mb-0;
}

/* 버튼 */
.find-id-submit-button {
  @apply w-[300px] mb-3 py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
  @apply disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.find-id-back-button {
  @apply w-[300px] py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
  @apply disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed;
}

/* 결과 표시 */
.find-id-result {
  @apply flex flex-col items-center;
}

.find-id-result-card {
  @apply w-full bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-center;
}

.find-id-result-label {
  @apply text-sm text-gray-600 mb-2;
}

.find-id-result-email {
  @apply text-2xl font-bold text-primary mb-3;
}

.find-id-result-date {
  @apply text-xs text-gray-500;
}

.find-id-actions {
  @apply flex flex-col gap-3 w-full max-w-[250px];
}

.find-id-action-button {
  @apply w-full py-2 font-medium transition-all duration-200;
}

.find-id-action-button.primary {
  @apply bg-primary text-white hover:bg-primary-hover;
}

.find-id-action-button:not(.primary) {
  @apply bg-white text-primary border border-primary hover:bg-gray-100;
}
</style>
