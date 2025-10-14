<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from '@/components/AdminNavbar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

const router = useRouter()

const loginForm = reactive({
  email: '',
  password: '',
})

const handleLogin = () => {
  // TODO: API 호출
  console.log('로그인 데이터:', loginForm)
  alert('로그인 성공!')
  router.push('/')
}

const goToSignup = () => {
  router.push('/admin/signup')
}
</script>

<template>
  <div class="admin-login-container">
    <!-- 메인 카드 -->
    <div class="admin-login-card">
      <!-- 타이틀 -->
      <div class="admin-login-header">
        <h1 class="admin-login-title">안녕하세요 관리자님!</h1>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="admin-login-form">
        <div class="admin-login-inputs">
          <!-- 이메일 -->
          <div class="admin-login-field">
            <label class="admin-login-label">이메일</label>
            <Input v-model="loginForm.email" type="email" placeholder="이메일을 입력해주세요." />
          </div>

          <!-- 비밀번호 -->
          <div class="admin-login-field">
            <label class="admin-login-label">비밀번호</label>
            <Input
              v-model="loginForm.password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <Button type="submit" class="admin-login-button"> 로그인 </Button>

        <!-- 회원가입 안내 -->
        <div class="admin-login-signup">
          아직 계정이 없으신가요?
          <span class="admin-login-signup-link" @click="goToSignup"> 사용 신청하기 </span>
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
  @apply text-center mb-20;
}

.admin-login-title {
  @apply text-[18px] font-semibold text-gray-600 mt-[50px];
}

/* 폼 영역 */
.admin-login-form {
  @apply flex flex-col items-center;
}

.admin-login-inputs {
  @apply w-[300px] flex flex-col text-sm ml-[20px];
}

/* 입력 필드 */
.admin-login-field {
  @apply flex items-center mb-[20px];
}

.admin-login-field:last-child {
  @apply mb-[90px];
}

.admin-login-label {
  @apply min-w-[68px] text-center text-[14px] text-gray-600 font-medium mr-2;
}

/* 로그인 버튼 */
.admin-login-button {
  @apply w-[310px] rounded-[50px] text-sm font-medium;
}

/* 회원가입 안내 */
.admin-login-signup {
  @apply text-xs text-gray-400 mt-[10px] mb-[67px] w-[250px] flex justify-center;
}

.admin-login-signup-link {
  @apply cursor-pointer hover:text-primary ml-2;
}
</style>
