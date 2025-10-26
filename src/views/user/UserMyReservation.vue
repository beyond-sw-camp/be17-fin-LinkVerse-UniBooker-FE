<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import ReservationApi from '@/services/user/reservation_api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 예약 상세 페이지 이동
const goToMyReservationDetail = (reservationId) => {
  const slug = route.params.companySlug || authStore.companySlug || 'default'
  router.push(`/c/${slug}/reservation/detail/${reservationId}`)
}

// 상태
const selectedYear = ref(null)
const selectedMonth = ref(null)
const includeCancelled = ref(false) // 취소 내역 포함에 체크할 경우, status가 'CANCELLED'인 항목도 같이 노출한다.

// 연도 드롭다운
const currentYear = new Date().getFullYear()
const startYear = 2020
const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
  const year = currentYear - i
  return { label: `${year}년`, value: year }
})

// 월 드롭다운
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1
}))


// 예약 내역
const reservations = reactive([])
const getUserReservations = async () => {
  const response = await ReservationApi.getUserReservations()

  if (response && response.isSuccess) {
    Object.assign(reservations, response.data.reservations)
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
  getUserReservations()
})
</script>
<template>
  <div class="page-background">
    <div class="content-card">
      <main class="main-content">
        <!-- 헤더 및 필터 영역 -->
        <div class="flex justify-between items-center mb-5">
          <h2 class="section-title">예약/신청 내역</h2>
          <div class="flex items-center gap-4">
            <Input type="checkbox" v-model="includeCancelled" label="취소 내역 제외"/>
            <Dropdown v-model="selectedYear" :options="yearOptions" placeholder="연도 선택" width="w-35"/>
            <Dropdown v-model="selectedMonth" :options="monthOptions" placeholder="월 선택" width="w-30"/>
          </div>
        </div>
        <!-- 예약 목록 영역 -->
        <div class="reservation-list">
          <a v-for="item in reservations" :key="item.id" class="reservation-item cursor-pointer" @click="goToMyReservationDetail(item.id)">
            <img :src="item.thumbnail" class="item-image" />
            <div class="item-info">
              <div class="item-header">
                <h3 class="item-name">{{ item.resourceName }}</h3>
                <span class="tag-primary">{{ item.resourceGroupName }}</span>
                <span v-if="item.status === 'CANCELLED'" class="tag-cancelled">취소</span>
              </div>
              <p class="item-id">예약번호 {{ item.id }}</p>
              <div class="item-name-desc">
                <p class="item-name-small">{{ item.resourceName }}</p>
                <p>{{ getDate(item) }}</p>
              </div>
            </div>
            <div class="arrow-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page-background {
  @apply min-h-screen bg-white py-10 px-4 font-mont-noto;
}

/* 컨테이너 */
.content-card {
  @apply max-w-6xl mx-auto bg-white rounded-2xl shadow p-7;
}

/* 타이틀 */
.section-title {
  @apply text-xl font-semibold text-text mb-5;
}

/* 리스트 */
.reservation-list {
  @apply divide-y divide-gray-line;
}
.reservation-item {
  @apply flex items-center py-4 hover:bg-gray-line/40 transition rounded-lg px-2;
}
.item-image {
  @apply w-20 h-20 rounded-lg object-cover;
}
.item-info {
  @apply flex-grow ml-4 sm:ml-6;
}
.item-header {
  @apply flex items-center gap-2 mb-1;
}
.item-name {
  @apply text-base font-bold text-text;
}
.item-id {
  @apply text-sm text-gray-dark;
}
.item-name-desc {
  @apply flex items-center gap-4 text-sm text-gray-dark;
}
.item-name-small {
  @apply text-sm font-medium text-gray-dark;
}
.tag-primary {
  @apply bg-primary text-white font-medium text-xs px-2 py-0.5 rounded-full;
}
.tag-cancelled {
  @apply bg-white text-gray-dark font-medium text-xs px-2 py-0.5 rounded-full border border-gray-dark;
}
</style>
