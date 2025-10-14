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
  passwordConfirm: '',
  name: '',
  phone: '',
})

const checkDuplicate = () => {
  console.log('아이디 중복 확인:', formData.userId)
}

const handleSubmit = () => {
  console.log('회원가입 제출:', formData)
}
</script>

<template>
  <div class="user-signup-page">
    <!-- 헤더 컴포넌트 -->
    <UserHeader />

    <!-- 메인 컨텐츠 -->
    <main class="user-signup-main">
      <div class="user-signup-card">
        <h1 class="user-signup-title">회원가입</h1>

        <form @submit.prevent="handleSubmit" class="user-signup-form">
          <!-- 아이디 -->
          <div class="user-signup-field">
            <label for="userId" class="user-signup-label">아이디</label>
            <div class="user-signup-input-with-button">
              <Input
                id="userId"
                v-model="formData.userId"
                type="text"
                placeholder="아이디"
                class="user-signup-input"
              />
              <button type="button" @click="checkDuplicate" class="user-signup-check-button">
                중복확인
              </button>
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="user-signup-field">
            <label for="password" class="user-signup-label">비밀번호</label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="비밀번호"
              class="user-signup-input"
            />
          </div>

          <!-- 비밀번호 확인 -->
          <div class="user-signup-field">
            <Input
              id="passwordConfirm"
              v-model="formData.passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              class="user-signup-input user-signup-input-spacing"
            />
          </div>

          <!-- 이름 -->
          <div class="user-signup-field">
            <label for="name" class="user-signup-label">이름</label>
            <Input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="이름"
              class="user-signup-input"
            />
          </div>

          <!-- 전화번호 -->
          <div class="user-signup-field">
            <label for="phone" class="user-signup-label">전화번호</label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="전화번호"
              class="user-signup-input user-signup-input-last"
            />
          </div>

          <!-- 회원가입 버튼 -->
          <button type="submit" class="user-signup-submit-button">회원가입</button>
        </form>
      </div>
    </main>

    <!-- 푸터 컴포넌트 -->
    <UserFooter />
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.user-signup-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.user-signup-main {
  @apply flex-1 flex items-center justify-center py-5 px-4;
}

/* 회원가입 카드 */
.user-signup-card {
  @apply bg-white rounded-[20px] shadow-md w-full max-w-md p-10;
}

.user-signup-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.user-signup-form {
  @apply flex flex-col items-center;
}

.user-signup-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-[10px];
}

.user-signup-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1 mt-1;
}

/* 아이디 입력 + 중복확인 버튼 */
.user-signup-input-with-button {
  @apply flex-1 w-full relative;
}

.user-signup-check-button {
  @apply absolute right-2 top-1/2 -translate-y-1/2;
  @apply px-3 py-1.5 bg-[#f5f5f5] border border-gray-400 text-gray-400 rounded-md text-xs font-medium;
  @apply active:bg-primary active:text-white transition-all duration-200 whitespace-nowrap;
}

/* 일반 입력 필드 */
.user-signup-input {
  @apply flex-1 w-full rounded-sm text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* 비밀번호 확인 필드 하단 간격 */
.user-signup-input-spacing {
  @apply mb-[10px];
}

/* 전화번호 필드 하단 간격 */
.user-signup-input-last {
  @apply mb-[30px];
}

/* 회원가입 버튼 */
.user-signup-submit-button {
  @apply w-[300px] py-2 bg-primary text-white rounded-sm font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
}
</style>
