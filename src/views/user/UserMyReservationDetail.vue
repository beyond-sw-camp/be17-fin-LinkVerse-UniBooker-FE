<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import ReservationApi from '@/services/user/reservation_api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 예약 목록 페이지로 이동
const goToMyReservation = () => {
  const slug = route.params.companySlug || authStore.companySlug || 'default'
  router.push(`/c/${slug}/reservations/`)
}

// 예약 취소
const cancelReservation = () => {
  if (confirm('이 예약을 취소하시겠습니까?')) {
    alert('예약이 취소되었습니다.')
    goToMyReservation()
  }
}

// 예약 상세 데이터
const reservation = reactive({})
const getUserReservation = async () => {
  const response = await ReservationApi.getUserReservation(route.params.reservationId)

  if (response && response.isSuccess) {
    Object.assign(reservation, response.data)
  }
}

// 날짜 카테고리 타입에 따른 변환
const formatDate = (dateString, includeTime = false) => {
  const date = new Date(dateString)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  if (includeTime) {
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}년 ${mm}월 ${dd}일 ${hh}:${min}`
  }

  return `${yyyy}년 ${mm}월 ${dd}일`
}

// 날짜 표시
const getDate = (item) => {
  if (item.serviceCategory === 'EVENT') return formatDateEvent(item.createdAt)
  else return `${formatDate(item.startDate, true)} ~ ${formatDate(item.endDate, true)}`
}

onMounted(() => {
  getUserReservation()
})
</script>

<template>
  <div class="page-background">
    <div class="page-container">
      <!-- 이미지 카드 -->
      <div class="content-card">
        <h2 class="section-title">예약/신청 상세</h2>
        <img :src="reservation.thumbnail  || '/assets/images/no-image.png'" alt="예약 이미지" class="thumbnail" />
      </div>

      <!-- 상세 정보 카드 -->
      <div class="content-card info-card">
        <h3 class="info-title">{{ reservation.resourceName }}</h3>

        <table class="detail-table">
          <tbody>
            <tr><th>예약 번호</th><td>{{ reservation.id }}</td></tr>
            <tr><th>예약자</th><td>{{ reservation.userName }}</td></tr>
            <tr><th>서비스</th><td>{{ reservation.resourceGroupName }}</td></tr>
            <tr><th>서비스 항목</th><td>{{ reservation.resourceName }}</td></tr>
            <tr><th>이용 일시</th><td>{{ getDate(reservation) }}</td></tr>
            <tr><th>예약 시각</th><td>{{ formatDate(reservation.createdAt, true) }}</td></tr>
            <tr><th>예약 상태</th><td>{{ reservation.status === 'CONFIRMED' ? '예약 확정' : '예약 취소' }}</td></tr>            
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
