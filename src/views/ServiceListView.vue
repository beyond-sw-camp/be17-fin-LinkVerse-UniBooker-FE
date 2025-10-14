<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 예시 서비스 목록
const services = reactive([
  { label: '동아리 모집', type: 'APPLICATION', src:'/assets/images/service/organization.jpg', status: '진행중', contents: '회의실 A, 회의실 B는 앞으로 예약 시스템을 통해 이용 가능합니다.' },
  { label: '회의실 예약', type: 'RESERVATION', src:'/assets/images/service/meeting_room.jpg', status: '진행중', contents: '퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!퇴근 후 할 일이 없으신가요? 사내 동아리 활동에 참여해서 진로도 쌓고 취미도 찾아보세요!' },
  { label: '통근버스 신청', type: 'APPLICATION', src:'/assets/images/service/commuting_bus.jpg', status: '마감', contents: '경기도 출퇴근 버스 신청 받습니다.' },
  { label: '캠핑카 이용 신청', type: 'APPLICATION', src:'/assets/images/service/camping_car.jpg', status: '종료', contents: '이번 연휴 때 캠핑하시는 분들 캠핑카 대여 가능합니다.' },
])

// 필터 드롭다운 종류
const filterItems = ['전체', '진행중', '마감', '종료']

// 선택된 필터 상태
const selectedFilter = ref('전체')

// 선택한 필터에 따라 보여줄 서비스 목록 계산
const filteredServices = computed(() => {
  if (selectedFilter.value === '전체') return services
  return services.filter(service => service.status === selectedFilter.value)
})

// 필터 드롭다운 메뉴 선택
const selectMenuItem = (e) => {
  selectedFilter.value = e.target.value
}

// 카드 선택시 서비스 항목 목록 페이지
const goToService = (item) => { // 백엔드 연결시에는 서비스 항목 id로 받기
  router.push({
    path: '/service-item/list',
    query: { type: item.type },
  })
}
</script>

<template>
  <div class="page-wrapper">
    <div class="service-container">
      <!-- 헤더 -->
      <div class="service-header">
        <h2 class="service-title">서비스</h2>

        <!-- 필터 -->
        <div class="service-filter">
          <select class="filter-select" @change="selectMenuItem">
            <option v-for="(item, index) in filterItems" :key="index">{{ item }}</option>
          </select>
        </div>
      </div>

      <!-- 서비스 카드 목록 -->
      <div class="service-grid">
        <div v-for="(item, index) in filteredServices" :key="index" class="service-card" @click="goToService(item)">
          <img :src="item.src" :alt="item.label" class="service-img" />
          <div class="service-body">
            <div class="service-header-row">
              <h3 class="service-name">{{ item.label }}</h3>
              <span class="status">
                <span 
                  class="dot"
                  :class="{
                    'dot-active': item.status === '진행중',
                    'dot-end': item.status === '마감',
                    'dot-finish': item.status === '종료'
                  }" 
                /> {{ item.status }}
              </span>
            </div>
            <p class="service-desc">{{ item.contents }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  @apply bg-white min-h-screen;
}

/* 전체 컨테이너 */
.service-container {
  @apply max-w-6xl mx-auto p-8 bg-white min-h-screen;
}

/* 헤더 */
.service-header {
  @apply flex justify-between items-center mb-6;
}

.service-title {
  @apply text-xl sm:text-xl font-semibold text-gray-800;
}

/* 필터 */
.service-filter {
  @apply relative;
}

.filter-select {
  @apply border rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer;
}

/* 카드 */
.service-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5;
}

.service-card {
  @apply bg-gray-50 h-80 shadow-sm overflow-hidden hover:shadow-md transition p-2;
}

.service-img {
  @apply w-full h-48 object-cover rounded-xl;
}

.service-body {
  @apply pt-5 px-1 flex flex-col justify-between flex-1;
}

.service-header-row {
  @apply flex items-center gap-2 mb-1;
}

.service-name {
  @apply text-base font-semibold text-gray-900;
}

.service-desc {
  @apply text-sm text-gray-600 mt-1;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 표시할 최대 줄 수 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 상태 표시 */
.status {
  @apply flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full;
}

.dot {
  @apply w-2 h-2 rounded-full inline-block;
}

.dot-active {
  @apply bg-blue-500;
}

.dot-end {
  @apply bg-gray-500;
}

.dot-finish {
  @apply bg-gray-400;
}
</style>