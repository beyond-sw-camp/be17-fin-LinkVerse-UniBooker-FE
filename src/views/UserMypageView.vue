<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

const router = useRouter()

// 기존 회원정보 (하드코딩 또는 API에서 가져온 데이터)
const formData = reactive({
  userId: 'user1234@example.com', // 이메일 형식으로 변경
  name: '홍길동',
  phone: '010-1234-5678',
})

const handleUpdateInfo = () => {
  console.log('정보 수정:', formData)
  // API 호출 로직
}

const handleChangePassword = () => {
  console.log('비밀번호 변경')
  router.push('/change-password')
}

const handleLogout = () => {
  console.log('로그아웃')
  router.push('/')
}

const handleWithdrawal = () => {
  if (confirm('정말 회원탈퇴 하시겠습니까?')) {
    console.log('회원탈퇴')
    // API 호출 로직
  }
}
</script>

<template>
  <div class="user-mypage-page">
    <!-- 메인 컨텐츠 -->
    <main class="user-mypage-main">
      <div class="user-mypage-card">
        <h1 class="user-mypage-title">내 계정</h1>

        <form @submit.prevent="handleUpdateInfo" class="user-mypage-form">
          <!-- 아이디 (이메일) -->
          <div class="user-mypage-field">
            <label for="userId" class="user-mypage-label">아이디</label>
            <Input
              id="userId"
              v-model="formData.userId"
              type="email"
              placeholder="example@email.com"
              class="user-mypage-input"
              disabled
            />
          </div>

          <!-- 이름 -->
          <div class="user-mypage-field">
            <label for="name" class="user-mypage-label">이름</label>
            <Input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="이름"
              class="user-mypage-input"
            />
          </div>

          <!-- 전화번호 -->
          <div class="user-mypage-field">
            <label for="phone" class="user-mypage-label">전화번호</label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="010-1234-5678"
              class="user-mypage-input user-mypage-input-last"
            />
          </div>

          <!-- 버튼 그룹 -->
          <div class="user-mypage-button-group">
            <Button type="submit" class="user-mypage-update-button">정보수정</Button>
            <Button type="button" @click="handleChangePassword" class="user-mypage-password-button">
              비밀번호 변경
            </Button>
            <div class="user-mypage-button-container">
              <Button type="button" @click="handleLogout" class="user-mypage-logout-button">
                로그아웃
              </Button>
              <Button type="button" @click="handleWithdrawal" class="user-mypage-withdrawal-button">
                회원탈퇴
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.user-mypage-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.user-mypage-main {
  @apply flex-1 flex items-center justify-center py-5 px-4;
}

/* 회원정보 카드 */
.user-mypage-card {
  @apply bg-white rounded-[20px] shadow-md w-full max-w-[900px] h-[600px] p-10;
}

.user-mypage-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.user-mypage-form {
  @apply flex flex-col items-center;
}

.user-mypage-field {
  @apply flex flex-col items-start w-full max-w-[400px] mb-[10px];
}

.user-mypage-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1 mt-1;
}

/* 일반 입력 필드 - 중앙 정렬 */
.user-mypage-input {
  @apply flex-1 w-full rounded-sm text-sm text-center;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* Input 컴포넌트 내부 텍스트 중앙 정렬 */
.user-mypage-input :deep(input) {
  @apply text-center;
}

.user-mypage-input :deep(.input-base) {
  @apply text-center;
}

/* disabled 상태 스타일 (아이디는 수정 불가) */
.user-mypage-input:disabled {
  @apply bg-gray-100 text-gray-500 cursor-not-allowed;
}

/* 전화번호 필드 하단 간격 */
.user-mypage-input-last {
  @apply mb-[60px];
}

/* 버튼 정렬 */
.user-mypage-button-group {
  @apply flex flex-col items-center w-full max-w-[400px] gap-3;
}

.user-mypage-button-container {
  @apply flex justify-between items-center w-full;
  @apply gap-2;
}

/* 정보수정 버튼 */
.user-mypage-update-button {
  @apply w-full py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
}

/* 비밀번호 변경 버튼 */
.user-mypage-password-button {
  @apply w-full py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
}

/* 로그아웃 버튼 */
.user-mypage-logout-button {
  @apply flex-1 py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
}

/* 회원탈퇴 버튼 */
.user-mypage-withdrawal-button {
  @apply flex-1 py-2 bg-white text-red-600 border border-red-600 font-medium;
  @apply hover:bg-red-100 transition-all duration-200;
}
</style>
