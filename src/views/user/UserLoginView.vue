<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import userApi from '@/services/user/user_api'
import { useAuthStore } from '@/stores/UseStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const companyInfo = ref(null)
const isLoadingCompany = ref(false)

const formData = reactive({
  email: '',
  password: '',
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

// ========== 로그인 처리 ==========

/**
 * 로그인 처리
 * - 이메일/비밀번호 검증
 * - API 호출 (쿠키는 자동으로 설정됨)
 * - companyId, companySlug 저장
 */
const handleLogin = async () => {
  if (!companyInfo.value) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }

  if (!formData.password) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  try {
    const loginData = {
      email: formData.email,
      password: formData.password,
      companyId: companyInfo.value.id,
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

      // Store의 login 메서드 호출 (토큰은 쿠키로 자동 저장됨)
      authStore.login(
        userData,
        loginResult.role || 'USER',
        loginResult.companyId,
        companyInfo.value.companySlug,
      )

      console.log('✅ Store 로그인 상태:', authStore.isLoggedIn)
      console.log('✅ Store 역할:', authStore.role)
      console.log('✅ Store 기업 ID:', authStore.companyId)
      console.log('✅ Store 기업 Slug:', authStore.companySlug)

      // 로그인 후 리다이렉트
      if (loginResult.passwordChangeRequired) {
        alert('첫 로그인입니다. 비밀번호를 변경해주세요.')
        router.push(`/c/${companyInfo.value.companySlug}/change-password`)
      } else {
        alert('로그인 성공!')
        router.push(`/c/${companyInfo.value.companySlug}/services`)
      }
    } else {
      alert(response.message || '로그인에 실패했습니다.')
    }
  } catch (error) {
    console.error('로그인 실패:', error)

    const errorMessage = error.response?.data?.message

    if (errorMessage) {
      if (errorMessage.includes('이메일') || errorMessage.includes('비밀번호')) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.')
      } else if (errorMessage.includes('승인')) {
        alert('관리자 승인 대기 중입니다.')
      } else if (errorMessage.includes('정지')) {
        alert('정지된 계정입니다. 관리자에게 문의하세요.')
      } else if (errorMessage.includes('탈퇴')) {
        alert('탈퇴한 계정입니다.')
      } else {
        alert(errorMessage)
      }
    } else {
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }
}

// ========== 회원가입 페이지 이동 ==========

const goToSignup = () => {
  if (companyInfo.value) {
    router.push(`/c/${companyInfo.value.companySlug}/signup`)
  } else {
    alert('기업 정보를 불러오는 중입니다.')
  }
}

// ========== 아이디/비밀번호 찾기 (TODO) ==========

const goToFindId = () => {
  alert('아이디 찾기 기능은 준비 중입니다.')
}

const goToFindPassword = () => {
  alert('비밀번호 찾기 기능은 준비 중입니다.')
}
</script>

<template>
  <div class="user-login-page">
    <!-- 메인 컨텐츠 -->
    <main class="user-login-main">
      <!-- 환영 메시지 -->
      <div v-if="companyInfo" class="user-login-welcome">
        <span class="user-login-welcome-text">환영합니다!</span>
        <span class="user-login-welcome-highlight">{{ companyInfo.companyName }}</span>
        <span class="user-login-welcome-text">예약서비스입니다.</span>
      </div>

      <!-- 로딩 중 -->
      <div v-else class="user-login-welcome">
        <span class="user-login-welcome-text">로딩 중...</span>
      </div>

      <!-- 로그인 카드 -->
      <div class="user-login-card">
        <h2 class="user-login-title">로그인</h2>

        <form @submit.prevent="handleLogin" class="user-login-form">
          <!-- 아이디/비밀번호 입력 -->
          <div class="user-login-fields">
            <!-- 아이디 입력 -->
            <div class="user-login-field">
              <label for="email" class="user-login-label">이메일</label>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="이메일"
                class="user-login-input"
              />
            </div>

            <!-- 비밀번호 입력 -->
            <div class="user-login-field">
              <label for="password" class="user-login-label">비밀번호</label>
              <Input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="비밀번호"
                class="user-login-input"
              />
            </div>
          </div>

          <!-- 아이디/비밀번호 찾기 링크 -->
          <div class="user-login-links">
            <button type="button" @click="goToFindId" class="user-login-link">아이디 찾기</button>
            <span class="user-login-divider">|</span>
            <button type="button" @click="goToFindPassword" class="user-login-link">
              비밀번호 찾기
            </button>
          </div>

          <!-- 로그인 버튼 -->
          <Button type="submit" class="user-login-submit-button">로그인</Button>

          <!-- 회원가입 버튼 -->
          <Button type="button" @click="goToSignup" class="user-login-signup-button">
            회원가입
          </Button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.user-login-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.user-login-header {
  @apply w-full mb-[10px];
}

.user-login-main {
  @apply flex-1 flex flex-col items-center justify-center py-8 px-4;
}

/* 환영 메시지 */
.user-login-welcome {
  @apply mb-[20px] text-center;
}

.user-login-welcome-highlight {
  @apply text-xl font-semibold text-primary;
}

.user-login-welcome-text {
  @apply text-lg font-medium text-gray-600 mx-3;
}

/* 로그인 카드 */
.user-login-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-md p-10;
}

.user-login-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.user-login-form {
  @apply flex flex-col items-center;
}

.user-login-fields {
  @apply mb-4;
}

.user-login-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-4;
}

.user-login-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1;
}

.user-login-input {
  @apply flex-1 w-[250px] rounded-sm text-sm;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* 아이디/비밀번호 찾기 링크 */
.user-login-links {
  @apply flex items-center justify-center gap-2 mb-4 w-full;
}

.user-login-link {
  @apply text-sm text-gray-600 hover:text-primary hover:underline hover:font-medium;
  @apply bg-transparent border-none cursor-pointer transition-colors;
}

.user-login-divider {
  @apply text-gray-400 text-sm;
}

/* 로그인 버튼 */
.user-login-submit-button {
  @apply w-[250px] mb-3 py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
}

/* 회원가입 버튼 */
.user-login-signup-button {
  @apply w-[250px] py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
}
</style>
