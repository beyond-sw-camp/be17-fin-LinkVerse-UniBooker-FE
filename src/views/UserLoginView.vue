<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'

const router = useRouter()

const formData = reactive({
  userId: '',
  password: '',
})

const handleLogin = () => {
  console.log('로그인 시도:', formData)
  // TODO: 로그인 API 호출
}

const goToSignup = () => {
  router.push('/user/signup')
}

const goToFindId = () => {
  console.log('아이디 찾기')
  // TODO: 아이디 찾기 페이지로 이동
}

const goToFindPassword = () => {
  console.log('비밀번호 찾기')
  // TODO: 비밀번호 찾기 페이지로 이동
}
</script>

<template>
  <div class="login-page">
    <!-- 헤더 컴포넌트 -->
    <UserHeader />

    <!-- 메인 컨텐츠 -->
    <main class="login-main">
      <!-- 환영 메시지 -->
      <div class="login-welcome-message">
        <span class="login-welcome-title">환영합니다!</span>
        <span class="login-welcome-title-point">한화시스템</span>
        <span class="login-welcome-title">예약서비스입니다.</span>
      </div>

      <!-- 로그인 카드 -->
      <div class="components-card w-full max-w-md">
        <h2 class="login-title">로그인</h2>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- 아이디 입력 -->
          <div class="login-fields">
            <div class="login-field">
              <label for="userId" class="login-label">아이디</label>
              <input
                id="userId"
                v-model="formData.userId"
                type="text"
                placeholder="이메일"
                class="components-input-field flex-1 w-[250px]"
              />
            </div>

            <!-- 비밀번호 입력 -->
            <div class="login-field">
              <label for="password" class="login-label">비밀번호</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="비밀번호"
                class="components-input-field flex-1 mb-4 w-[250px]"
              />
            </div>
          </div>
          <!-- 아이디/비밀번호 찾기 링크 -->
          <div class="login-links">
            <button type="button" @click="goToFindId" class="login-link">아이디 찾기</button>
            <span class="login-divider">|</span>
            <button type="button" @click="goToFindPassword" class="login-link">
              비밀번호 찾기
            </button>
          </div>

          <!-- 로그인 버튼 -->
          <button type="submit" class="components-sq-btn w-[250px] mb-3">로그인</button>

          <!-- 회원가입 버튼 -->
          <button type="button" @click="goToSignup" class="components-sq-wh-btn w-[250px]">
            회원가입
          </button>
        </form>
      </div>
    </main>

    <!-- 푸터 컴포넌트 -->
    <UserFooter />
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.login-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.login-main {
  @apply flex-1 flex flex-col items-center justify-center py-8 px-4;
}

/* 환영 메시지 */
.login-welcome-message {
  @apply mb-4 text-center;
}

.login-welcome-title-point {
  @apply text-xl font-semibold text-primary;
}

.login-welcome-title {
  @apply text-lg font-medium text-gray-600 mx-3;
}

/* 로그인 카드 */
.login-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.login-form {
  @apply flex flex-col items-center;
}

.login-fields {
  @apply mb-4;
}

.login-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-4;
}

.login-label {
  @apply block text-[13px] font-medium text-gray-600 px-1;
}

/* 아이디/비밀번호 찾기 링크 */
.login-links {
  @apply flex items-center justify-center gap-2 mb-4 w-full;
}

.login-link {
  @apply text-sm text-gray-600 hover:text-primary hover:underline hover:font-medium bg-transparent border-none cursor-pointer transition-colors;
}

.login-divider {
  @apply text-gray-400 text-sm;
}
</style>
