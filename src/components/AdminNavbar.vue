<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

const router = useRouter()

// 네비게이션 핸들러
const goToHome = () => {
  router.push('/admin/home')
}

const goToServiceIntro = () => {
  router.push('/admin/service')
}

const goToSignup = () => {
  router.push('/admin/signup')
}

const goToLogin = () => {
  router.push('/admin/login')
}

// 이메일 문의 링크 생성
const inquiryEmailLink = computed(() => {
  const email = 'support@unibooker.com'
  const subject = '[UniBooker 관리자 문의] 제목을 입력하세요'
  const body = `안녕하세요, UniBooker 관리자입니다.

문의 유형: 
(예: 기능 문의, 기술 지원, 계정 문제 등)

문의 내용: 


관리자 정보
- 이름: 
- 소속: 
- 연락처: 
- 이메일: 

---
본 메일은 UniBooker 관리자 문의하기를 통해 작성되었습니다.`

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})
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
      <div class="navbar-menu items-center pr-[65px]">
        <a class="navbar-link" @click="goToServiceIntro">서비스 소개</a>
        <a class="navbar-link" @click="goToSignup">사용 신청하기</a>
        <a class="navbar-link" :href="inquiryEmailLink">문의하기</a>
      </div>

      <Button class="navbar-button" @click="goToLogin"> 로그인 </Button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  @apply w-full max-w-7xl rounded-[25px] shadow-md;
  background-color: #f5f5f5;
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
  @apply text-gray-500 hover:text-primary hover:scale-105 text-sm font-medium hover:font-medium duration-200 cursor-pointer;
}

.navbar-button {
  @apply rounded-full text-sm font-medium py-2 px-4 hover:bg-primary-hover;
}

/* 이메일 링크 특별 스타일 */
.email-link {
  @apply flex items-center gap-2;
}

.email-icon {
  @apply text-[16px] transition-transform duration-300;
}

.email-link:hover .email-icon {
  @apply scale-110;
}
</style>
