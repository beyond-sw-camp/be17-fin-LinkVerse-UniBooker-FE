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
    <div class="w-full max-w-[1194px] mt-[58px]">
      <AdminNavbar />
    </div>

    <!-- 메인 카드 -->
    <div class="card w-full max-w-[1194px] mt-[30px] w-full">
      <!-- 타이틀 -->
      <div class="text-center mb-12">
        <h1 class="text-[20px] font-semibold mt-[50px] mb-[50px]">안녕하세요 관리자님!</h1>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="flex flex-col items-center">
        <div class="flex justify-items-center flex-col mr-[30px]">
          <!-- 이메일 -->
          <div class="flex items-center mb-[10px]">
            <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]">
              이메일
            </label>
            <input
              v-model="loginForm.email"
              type="email"
              class="input-field flex-1"
              placeholder="이메일을 입력해주세요."
            />
          </div>

          <!-- 비밀번호 -->
          <div class="flex items-center mb-[80px]">
            <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]">
              비밀번호
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              class="input-field flex-1"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="btn btn-primary btn-middle mb-[14px]">로그인</button>

        <!-- 회원가입 안내 -->
        <div class="text-[12px] text-[#cbcbcb] mb-[50px]">
          아직 계정이 없으신가요?
          <span class="cursor-pointer hover:text-primary ml-1" @click="goToSignup">
            가입 신청하기
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
