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

        <div class="admin-login-info">
          <!-- 상태확인 안내 -->
          <div class="admin-login-signup">
            회원가입 승인 대기 중이신가요?
            <span class="admin-login-signup-link" @click="goToSignup"> 승인 상태 확인하기 </span>
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
  @apply w-[300px] flex flex-col text-sm ml-[20px];
}

/* 입력 필드 */
.admin-login-field {
  @apply flex items-center mb-5;
}

.admin-login-label {
  @apply min-w-[68px] text-center text-[14px] text-gray-600 font-medium mr-2;
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
</style>
