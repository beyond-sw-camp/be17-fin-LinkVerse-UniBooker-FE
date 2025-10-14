<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'

const router = useRouter()

const goToMyReservationDetail = (id) => {
  router.push(`/myreservation/${id}`)
}

/* 상태 */
const selectedYear = ref(null)
const selectedMonth = ref(null)
// 취소 내역 포함에 체크할 경우, status가 'CANCELLED'인 항목도 같이 노출한다.
const includeCancelled = ref(false)

/* 연도 드롭다운 */
const currentYear = new Date().getFullYear()
const startYear = 2020
const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
  const year = currentYear - i
  return { label: `${year}년`, value: year }
})

/* 월 드롭다운 */
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1
}))

/* 예약 내역 데이터 (예시) */
const reservations = ref([
  {
    id: 1234567890, // 예약 ID
    name: '회의실 A', // 리소스 이름
    resource_group_name: '회의실 예약', // 리소스 그룹 이름
    startTime: '2025년 10월 8일 14:00', // 시작 시간
    endTime: '2025년 10월 8일 15:00', // 종료 시간
    thumbnail: 'https://placehold.co/100x100/e2e8f0/64748b?text=IMG',  // 리소스 썸네일
    status: 'CONFIRMED', // 예약 상태
  },
  {
    id: 1234567891,
    name: '보드게임 동아리',
    resource_group_name: '동아리 모집',
    startTime: '2025년 10월 8일 14:00', 
    endTime: '2025년 10월 8일 15:00', 
    thumbnail: 'https://placehold.co/100x100/e2e8f0/64748b?text=IMG',
    status: 'CANCELLED',
  },
  {
    id: 1234567892,
    name: '분당선(판교역) 출근',
    resource_group_name: '통근버스 신청',
    startTime: '2025년 10월 8일 14:00', 
    endTime: '2025년 10월 8일 15:00',
    thumbnail: 'https://placehold.co/100x100/e2e8f0/64748b?text=IMG',
    status: 'CANCELLED',
  },
  {
    id: 1234567893,
    name: '패밀리 디럭스',
    resource_group_name: '캠핑카 이용 신청',
    startTime: '2025년 10월 8일 14:00', 
    endTime: '2025년 10월 8일 15:00',
    thumbnail: 'https://placehold.co/100x100/e2e8f0/64748b?text=IMG',
    status: 'CONFIRMED',
  }
])
</script>
<template>
  <div class="page-background">
    <!-- 예약 내역 -->
    <div class="content-card">
      <main class="main-content">
        <div class="flex justify-between items-center mb-5">
          <h2 class="section-title">예약/신청 내역</h2>
          <div class="flex items-center gap-4">
            <Input type="checkbox" v-model="includeCancelled" label="취소 내역 제외"/>
            <Dropdown v-model="selectedYear" :options="yearOptions" placeholder="연도 선택" width="w-35"/>
            <Dropdown v-model="selectedMonth" :options="monthOptions" placeholder="월 선택" width="w-30"/>
          </div>
        </div>
        <div class="reservation-list">
          <a v-for="item in reservations" :key="item.id" class="reservation-item cursor-pointer" @click="goToMyReservationDetail(item.id)">
            <img :src="item.thumbnail" class="item-image" />
            <div class="item-info">
              <div class="item-header">
                <h3 class="item-name">{{ item.name }}</h3>
                <span class="tag-primary">{{ item.resource_group_name }}</span>
                <span v-if="item.status === 'CANCELLED'" class="tag-cancelled">취소</span>
              </div>
              <p class="item-id">예약번호 {{ item.id }}</p>
              <div class="item-name-desc">
                <p class="item-name-small">{{ item.name }}</p>
                <p>{{ item.startTime }} ~ {{ item.endTime }}</p>
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
