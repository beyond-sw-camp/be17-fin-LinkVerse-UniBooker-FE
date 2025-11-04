<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CompanyDetail from '@/components/CompanyDetail.vue'
import Button from '@/components/Button.vue'
import companyApi from '@/services/super/super_api'
import RejectModal from '@/components/RejectModal.vue'

const router = useRouter()
const route = useRoute()

const company = ref(null)
const loading = ref(false)
const error = ref(null)
const showRejectModal = ref(false)

// 상수
const ERROR_MESSAGES = {
  FETCH_FAILED: '데이터를 불러오는 데 실패했습니다.',
  NETWORK_ERROR: '서버와의 연결에 실패했습니다.',
}

/**
 * 날짜 포맷팅 (YYYY.MM.DD)
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 기업 상세 조회
 */
const fetchCompanyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const companyId = route.params.companyId
    const response = await companyApi.getCompanyDetail(companyId)

    if (response.isSuccess) {
      const data = response.data

      company.value = {
        name: data.companyName,
        id: data.businessNumber,
        companyId: data.companyId,
        status: data.status,
        link: `https://unibooker.kro.kr/${data.companySlug}`,
        logo: data.logoUrl || '/assets/images/admin_logo.png',
        registrationDate: formatDate(data.createdAt),
        administrator: data.adminName,
        email: data.email,
        phone: data.phone,
        companySlug: data.companySlug,
        approvedAt: data.approvedAt,
        rejectionReason: data.rejectionReason,
      }
    } else {
      error.value = response.message || ERROR_MESSAGES.FETCH_FAILED
    }
  } catch (err) {
    console.error('기업 상세 조회 실패:', err)
    error.value = ERROR_MESSAGES.NETWORK_ERROR
  } finally {
    loading.value = false
  }
}

/**
 * 기업 승인
 */
const handleApprove = async () => {
  if (!confirm('이 기업을 승인하시겠습니까?')) return

  try {
    const companyId = route.params.companyId
    const response = await companyApi.approveCompany(companyId)

    if (response.isSuccess) {
      alert('기업이 승인되었습니다.')
      router.push('/super/applications')
    } else {
      alert(response.message || '승인에 실패했습니다.')
    }
  } catch (err) {
    console.error('기업 승인 실패:', err)
    alert('승인 처리 중 오류가 발생했습니다.')
  }
}

/**
 * 기업 거절 - 모달 표시
 */
const handleReject = () => {
  showRejectModal.value = true
}

/**
 * 거절 확인 - 모달에서 확인 버튼 클릭 시
 */
const confirmReject = async (reason) => {
  if (!confirm('이 기업 신청을 거절하시겠습니까?')) return

  try {
    const companyId = route.params.companyId
    const response = await companyApi.rejectCompany(companyId, reason)

    if (response.isSuccess) {
      alert('기업 신청이 거절되었습니다.')
      showRejectModal.value = false
      router.push('/super/applications')
    } else {
      alert(response.message || '거절에 실패했습니다.')
    }
  } catch (err) {
    console.error('기업 거절 실패:', err)
    alert('거절 처리 중 오류가 발생했습니다.')
  }
}

/**
 * 모달 닫기
 */
const closeRejectModal = () => {
  showRejectModal.value = false
}

onMounted(() => {
  fetchCompanyDetail()
})
</script>

<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <p>로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <Button @click="fetchCompanyDetail">다시 시도</Button>
    </div>

    <!-- 데이터 표시 -->
    <div v-else-if="company">
      <CompanyDetail :company="company" @approve="handleApprove" @reject="handleReject" />
    </div>
    <!-- 거절 모달 -->
    <RejectModal
      :show="showRejectModal"
      :companyName="company?.name"
      @close="closeRejectModal"
      @confirm="confirmReject"
    />
  </div>
</template>

<style scoped>
.loading-container,
.error-container {
  @apply text-center py-12;
}

.error-message {
  @apply text-red-600 mb-4;
}
</style>
