<script setup>
import PageNation from '@/components/PageNation.vue'
import { ref, reactive, computed, onMounted  } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 예시 회의실 목록 데이터
const meetingRooms = reactive([
    { name: '회의실 A', src: '/assets/images/service/meeting_room.jpg', location: '3층 회의실', capacity: '최대 인원 6명', status: '예약 가능' },
    { name: '회의실 B', src: '/assets/images/service/meeting_room.jpg', location: '4층 회의실', capacity: '최대 인원 6명', status: '예약 불가' },
    { name: '회의실 A', src: '/assets/images/service/meeting_room.jpg', location: '3층 회의실', capacity: '최대 인원 6명', status: '예약 가능' },
    { name: '회의실 B', src: '/assets/images/service/meeting_room.jpg', location: '4층 회의실', capacity: '최대 인원 6명', status: '예약 가능' },
    { name: '회의실 C', src: '/assets/images/service/meeting_room.jpg', location: '5층 회의실', capacity: '최대 인원 6명', status: '예약 불가' },
    { name: '회의실 A', src: '/assets/images/service/meeting_room.jpg', location: '3층 회의실', capacity: '최대 인원 6명', status: '예약 가능' },
])

// 서비스 타입(예약, 신청)
const serviceType = ref('RESERVATION')

// 필터 드롭다운 종류
const filterItems = ['전체', '예약 가능', '예약 불가']

// 선택된 필터 상태
const selectedFilter = ref('전체')

// 필터 적용된 목록
const filteredServiceItems = computed(() => {
  if (selectedFilter.value === '전체') return meetingRooms
  return meetingRooms.filter(room => room.status === selectedFilter.value)
})

// 필터 드롭다운 메뉴 선택
const statusFilterChange = (e) => {
  selectedFilter.value = e.target.value
  currentPage.value = 1
}

// 현재 페이지
const currentPage = ref(1)

// 한 페이지당 표시할 개수
const itemsPerPage = 4

// 현재 페이지에 맞게 잘라낸 목록 - 이 부분은 백엔드 연결했을 때 페이징 처리
const paginatedServiceItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredServiceItems.value.slice(start, end)
})

// 예약 버튼 클릭시 서비스 항목 상세 페이지
const goToServiceItemDetail = (item) => {
    if (item.status !== '예약 가능') return
    router.push('/')  
}

// 나중에 백엔드에서 데이터 받아오기
onMounted(() => {
  if (route.query.type) {
    serviceType.value = route.query.type
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="service-item-container">
      <!-- 헤더 -->
      <div class="service-header">
        <img src="/assets/images/service/meeting_room.jpg" alt="회의실" class="service-header-img"/>

        <div class="service-header-right">
          <!-- 서비스 설명 -->
          <div>
            <h2 class="service-title">회의실 예약</h2>
            <p class="service-contents">
              회의실 A, 회의실 B는 앞으로 예약 시스템을 통해 이용 가능합니다.
            </p>
          </div>

          <!-- 필터 -->
          <select class="service-item-filter" @change="statusFilterChange">
            <option v-for="(item, index) in filterItems" :key="index">{{ item }}</option>
          </select>
        </div>
      </div>

      <!-- 서비스 항목 카드 목록 -->
      <div class="service-item-grid">
        <div v-for="(item, index) in paginatedServiceItems" :key="index" class="service-item-card">
          <img :src="item.src" :alt="item.name" class="service-item-card-img" />
          <div class="service-item-card-body">
            <div class="service-item-card-header">
              <h3 class="service-item-card-name">{{ item.name }}</h3>
              <span class="status">
                <span
                  class="dot"
                  :class="{
                    'dot-active': item.status === '예약 가능',
                    'dot-end': item.status === '예약 불가'
                  }"
                />
                {{ item.status }}
              </span>
            </div>
            <p class="service-item-card-desc">{{ item.location }} | {{ item.capacity }}</p>
          </div>

          <!-- 버튼 -->
          <button
            class="reservation-btn"
            :class="item.status === '예약 가능' ? 'btn-available' : 'btn-disabled'"
            @click="goToServiceItemDetail(item)"
          >
            {{ serviceType === 'RESERVATION' ? '예약하기' : '신청하기' }}
          </button>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="service-item-pagination">
        <PageNation v-model="currentPage" :total-items="filteredServiceItems.length" :items-per-page="itemsPerPage" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  @apply bg-white min-h-screen;
}

/* 전체 컨테이너 */
.service-item-container {
  @apply max-w-6xl mx-auto flex flex-col px-10 pt-10 pb-0 bg-white h-screen overflow-hidden;
}

/* 헤더 */
.service-header {
  @apply flex justify-between items-center p-2 px-5 gap-8 mb-8 bg-gray-100 rounded-sm h-64;
}

.service-header-img {
  @apply w-96 h-56 object-cover rounded-md shadow-sm flex-shrink-0;
}

.service-header-right {
  @apply flex flex-col justify-between flex-1 h-full py-2;
}

.service-title {
  @apply text-base sm:text-xl text-gray-800 font-semibold mb-2;
}

.service-contents {
  @apply text-sm text-gray-500 overflow-hidden text-ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 최대 5줄만 보이게 */
  -webkit-box-orient: vertical;
}

/* 필터 */
.service-item-filter {
  @apply self-end border rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:ring-1 focus:ring-gray-400 cursor-pointer;
}

/* 카드 */
.service-item-grid {
  @apply flex flex-col flex-1 gap-4 pb-6 overflow-y-auto;
}

.service-item-card {
  @apply flex justify-between items-center bg-gray-50 rounded-md shadow-sm p-5 hover:shadow-md transition;
}

.service-item-card-img {
  @apply w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm;
}

.service-item-card-body {
  @apply flex-1 px-6;
}

.service-item-card-header {
  @apply flex items-center gap-2 mb-1;
}

.service-item-card-name {
  @apply text-base font-semibold text-gray-800;
}

.service-item-card-desc {
  @apply text-sm text-gray-600;
}

/* 상태 표시 */
.status {
  @apply flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full;
}

.dot {
  @apply w-2 h-2 rounded-full inline-block;
}

.dot-active {
  @apply bg-primary-bright;
}

.dot-end {
  @apply bg-gray-dark;
}

/* 버튼 */
.reservation-btn {
  @apply px-7 py-3 rounded-md text-sm font-medium transition;
}

.btn-available {
  @apply bg-primary text-white hover:bg-blue-700;
}

.btn-disabled {
  @apply bg-gray-deep text-gray-500 cursor-not-allowed;
}

/* 페이지네이션 */
.service-item-pagination {
  @apply flex justify-center items-center py-4;
}
</style>
