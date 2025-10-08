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
  <nav class="navbar w-full max-w-[1194px]">
    <!-- 로고 -->
    <img
      src="@/assets/icons/unibooker_logo.svg"
      alt="UniBooker Logo"
      class="navbar-logo cursor-pointer"
      @click="goToHome"
    />

    <!-- 메뉴 -->
    <div class="navbar-menu">
      <a class="navbar-link" @click="goToServiceIntro">서비스 소개</a>
      <a class="navbar-link" @click="goToInquiry">문의하기</a>
      <a class="navbar-link" @click="goToSignup">사용 신청하기</a>
    </div>

    <!-- 로그인 버튼 -->
    <button class="btn btn-primary btn-small" @click="goToLogin">로그인 / 회원가입</button>
  </nav>
</template>

<style scoped>
/* 컴포넌트별 추가 스타일이 필요한 경우 여기에 작성 */
</style>
