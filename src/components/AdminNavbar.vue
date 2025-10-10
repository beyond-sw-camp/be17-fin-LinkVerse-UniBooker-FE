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
  <nav class="components-navbar">
    <!-- 포지셔닝은 템플릿에서 Tailwind로 직접 -->
    <div class="components-navbar-container flex items-center justify-between px-5">
      <img
        src="@/assets/icons/unibooker_logo.svg"
        alt="UniBooker Logo"
        class="components-navbar-logo pl-2"
        @click="goToHome"
      />

      <!-- 메뉴도 flex items-center 추가 -->
      <div class="components-navbar-menu items-center pr-20">
        <a class="components-navbar-link" @click="goToServiceIntro">서비스 소개</a>
        <a class="components-navbar-link" @click="goToInquiry">사용 신청하기</a>
        <a class="components-navbar-link" @click="goToSignup">문의하기</a>
      </div>

      <button class="components-btn-small rounded-[20px]" @click="goToLogin">로그인</button>
    </div>
  </nav>
</template>

<style scoped>
/* 이 컴포넌트만의 추가 스타일이 필요한 경우 여기에 작성 */
</style>
