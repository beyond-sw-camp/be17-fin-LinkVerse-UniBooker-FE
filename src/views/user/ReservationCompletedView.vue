<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const reservationData = route.state?.reservation // state로 받으면 새로고침 했을 때 사라짐.. 나중에 pinia나 어떻게 보여줄지 생각

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
      <div class="reservation-completed-card">
        <!-- 아이콘 -->
        <div class="reservation-completed-icon-wrapper">
          <div class="reservation-completed-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="reservation-completed-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
  
        <!-- 제목 -->
        <h2 class="reservation-completed-title">예약/신청이 완료되었습니다</h2>
  
        <!-- 예약 정보 -->
        <div class="reservation-completed-info">
          <div>
            <label class="reservation-completed-label">예약 번호</label>
            <p>{{ reservationData.id }}</p>
          </div>
          <div>
            <label class="reservation-completed-label">예약자</label>
            <p>{{ reservationData.userName }}</p>
          </div>
          <div>
            <label class="reservation-completed-label">예약 일자</label>
            <p>{{ reservationData.startDate ?  reservationData.startDate : reservationData.createdAt}}</p>
          </div>
          <div>
            <label class="reservation-completed-label">서비스명</label>
            <p>{{ reservationData.resourceName }}</p>
          </div>
        </div>
  
        <!-- 버튼 영역 -->
        <div class="reservation-completed-actions">
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

.reservation-completed-card {
    @apply bg-white rounded-2xl shadow-md w-full max-w-[500px] h-[550px] p-8 sm:p-10 text-center overflow-y-auto;
}

.reservation-completed-icon-wrapper {
    @apply flex justify-center mb-6;
}

.reservation-completed-icon-circle {
    @apply w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-primary flex items-center justify-center;
}

.reservation-completed-icon {
    @apply w-6 h-6 sm:w-7 sm:h-7 text-primary;
}

.reservation-completed-title {
    @apply text-base sm:text-lg font-medium mb-8;
}

.reservation-completed-info {
    @apply text-left text-sm sm:text-base space-y-3 text-gray-800 mb-10 sm:mb-12 px-12;
}

.reservation-completed-label {
    @apply text-[#00008C] font-medium;
}

.reservation-completed-actions {
    @apply flex justify-center gap-3 mx-auto w-[80%];
}
</style>
