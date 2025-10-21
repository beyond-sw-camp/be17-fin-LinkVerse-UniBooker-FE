<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import adminApi from '@/services/admin/admin_api'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  // 유효성 검증
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // API 호출
    const response = await adminApi.login(loginForm)
    const data = response.data.data

    // Pinia store에 저장 (토큰은 쿠키로 자동 관리)
    authStore.login(
      {
        userId: data.userId,
        name: data.name,
        email: data.email,
      },
      data.role,
      data.companyId,
      null, // companySlug (필요시 추가)
    )

    // 첫 로그인이면 비밀번호 변경 페이지로
    if (data.passwordChangeRequired) {
      alert('첫 로그인입니다. 비밀번호를 변경해주세요.')
      router.push('/admin/firstPassword') // ✅ 수정: 올바른 URL로 변경
      return
    }

    // 관리자 대시보드로 이동
    alert('로그인 성공!')
    router.push('/admin/dashboard')
  } catch (error) {
    console.error('로그인 실패:', error)

    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = '로그인에 실패했습니다. 다시 시도해주세요.'
    }
  } finally {
    isLoading.value = false
  }
}

const goToSignup = () => {
  router.push('/admin/signup')
}

const goToStatus = () => {
  router.push('/admin/signup/status')
}
</script>

<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="admin-login-header">
        <h1 class="admin-login-title">안녕하세요 관리자님!</h1>
      </div>

      <form @submit.prevent="handleLogin" class="admin-login-form">
        <div class="admin-login-inputs">
          <!-- 이메일 -->
          <div class="admin-login-field">
            <label class="admin-login-label">이메일</label>
            <Input
              v-model="loginForm.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              :disabled="isLoading"
              class="admin-login-input"
            />
          </div>

          <!-- 비밀번호 -->
          <div class="admin-login-field">
            <label class="admin-login-label">비밀번호</label>
            <Input
              v-model="loginForm.password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              :disabled="isLoading"
              class="admin-login-input"
            />
          </div>
        </div>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="admin-login-error">{{ errorMessage }}</p>

        <!-- 로그인 버튼 -->
        <Button type="submit" class="admin-login-button" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </Button>

        <div class="admin-login-info">
          <!-- 상태확인 안내 -->
          <div class="admin-login-signup">
            회원가입 승인 대기 중이신가요?
            <span class="admin-login-signup-link" @click="goToStatus"> 승인 상태 확인하기 </span>
          </div>

          <!-- 회원가입 안내 -->
          <div class="admin-login-signup">
            아직 계정이 없으신가요?
            <span class="admin-login-signup-link" @click="goToSignup"> 사용 신청하기 </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-login-container {
  @apply min-h-screen bg-[#eeeeee] flex flex-col items-center px-4;
}

/* 로그인 카드 */
.admin-login-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-[1194px] p-10 mt-[30px] mb-[50px];
}

/* 헤더 영역 */
.admin-login-header {
  @apply text-center;
}

.admin-login-title {
  @apply text-2xl font-bold text-gray-600 my-10;
}

/* 폼 영역 */
.admin-login-form {
  @apply flex flex-col items-center;
}

.admin-login-inputs {
  @apply max-w-[330px] w-full flex flex-col items-center text-sm;
}

/* 입력 필드 */
.admin-login-field {
  @apply w-full flex justify-center items-center  mb-5;
}

.admin-login-input {
  @apply w-full pr-3;
}

.admin-login-label {
  @apply min-w-[55px] text-center text-sm text-gray-600 font-medium mr-3;
}

/* 로그인 버튼 */
.admin-login-button {
  @apply w-[350px] rounded-[50px] text-sm font-medium mt-10;
}

/* 회원가입 안내 */
.admin-login-info {
  @apply flex flex-col pt-3 pb-10 gap-2;
}

.admin-login-signup {
  @apply text-sm text-gray-400 w-[450px] flex justify-center;
}

.admin-login-signup-link {
  @apply text-gray-600 font-medium hover:text-primary-hover ml-2 underline cursor-pointer bg-transparent border-none;
}

/* 에러 메시지 */
.admin-login-error {
  @apply text-red-500 text-sm text-center mt-2;
}
</style>
