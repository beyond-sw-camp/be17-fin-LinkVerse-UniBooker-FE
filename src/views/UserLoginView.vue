<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

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
  <div class="user-login-page">
    <!-- 헤더 컴포넌트 -->
    <UserHeader class="user-login-header" />

    <!-- 메인 컨텐츠 -->
    <main class="user-login-main">
      <!-- 환영 메시지 -->
      <div class="user-login-welcome">
        <span class="user-login-welcome-text">환영합니다!</span>
        <span class="user-login-welcome-highlight">한화시스템</span>
        <span class="user-login-welcome-text">예약서비스입니다.</span>
      </div>

      <!-- 로그인 카드 -->
      <div class="user-login-card">
        <h2 class="user-login-title">로그인</h2>

        <form @submit.prevent="handleLogin" class="user-login-form">
          <!-- 아이디/비밀번호 입력 -->
          <div class="user-login-fields">
            <!-- 아이디 입력 -->
            <div class="user-login-field">
              <label for="userId" class="user-login-label">아이디</label>
              <Input
                id="userId"
                v-model="formData.userId"
                type="text"
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
  @apply flex-1 w-[250px] border border-gray-300 rounded-sm text-sm;
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
