<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToReservationDetail = () => {
  router.push('')
}

const goToHome = () => {
  router.push('')
}
</script>

<template>
    <div class="reservation-completed-container">
      <!-- 카드 박스 -->
      <div class="card-box">
        <!-- 아이콘 -->
        <div class="icon-wrapper">
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
  
        <!-- 제목 -->
        <h2 class="title">예약/신청이 완료되었습니다</h2>
  
        <!-- 예약 정보 -->
        <div class="info">
          <div>
            <label class="label">예약 번호</label>
            <p>123456789</p>
          </div>
          <div>
            <label class="label">예약자</label>
            <p>유현경</p>
          </div>
          <div>
            <label class="label">예약 일자</label>
            <p>2025/10/13 (월) 19:00</p>
          </div>
          <div>
            <label class="label">서비스명</label>
            <p>회의실 A</p>
          </div>
        </div>
  
        <!-- 버튼 영역 -->
        <div class="button-section">
          <Button theme="light" class="flex-1" @click="goToReservationDetail">예약 상세</Button>
          <Button class="flex-1" @click="goToHome">확인</Button>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.reservation-completed-container {
    @apply flex justify-center items-center min-h-screen bg-white px-4;
}

.card-box {
    @apply bg-white rounded-2xl shadow-md w-full max-w-[500px] h-[550px] p-8 sm:p-10 text-center overflow-y-auto;
}

.icon-wrapper {
    @apply flex justify-center mb-6;
}

.icon-circle {
    @apply w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-primary flex items-center justify-center;
}

.icon-svg {
    @apply w-6 h-6 sm:w-7 sm:h-7 text-primary;
}

.title {
    @apply text-base sm:text-lg font-medium mb-8;
}

.info {
    @apply text-left text-sm sm:text-base space-y-3 text-gray-800 mb-10 sm:mb-12 px-12;
}

.label {
    @apply text-[#00008C] font-medium;
}

.button-section {
    @apply flex justify-center gap-3 mx-auto w-[80%];
}
</style>
