<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import companyApi from '@/services/super/super_api'

const router = useRouter()

// 상태 관리
const companies = ref([])
const loading = ref(false)
const error = ref(null)

/**
 * 승인 대기 기업 목록 조회
 */
const fetchPendingCompanies = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await companyApi.getPendingCompanies()

    if (response.isSuccess) {
      companies.value = response.data
    } else {
      error.value = response.message || '데이터를 불러오는 데 실패했습니다.'
    }
  } catch (err) {
    console.error('승인 대기 목록 조회 실패:', err)
    error.value = '서버와의 연결에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * 신청 상세로 이동
 */
const goToApplicationDetail = (company) => {
  router.push(`/super/applications/${company.companyId}`)
}

/**
 * 날짜 포맷팅 (YYYY.MM.DD)
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchPendingCompanies()
})
</script>

<template>
  <div class="super-app-container">
    <span class="components-page-title">신청 목록</span>

    <div class="components-white-container">
      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <p>로딩 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <Button @click="fetchPendingCompanies">다시 시도</Button>
      </div>

      <!-- 데이터 없음 -->
      <div v-else-if="companies.length === 0" class="empty-container">
        <p>승인 대기 중인 신청이 없습니다.</p>
      </div>

      <!-- 테이블 -->
      <div v-else class="components-super-table-container">
        <table class="components-super-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>기업명</th>
              <th>신청일자</th>
              <th>관리자명</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(company, index) in companies" :key="company.companyId">
              <td>{{ index + 1 }}</td>
              <td>{{ company.companyName }}</td>
              <td>{{ formatDate(company.createdAt) }}</td>
              <td>{{ company.adminName }}</td>
              <td>
                <Button @click="goToApplicationDetail(company)" class="super-app-btn"
                  >상세 보기</Button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container,
.error-container,
.empty-container {
  @apply text-center py-12;
}

.super-app-container {
  @apply mb-40;
}

.error-message {
  @apply text-red-600 mb-4;
}

.empty-container p {
  @apply text-gray-400 text-lg;
}

.super-app-btn {
  @apply w-20 px-1 py-2 font-medium;
}
</style>
