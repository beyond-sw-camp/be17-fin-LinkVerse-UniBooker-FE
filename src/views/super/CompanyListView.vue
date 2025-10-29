<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/Input.vue'
import Dropdown from '@/components/Dropdown.vue'
import superApi from '@/services/super/super_api'

const router = useRouter()

// ===== 상태 관리 =====
const companies = ref([])
const currentPage = ref(0)
const totalPages = ref(0)
const selectedStatus = ref('')
const searchKeyword = ref('')

// ===== 드롭다운 옵션 =====
const statusOptions = [
  { value: '', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'SUSPENDED', label: '정지' },
]

// ===== API 호출 =====
const fetchCompanies = async () => {
  try {
    const response = await superApi.getAllCompanies(
      currentPage.value,
      10,
      selectedStatus.value || null,
      searchKeyword.value || null,
    )

    // ✅ super_api.js가 이미 response.data를 반환함!
    if (response && response.isSuccess && response.data) {
      companies.value = response.data.companies || []
      totalPages.value = response.data.totalPages || 1
      console.log('✅ 기업 목록:', companies.value.length, '개')
    } else {
      companies.value = []
      totalPages.value = 0
    }
  } catch (error) {
    console.error('❌ 기업 목록 조회 실패:', error)
    companies.value = []
    totalPages.value = 0
  }
}

// ===== 이벤트 핸들러 =====
const handleSearch = () => {
  currentPage.value = 0
  fetchCompanies()
}

const handleStatusChange = () => {
  currentPage.value = 0
  fetchCompanies()
}

const goToCompanyDetail = (company) => {
  router.push(`/super/companies/${company.companyId}`)
}

// ===== 페이지네이션 =====
const handlePrevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchCompanies()
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchCompanies()
  }
}

// ===== 상태별 배지 스타일 =====
const getStatusBadgeClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    REJECTED: 'bg-gray-100 text-gray-800',
  }
  return `px-2 py-1 rounded text-xs font-medium ${classes[status]}`
}

const getStatusText = (status) => {
  const map = {
    PENDING: '승인 대기',
    ACTIVE: '활성',
    SUSPENDED: '정지',
    REJECTED: '승인 거절',
  }
  return map[status] || status
}

// ===== 날짜 포맷 =====
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// ===== 초기화 =====
onMounted(() => {
  fetchCompanies()
})
</script>

<template>
  <div class="page-container">
    <div class="header-with-controls">
      <h3 class="page-title">플랫폼 이용 기업 목록</h3>

      <div class="controls-group">
        <Input
          v-model="searchKeyword"
          type="text"
          placeholder="기업명 또는 슬러그 검색"
          @keyup.enter="handleSearch"
          class="search-bar h-[35px]"
        />

        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="전체"
          @update:modelValue="handleStatusChange"
          class="w-40 custom-dropdown"
        />

        <button @click="handleSearch" class="search-button h-[35px]">검색</button>
      </div>
    </div>

    <div class="components-white-container">
      <div class="components-super-table-container">
        <table class="components-super-table">
          <thead>
            <tr>
              <th>기업명</th>
              <th>도메인</th>
              <th>관리자명</th>
              <th>관리자 이메일</th>
              <th>신청일자</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="company in companies"
              :key="company.companyId"
              class="list-row"
              @click="goToCompanyDetail(company)"
            >
              <td>{{ company.companyName }}</td>
              <td>{{ company.companySlug }}</td>
              <td>{{ company.adminName || '-' }}</td>
              <td>{{ company.adminEmail || '-' }}</td>
              <td>{{ formatDate(company.createdAt) }}</td>
              <td>
                <span :class="getStatusBadgeClass(company.status)">
                  {{ getStatusText(company.status) }}
                </span>
              </td>
            </tr>

            <!-- 데이터 없을 때 -->
            <tr v-if="companies.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">조회된 기업이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="handlePrevPage" :disabled="currentPage === 0" class="page-button">
          이전
        </button>

        <span class="page-info"> {{ currentPage + 1 }} / {{ totalPages }} </span>

        <button
          @click="handleNextPage"
          :disabled="currentPage >= totalPages - 1"
          class="page-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  @apply flex flex-col gap-1 py-5;
}

/* 제목과 컨트롤을 같은 줄에 배치 */
.header-with-controls {
  @apply flex justify-between items-center;
}

/* 제목 스타일 */
.page-title {
  @apply text-2xl font-semibold text-text;
}

/* 검색/필터 그룹 */
.controls-group {
  @apply flex gap-3 items-center;
}

.search-bar {
  @apply w-64;
}

.search-button {
  @apply px-4 bg-primary text-white rounded hover:bg-primary-hover transition-colors;
}

.list-row {
  @apply cursor-pointer hover:bg-gray-50 transition-colors;
}

.pagination {
  @apply flex justify-center items-center gap-4 mt-6;
}

.page-button {
  @apply px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.page-info {
  @apply text-sm text-gray-600;
}

.custom-dropdown :deep(.dropdown-selected-container) {
  @apply !h-[35px] !pt-0 !pb-0 !flex !items-center;
}
</style>
