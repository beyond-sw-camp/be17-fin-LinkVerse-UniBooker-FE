<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { getCompanyBySlug, loginUser } from '@/services/user/user_api'

const router = useRouter()
const route = useRoute()

// 기업 정보
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
    const response = await getCompanyBySlug(companySlug)

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

const handleLogin = async () => {
  // 1. 기업 정보 확인
  if (!companyInfo.value) {
    alert('기업 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  // 2. 입력값 검증
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
    }

    const response = await loginUser(loginData)

    if (response.isSuccess && response.data) {
      const loginResult = response.data

      // 토큰 확인
      if (!loginResult.accessToken) {
        alert('로그인 응답에 토큰이 없습니다.')
        return
      }

      // 3. 토큰 저장 (localStorage + sessionStorage 병행)
      try {
        localStorage.setItem('accessToken', loginResult.accessToken)
        sessionStorage.setItem('accessToken', loginResult.accessToken)

        // 4. 사용자 정보 저장
        const userInfo = {
          userId: loginResult.userId,
          name: loginResult.name,
          email: loginResult.email,
          role: loginResult.role,
          companyId: loginResult.companyId,
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

        // 5. 저장 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 300))

        // 저장 검증
        const savedLocal = localStorage.getItem('accessToken')
        const savedSession = sessionStorage.getItem('accessToken')

        console.log('💾 저장 검증:')
        console.log('  localStorage:', savedLocal ? '✅ OK' : '❌ FAIL')
        console.log('  sessionStorage:', savedSession ? '✅ OK' : '❌ FAIL')

        if (!savedLocal && !savedSession) {
          alert('⚠️ 브라우저 저장소 사용 불가. 관리자에게 문의하세요.')
          return
        }

        // 6. 비밀번호 변경 필요 여부 체크
        if (loginResult.passwordChangeRequired) {
          alert('첫 로그인입니다. 비밀번호를 변경해주세요.')
          router.push('/user/change-password')
        } else {
          alert('로그인 성공!')
          router.push('/service/list')
        }
      } catch (storageError) {
        console.error('Storage 저장 실패:', storageError)
        alert('⚠️ 저장 중 오류 발생: ' + storageError.message)
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
    <!-- 헤더 컴포넌트 -->
    <UserHeader class="user-login-header" />

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

    <!-- 푸터 컴포넌트 -->
    <UserFooter />
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
