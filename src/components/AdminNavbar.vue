<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 네비게이션 핸들러
const goToHome = () => {
  router.push('/')
}

const goToServiceIntro = () => {
  router.push('/service')
}

const goToInquiry = () => {
  router.push('/inquiry')
}

const goToSignup = () => {
  router.push('/admin/signup')
}

const goToLogin = () => {
  router.push('/admin/login')
}
</script>

<template>
  <nav class="navbar">
    <!-- 포지셔닝은 템플릿에서 Tailwind로 직접 -->
    <div class="navbar-container flex items-center justify-between px-5">
      <img
        src="/public/assets/images/unibooker_blue_logo.svg"
        alt="UniBooker Logo"
        class="navbar-logo pl-2"
        @click="goToHome"
      />

      <!-- 메뉴도 flex items-center 추가 -->
      <div class="navbar-menu items-center pr-20">
        <a class="navbar-link" @click="goToServiceIntro">서비스 소개</a>
        <a class="navbar-link" @click="goToInquiry">사용 신청하기</a>
        <a class="navbar-link" @click="goToSignup">문의하기</a>
      </div>

      <Button class="rounded-[50px] px-8 text-sm font-normal" @click="goToLogin">로그인</Button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  @apply w-full rounded-[25px];
  background-color: #F5F5F5;
}

.navbar-container {
  @apply h-[50px] max-w-7xl mx-auto;
}

.navbar-logo {
  @apply h-[20px] w-auto cursor-pointer transition-all duration-300;
}

.navbar-menu {
  @apply flex gap-[100px];
}

.navbar-link {
  @apply text-gray-700 hover:text-black text-sm font-normal hover:font-medium duration-300 cursor-pointer;
}
</style>
