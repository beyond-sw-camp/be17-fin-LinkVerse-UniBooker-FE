<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Dropdown from '@/components/Dropdown.vue'
import userApi from '@/services/user/user_api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ===== 상태 관리 =====

/** 이메일 중복확인 완료 여부 */
const emailChecked = ref(false)

/** 기업 정보 */
const companyInfo = ref(null)

/** 기업 정보 로딩 상태 */
const isLoadingCompany = ref(false)

/** 회원가입 폼 데이터 */
const formData = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',
  gender: '',
  birthDate: '',
  companyId: null,
})

/** 성별 옵션 */
const genderOptions = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' },
]

// ===== 컴포넌트 마운트 =====

onMounted(async () => {
  await loadCompanyInfo()
})

// ===== 기업 정보 로드 =====

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
      formData.companyId = response.data.id // ← companyId 설정
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

// ===== 유효성 검증 =====

/**
 * 이메일 형식 검증
 */
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return formData.email && emailRegex.test(formData.email)
})

/**
 * 비밀번호 형식 검증 (8자 이상, 영문, 숫자, 특수문자 포함)
 */
const isPasswordValid = computed(() => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return formData.password && passwordRegex.test(formData.password)
})

/**
 * 비밀번호 확인 일치 검증
 */
const isPasswordConfirmValid = computed(() => {
  return formData.passwordConfirm && formData.password === formData.passwordConfirm
})

/**
 * 전화번호 형식 검증 (010-XXXX-XXXX)
 */
const isPhoneValid = computed(() => {
  if (!formData.phone) return true
  const phoneRegex = /^010-\d{4}-\d{4}$/
  return phoneRegex.test(formData.phone)
})

// ===== 전화번호 자동 포맷팅 =====

/**
 * 전화번호 자동 하이픈 삽입
 */
const formatPhone = (value) => {
  const numbers = value.replace(/[^\d]/g, '')

  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}

/**
 * 전화번호 입력 핸들러
 */
const handlePhoneInput = (event) => {
  const formatted = formatPhone(event.target.value)
  formData.phone = formatted
}

// ===== 이메일 중복확인 =====

/**
 * 이메일 중복확인
 */
const checkEmail = async () => {
  if (!isEmailValid.value) {
    return
  }

  if (!formData.companyId) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  try {
    const response = await userApi.checkEmailDuplicate(formData.email, formData.companyId)

    if (response.isSuccess) {
      const exists = response.data

      if (exists) {
        alert('이미 해당 서비스에 등록된 이메일입니다.')
        emailChecked.value = false
      } else {
        alert('사용 가능한 이메일입니다.')
        emailChecked.value = true
      }
    } else {
      alert(response.message || '이메일 중복 확인에 실패했습니다.')
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    alert(error.response?.data?.message || '이메일 중복 확인에 실패했습니다.')
  }
}

/**
 * 이메일 입력 변경 시 중복확인 상태 초기화
 */
const resetEmailCheck = () => {
  emailChecked.value = false
}

// ===== 자동 로그인 =====

/**
 * 회원가입 후 자동 로그인 처리
 */
const autoLogin = async (email, password) => {
  try {
    const loginData = {
      email,
      password,
      companyId: formData.companyId,
    }

    const response = await userApi.loginUser(loginData)

    if (response.isSuccess && response.data) {
      const loginResult = response.data

      const userData = {
        userId: loginResult.userId,
        name: loginResult.name,
        email: loginResult.email,
        role: loginResult.role,
        companyId: loginResult.companyId,
      }

      // Store에 로그인 정보 저장 (토큰은 쿠키로 자동 관리)
      authStore.login(
        userData,
        loginResult.role || 'USER',
        loginResult.companyId,
        companyInfo.value.companySlug,
      )

      return true
    }

    return false
  } catch (error) {
    console.error('자동 로그인 실패:', error)
    return false
  }
}

// ===== 회원가입 제출 =====

/**
 * 회원가입 제출 처리
 */
const handleSubmit = async () => {
  // 1. 기업 정보 확인
  if (!formData.companyId) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  // 2. 이메일 중복확인 체크
  if (!emailChecked.value) {
    alert('이메일 중복확인을 해주세요.')
    return
  }

  // 3. 비밀번호 형식 체크
  if (!isPasswordValid.value) {
    alert('비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.')
    return
  }

  // 4. 비밀번호 일치 체크
  if (!isPasswordConfirmValid.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  // 5. 전화번호 형식 체크
  if (formData.phone && !isPhoneValid.value) {
    alert('전화번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)')
    return
  }

  // 6. 필수 입력값 체크
  if (!formData.name) {
    alert('이름을 입력해주세요.')
    return
  }

  try {
    const signUpData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      companyId: formData.companyId,
      phone: formData.phone || null,
      birthDate: formData.birthDate || null,
      gender: formData.gender || null,
    }

    const response = await userApi.signUpUser(signUpData)

    if (response.isSuccess) {
      alert('회원가입이 완료되었습니다!')

      // 자동 로그인 시도
      const loginSuccess = await autoLogin(formData.email, formData.password)

      if (loginSuccess) {
        // 자동 로그인 성공 → 서비스 목록으로 이동
        router.push(`/c/${companyInfo.value.companySlug}/service/list`)
      } else {
        // 자동 로그인 실패 → 로그인 페이지로 이동
        router.push(`/c/${companyInfo.value.companySlug}`)
      }
    } else {
      alert(response.message || '회원가입에 실패했습니다.')
    }
  } catch (error) {
    console.error('회원가입 실패:', error)
    alert(error.response?.data?.message || '회원가입에 실패했습니다.')
  }
}
</script>

<template>
  <div class="user-signup-page">
    <main class="user-signup-main">
      <div class="user-signup-card">
        <!-- 기업명 표시 (추가) -->
        <div v-if="companyInfo" class="company-header">
          <img
            v-if="companyInfo.logoUrl"
            :src="companyInfo.logoUrl"
            alt="기업 로고"
            class="company-logo"
          />
          <h2 class="company-name">{{ companyInfo.companyName }}</h2>
        </div>

        <h1 class="user-signup-title">회원가입</h1>

        <!-- 로딩 중 표시 -->
        <div v-if="isLoadingCompany" class="loading-message">기업 정보를 불러오는 중...</div>

        <form v-else @submit.prevent="handleSubmit" class="user-signup-form">
          <!-- 이메일 -->
          <div class="user-signup-field">
            <label for="email" class="user-signup-label">이메일</label>
            <div class="user-signup-input-with-button">
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="이메일"
                class="user-signup-input"
                :class="{
                  'input-error': formData.email && !isEmailValid,
                  'input-success': isEmailValid && emailChecked,
                }"
                @input="resetEmailCheck"
              />
              <Button
                type="button"
                @click="checkEmail"
                :disabled="!isEmailValid"
                class="user-signup-check-button"
              >
                중복확인
              </Button>
            </div>
            <p v-if="formData.email && !isEmailValid" class="input-hint error">
              올바른 이메일 형식이 아닙니다.
            </p>
            <p v-if="emailChecked" class="input-hint success">사용 가능한 이메일입니다.</p>
          </div>

          <!-- 비밀번호 -->
          <div class="user-signup-field">
            <label for="password" class="user-signup-label">비밀번호</label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="8자 이상 영문,숫자,특수문자를 포함해야 합니다."
              class="user-signup-input"
              :class="{
                'input-error': formData.password && !isPasswordValid,
                'input-success': isPasswordValid,
              }"
            />
            <p v-if="formData.password && !isPasswordValid" class="input-hint error">
              8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
            </p>
            <p v-if="isPasswordValid" class="input-hint success">안전한 비밀번호입니다.</p>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="user-signup-field">
            <Input
              id="passwordConfirm"
              v-model="formData.passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              class="user-signup-input user-signup-input-spacing"
              :class="{
                'input-error': formData.passwordConfirm && !isPasswordConfirmValid,
                'input-success': isPasswordConfirmValid,
              }"
            />
            <p v-if="formData.passwordConfirm && !isPasswordConfirmValid" class="input-hint error">
              비밀번호가 일치하지 않습니다.
            </p>
            <p v-if="isPasswordConfirmValid" class="input-hint success">비밀번호가 일치합니다.</p>
          </div>

          <!-- 이름 -->
          <div class="user-signup-field">
            <label for="name" class="user-signup-label">이름</label>
            <Input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="이름"
              class="user-signup-input"
            />
          </div>

          <!-- 전화번호 -->
          <div class="user-signup-field">
            <label for="phone" class="user-signup-label">전화번호</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="010-1234-5678"
              maxlength="13"
              class="input-base w-full"
              :class="{
                'input-error': formData.phone && !isPhoneValid,
                'input-success': formData.phone && isPhoneValid,
              }"
              @input="handlePhoneInput"
            />
            <p v-if="formData.phone && !isPhoneValid" class="input-hint error">
              전화번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)
            </p>
          </div>

          <!-- 성별 -->
          <div class="user-signup-field">
            <label for="gender" class="user-signup-label">성별</label>
            <Dropdown
              id="gender"
              v-model="formData.gender"
              :options="genderOptions"
              placeholder="성별 선택"
              width="w-full"
              class="user-sigup-gender"
            />
          </div>

          <!-- 생년월일 -->
          <div class="user-signup-field">
            <label for="birthDate" class="user-signup-label">생년월일</label>
            <Input
              id="birthDate"
              v-model="formData.birthDate"
              type="date"
              class="user-signup-input user-signup-input-last user-sigup-date"
            />
          </div>

          <!-- 회원가입 버튼 -->
          <Button type="submit" class="user-signup-submit-button">회원가입</Button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 기업 헤더 (추가) */
.company-header {
  @apply flex flex-col items-center mb-4 pb-4 border-b border-gray-200;
}

.company-logo {
  @apply w-16 h-16 object-contain mb-2;
}

.company-name {
  @apply text-lg font-semibold text-gray-700;
}

.loading-message {
  @apply text-center text-gray-600 py-10;
}

/* 기존 스타일 유지 */
.user-signup-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.user-signup-main {
  @apply flex-1 flex items-center justify-center py-5 px-4;
}

.user-signup-card {
  @apply bg-white rounded-[20px] shadow-md w-full max-w-md p-10;
}

.user-signup-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

.user-signup-form {
  @apply flex flex-col items-center;
}

.user-signup-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-[10px];
}

.user-signup-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1 mt-1;
}

.user-signup-input-with-button {
  @apply flex-1 w-full relative;
}

.user-signup-check-button {
  @apply absolute right-2 top-1/2 -translate-y-1/2;
  @apply px-3 py-1.5 rounded-md text-xs font-medium;
  @apply transition-all duration-200 whitespace-nowrap;
  @apply bg-[#f5f5f5] border border-gray-400 text-gray-400 cursor-not-allowed opacity-50;
}

.user-signup-check-button:not([disabled]) {
  @apply bg-primary text-white border-primary cursor-pointer opacity-100;
}

.user-signup-input {
  @apply flex-1 w-full rounded-sm text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  @apply placeholder-gray-400 transition-all duration-200;
}

.input-error {
  @apply border-red-500 focus:ring-red-500;
}

.input-success {
  @apply border-green-500 focus:ring-green-500;
}

.input-hint {
  @apply text-xs mt-1 px-2;
}

.input-hint.error {
  @apply text-red-500;
}

.input-hint.success {
  @apply text-green-600;
}

.user-signup-input-spacing {
  @apply mb-[10px];
}

.user-signup-input-last {
  @apply mb-[30px];
}

.user-sigup-gender {
  @apply text-gray-400 text-sm;
}

.user-sigup-date {
  @apply text-gray-400;
}

.input-base {
  @apply px-2.5 py-2.5 rounded placeholder-gray-400 hover:placeholder-gray-600 outline-none border-b-2 transition-all duration-200 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.user-signup-submit-button {
  @apply w-[300px] py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
}
</style>
