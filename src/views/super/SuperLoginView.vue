<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import superApi from '@/services/super/super_api'
import { connectWebSocket } from '@/utils/webSocket'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

/**
 * 슈퍼 관리자 로그인
 */
const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await superApi.login({
      email: loginForm.email,
      password: loginForm.password,
    })

    const responseData = response.data

    if (responseData.isSuccess) {
      const result = responseData.data 

      authStore.login(
        {
          name: result.name,
          email: loginForm.email,
        },
        'SUPER',
        null,
        null,
      )
      
      // WebSocket 연결
      try {
        console.log('🛰️ 로그인 성공 → WebSocket 연결 시도 중...')
        await connectWebSocket()
        console.log('✅ WebSocket 연결 완료!')
      } catch (wsError) {
        console.error('❌ WebSocket 연결 실패:', wsError)
      }

      alert('로그인 성공!')
      router.push('/super/applications')
    } else {
      errorMessage.value = responseData.message || '로그인에 실패했습니다.'
    }
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
</script>

<template>
  <div class="super-login-container">
    <div class="super-login-card">
      <div class="super-login-header">
        <h1 class="super-login-title">로그인</h1>
        <p class="super-login-subtitle">UniBooker 플랫폼 관리</p>
      </div>

      <form @submit.prevent="handleLogin" class="super-login-form">
        <div class="super-login-inputs">
          <!-- 이메일 -->
          <div class="super-login-field">
            <label class="super-login-label">이메일</label>
            <Input
              v-model="loginForm.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              :disabled="isLoading"
            />
          </div>

          <!-- 비밀번호 -->
          <div class="super-login-field">
            <label class="super-login-label">비밀번호</label>
            <Input
              v-model="loginForm.password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="super-login-error">{{ errorMessage }}</p>

        <!-- 로그인 버튼 -->
        <Button type="submit" class="super-login-button" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.super-login-container {
  @apply min-h-screen bg-[#eeeeee] flex flex-col items-center justify-center px-4;
}

/* 로그인 카드 */
.super-login-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-[500px] p-10;
}

/* 헤더 영역 */
.super-login-header {
  @apply text-center mb-8;
}

.super-login-title {
  @apply text-3xl font-bold text-primary mb-2;
}

.super-login-subtitle {
  @apply text-sm text-gray-500;
}

/* 폼 영역 */
.super-login-form {
  @apply flex flex-col items-center w-full;
}

.super-login-inputs {
  @apply w-full flex flex-col items-center text-sm;
}

/* 입력 필드 */
.super-login-field {
  @apply flex items-center mb-5;
}

.super-login-label {
  @apply min-w-[80px] text-center text-[14px] text-gray-600 font-medium mr-1;
}

/* 로그인 버튼 */
.super-login-button {
  @apply w-full rounded-[50px] text-sm font-medium mt-6;
}

/* 에러 메시지 */
.super-login-error {
  @apply text-red-500 text-sm text-center mt-2;
}
</style>
