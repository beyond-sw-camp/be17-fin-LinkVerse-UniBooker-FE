<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'

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
  <div class="signup-page">
    <!-- 헤더 컴포넌트 -->
    <UserHeader />

    <!-- 메인 컨텐츠 -->
    <main class="signup-main">
      <div class="components-card w-full max-w-md">
        <h1 class="signup-title">회원가입</h1>

        <form @submit.prevent="handleSubmit" class="signup-form">
          <!-- 아이디 -->
          <div class="signup-field">
            <label for="userId" class="signup-label">아이디</label>
            <div class="components-input-with-button-wrapper flex-1">
              <input
                id="userId"
                v-model="formData.userId"
                type="text"
                placeholder="아이디"
                class="components-input-with-button w-full"
              />
              <button type="button" @click="checkDuplicate" class="components-btn-check-inside">
                중복확인
              </button>
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="signup-field">
            <label for="password" class="signup-label mt-4">비밀번호</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="비밀번호"
              class="components-input-field flex-1"
            />
          </div>

          <!-- 비밀번호 확인 -->
          <div class="signup-field">
            <input
              id="passwordConfirm"
              v-model="formData.passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              class="components-input-field flex-1 mb-4"
            />
          </div>

          <!-- 이름 -->
          <div class="signup-field">
            <label for="name" class="signup-label">이름</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="이름"
              class="components-input-field flex-1"
            />
          </div>

          <!-- 전화번호 -->
          <div class="signup-field">
            <label for="phone" class="signup-label">전화번호</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="전화번호"
              class="components-input-field flex-1 mb-[30px]"
            />
          </div>

          <!-- 회원가입 버튼 -->
          <button type="submit" class="components-sq-btn w-[300px]">회원가입</button>
        </form>
      </div>
    </main>

    <!-- 푸터 컴포넌트 -->
    <UserFooter />
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.signup-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.signup-main {
  @apply flex-1 flex items-center justify-center py-5 px-4;
}

/* 회원가입 카드 */
.signup-card {
  @apply bg-white rounded-[20px] shadow-lg w-full max-w-md;
}

.signup-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.signup-form {
  @apply flex flex-col items-center;
}

.signup-field {
  @apply flex flex-col items-start w-full max-w-[300px] mb-[10px];
}

.signup-label {
  @apply block text-[13px] font-medium text-gray-600 px-1;
}

.signup-input-group {
  @apply flex gap-2;
}
</style>
