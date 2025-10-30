<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companySlug = route.params.companySlug

/**
 * 메인으로 돌아가기
 */
const goToMain = () => {
  router.push('/')
}
</script>

<template>
  <div class="suspended-page">
    <div class="suspended-card">
      <!-- 아이콘 -->
      <div class="icon-container">
        <svg
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- 제목 -->
      <h1 class="title">서비스 일시 중단</h1>

      <!-- 설명 -->
      <p class="description">죄송합니다. 현재 이 서비스는 일시적으로 중단되었습니다.</p>
      <p class="sub-description">서비스 재개 시기는 관리자에게 문의해주세요.</p>

      <!-- 버튼 -->
      <button @click="goToMain" class="btn-primary">메인으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.suspended-page {
  @apply min-h-screen bg-gray-50 flex items-center justify-center p-4;
}

.suspended-card {
  @apply bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center;
}

.icon-container {
  @apply flex justify-center mb-6;
}

.icon {
  @apply w-20 h-20 text-yellow-500;
}

.title {
  @apply text-2xl md:text-3xl font-bold text-gray-800 mb-4;
}

.description {
  @apply text-base text-gray-600 mb-2;
}

.sub-description {
  @apply text-sm text-gray-500 mb-8;
}

.btn-primary {
  @apply w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold 
         hover:bg-primary-hover transition-colors;
}
</style>
