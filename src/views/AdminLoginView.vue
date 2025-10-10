<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from '@/components/AdminNavbar.vue'

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
  <div class="min-h-screen bg-[#eeeeee] flex flex-col items-center px-4">
    <!-- 네비게이션 -->
    <div class="w-full max-w-[1194px] mt-[30px]">
      <AdminNavbar />
    </div>

    <!-- 메인 카드 -->
    <div class="components-card w-full max-w-[1194px] mt-[30px] w-full">
      <!-- 타이틀 -->
      <div class="text-center mb-20">
        <h1 class="text-[18px] font-semibold text-text mt-[50px]">안녕하세요 관리자님!</h1>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="flex flex-col items-center">
        <div class="flex justify-items-center flex-col">
          <!-- 이메일 -->
          <div class="flex items-center items-start mb-[20px]">
            <label class="min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px]">
              이메일
            </label>
            <input
              v-model="loginForm.email"
              type="email"
              class="input-style"
              placeholder="이메일을 입력해주세요."
            />
          </div>

          <!-- 비밀번호 -->
          <div class="flex items-center items-start mb-[90px]">
            <label class="min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px]">
              비밀번호
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              class="input-style"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <Button type="submit" class="w-[310px] mb-[12px] rounded-[50px] text-sm font-medium"> 로그인 </Button>

        <!-- 회원가입 안내 -->
        <div class="text-xs text-[#CBCBCB] mb-[70px] w-[250px] flex justify-between">
          아직 계정이 없으신가요?
          <span class="cursor-pointer hover:text-primary mr-5" @click="goToSignup">
            사용 신청하기
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.components-card {
  @apply bg-white rounded-[25px] shadow-md p-10;
}

.input-style {
  @apply flex-1 w-[250px] text-sm border-b border-transparent hover:border-gray-line focus:border-gray-line px-2 py-1 outline-none;
}
</style>
