<script setup>
import PageNation from '@/components/PageNation.vue'
import Dropdown from '@/components/Dropdown.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import serviceApi from '@/services/user/service_api'

const route = useRoute()
const router = useRouter()
const services = ref([])

const serviceGroupId = route.params.serviceGroupId
const serviceGroup = ref({})

const getServiceGroup = async () => {
  const response = await serviceApi.getServiceGroupDetail(serviceGroupId)
  serviceGroup.value = response
}

const getServices = async () => {
  services.value = await serviceApi.getServices(serviceGroupId)
}

// 서비스 타입(예약, 신청)
const serviceType = ref('RESERVATION')

// 필터 드롭다운 종류
const filterItems = [
  { label: '전체', value: '전체' },
  { label: '예약 가능', value: '예약 가능' },
  { label: '예약 불가', value: '예약 불가' },
]

// 선택된 필터 상태
const selectedFilter = ref('전체')

// 필터 적용된 목록
const filteredServices = computed(() => {
  if (selectedFilter.value === '전체') return services.value

  return services.value.filter((item) => {
    if (selectedFilter.value === '예약 가능') {
      return item.status === 'IN_PROGRESS'
    } else if (selectedFilter.value === '예약 불가') {
      return item.status === 'PROGRESS_BEFORE' || item.status === 'CLOSED'
    }
  })
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
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredServices.value.slice(start, end)
})

// 예약 버튼 클릭시 서비스 항목 상세 페이지
const goToServiceDetail = (item) => {
  if (item.status !== 'IN_PROGRESS') return
  const slug = route.params.companySlug || authStore.companySlug || 'default'
  const serviceGroupId = route.params.serviceGroupId
  router.push({ path: `/c/${slug}/services/${serviceGroupId}/detail/${item.id}` })
}

// 화면 로드시 데이터 받아오기
onMounted(() => {
  if (route.query.type) {
    serviceType.value = route.query.type
  }
  getServiceGroup()
  getServices()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="service-item-container">
      <!-- 헤더 -->
      <div class="service-header">
        <img
          :src="serviceGroup.thumbnail || '/assets/images/no-image.png'"
          alt="리소스 이미지"
          class="service-header-img"
        />

        <div class="service-header-right">
          <!-- 서비스 설명 -->
          <div>
            <h2 class="service-title">{{ serviceGroup.name }}</h2>
            <p class="service-contents">
              {{ serviceGroup.description }}
            </p>
          </div>

          <!-- 필터 -->
          <Dropdown
            v-model="selectedFilter"
            :options="filterItems"
            placeholder="선택"
            width="w-48"
            class="service-item-filter"
            @change="statusFilterChange"
          />
        </div>
      </div>

      <!-- 서비스 항목 카드 목록 -->
      <!-- 서비스 항목 카드 목록 -->
      <div class="service-item-grid">
        <template v-if="paginatedServices.length > 0">
          <div v-for="(item, index) in paginatedServices" :key="index" class="service-item-card">
            <img
              :src="item.resourceImage || '/assets/images/no-image.png'"
              :alt="item.name"
              class="service-item-card-img"
            />
            <div class="service-item-card-body">
              <div class="service-item-card-header">
                <h3 class="service-item-card-name">{{ item.name }}</h3>
                <span class="status">
                  <span
                    class="dot"
                    :class="{
                      'dot-active': item.status === 'IN_PROGRESS',
                      'dot-end': item.status !== 'IN_PROGRESS',
                    }"
                  />
                  {{ item.status === 'IN_PROGRESS' ? '예약 가능' : '예약 불가' }}
                </span>
              </div>
              <p class="service-item-card-desc">
                {{ item.location }} | 최대인원 {{ item.capacity }}명
              </p>
            </div>

            <button
              class="reservation-btn"
              :class="item.status === 'IN_PROGRESS' ? 'btn-available' : 'btn-disabled'"
              @click="goToServiceDetail(item)"
            >
              {{ serviceType === 'RESERVATION' ? '예약하기' : '신청하기' }}
            </button>
          </div>
        </template>

        <!-- 필터링 결과 없음 -->
        <div v-else class="no-service-message">조회된 서비스가 없습니다.</div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="paginatedServices.length > 0" class="service-item-pagination">
        <PageNation
          v-model="currentPage"
          :total-items="filteredServices.length"
          :items-per-page="itemsPerPage"
        />
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
  @apply max-w-6xl mx-auto flex flex-col px-10 pt-10 pb-0 bg-white overflow-hidden;
}

/* 헤더 */
.service-header {
  @apply flex justify-between items-center p-2 px-6 gap-8 mb-8 bg-gray-100 rounded-sm h-64;
}

.service-header-img {
  @apply w-96 h-56 object-cover rounded-md shadow-sm flex-shrink-0;
}

.service-header-right {
  @apply flex flex-col justify-between flex-1 h-full py-5;
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
  @apply self-end text-sm text-gray-700 focus:ring-1 focus:ring-gray-400 cursor-pointer;
}

/* 카드 */
.service-item-grid {
  @apply flex flex-col flex-1 gap-4 pb-6 overflow-y-auto;
}

.service-item-card {
  @apply flex justify-between items-center bg-gray-50 rounded-md shadow-sm p-5 hover:shadow-md transition cursor-pointer;
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
  @apply flex justify-center items-center py-4 pb-[40px];
}

.no-service-message {
  @apply flex justify-center items-center min-h-[300px] border border-gray-line rounded-[5px]
}
</style>
