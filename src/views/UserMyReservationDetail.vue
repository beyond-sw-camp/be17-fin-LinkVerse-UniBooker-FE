<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* 목록 페이지로 이동 */
const goToMyReservation = () => {
  router.push('/myreservation')
}

/* 예약 취소 */
const cancelReservation = () => {
  if (confirm('이 예약을 취소하시겠습니까?')) {
    alert('예약이 취소되었습니다.')
    goToMyReservation()
  }
}

/* 예약 데이터 (예시) */
const reservation = ref({
  id: 123456789,
  bookerName: '윤소민',
  serviceName: '회의실 예약',
  itemName: '회의실 A',
  startTime: '2025년 10월 8일 (수) 14:00',
  endTime: '16:00',
  status: '예약 확정',
  thumbnail: 'https://placehold.co/600x400/e2e8f0/64748b?text=IMG',
  created_at: '2025년 9월 8일 (수) 20:01'
})
</script>

<template>
  <div class="page-background">
    <div class="page-container">
      <!-- 이미지 카드 -->
      <div class="content-card">
        <h2 class="section-title">예약/신청 상세</h2>
        <img :src="reservation.thumbnail" alt="예약 이미지" class="thumbnail" />
      </div>

      <!-- 상세 정보 카드 -->
      <div class="content-card info-card">
        <h3 class="info-title">{{ reservation.itemName }}</h3>

        <table class="detail-table">
          <tbody>
            <tr><th>예약 번호</th><td>{{ reservation.id }}</td></tr>
            <tr><th>예약자</th><td>{{ reservation.bookerName }}</td></tr>
            <tr><th>서비스</th><td>{{ reservation.serviceName }}</td></tr>
            <tr><th>서비스 항목</th><td>{{ reservation.itemName }}</td></tr>
            <tr><th>이용 일시</th><td>{{ reservation.startTime }} ~ {{ reservation.endTime }}</td></tr>
            <tr><th>예약 시각</th><td>{{ reservation.created_at }}</td></tr>
            <tr><th>예약 상태</th><td>{{ reservation.status }}</td></tr>            
          </tbody>
        </table>

        <div class="button-group">
          <Button @click="goToMyReservation">목록</Button>
          <Button theme="light" @click="cancelReservation">예약 취소</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.page-background {
  @apply min-h-screen bg-white py-10 px-4 font-mont-noto;
}
.page-container {
  @apply max-w-6xl mx-auto flex flex-col md:flex-row gap-6;
}

/* 카드 */
.content-card {
  @apply bg-white rounded-2xl shadow p-7 flex-1;
}

/* 상세 카드 중앙 정렬 */
.info-card {
  @apply flex flex-col justify-center items-center text-center;
}

/* 타이틀 */
.section-title {
  @apply text-xl font-semibold text-text mb-10;
}
.info-title {
  @apply text-3xl font-semibold mb-12 text-primary mt-7;
}

/* 이미지 */
.thumbnail {
  @apply rounded-xl shadow-md w-full h-[450px] object-cover;
}

/* 상세 테이블 */
.detail-table {
  @apply table-auto w-fit border-t border-gray-line text-sm mx-auto;
}
.detail-table th {
  @apply text-gray-dark font-medium py-3 pl-10 text-center text-sm whitespace-nowrap;
}
.detail-table td {
  @apply text-text py-3 pl-16 text-left text-sm font-normal;
}
.detail-table tr {
  @apply border-b border-gray-line;
}

/* 버튼 그룹 */
.button-group {
  @apply mt-12 flex gap-4 justify-center;
}
</style>
