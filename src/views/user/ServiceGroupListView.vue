<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import serviceApi from '@/services/user/service_api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 서비스 목록
const serviceGroups = reactive([])

const getServiceGroups = async () => {
  try {
    const response = await serviceApi.getServiceGroups()
    Object.assign(serviceGroups, response)
  } catch (error) {
    console.log(error)
  }
}

// 선택된 필터 상태
const selectedFilter = ref('전체')

// 선택한 필터에 따라 보여줄 서비스 목록 계산
const filteredServiceGroups = computed(() => {
  if (selectedFilter.value === '전체') return serviceGroups
  return serviceGroups.filter((serviceGroup) => serviceGroup.status === selectedFilter.value)
})

/**
 * 카드 선택시 서비스 항목 목록 페이지로 이동
 * - companySlug 포함
 */
const goToServiceGroup = (item) => {
  const slug = route.params.companySlug || authStore.companySlug || 'default'
  router.push({
    path: `/c/${slug}/services/${item.id}`,
    query: { serviceGroupName: item.name },
  })
}

onMounted(() => {
  getServiceGroups()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="service-container">
      <!-- 헤더 -->
      <div class="service-header">
        <h2 class="service-title">서비스</h2>
      </div>

      <!-- 서비스 카드 목록 -->
      <div class="service-grid">
        <div
          v-for="(item, index) in filteredServiceGroups"
          :key="index"
          class="service-card"
          @click="goToServiceGroup(item)"
        >
          <img :src="item.thumbnail" :alt="item.label" class="service-img" />
          <div class="service-body">
            <div class="service-header-row">
              <h3 class="service-name">{{ item.name }}</h3>
            </div>
            <p class="service-desc">{{ item.description }}</p>
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
</style>
