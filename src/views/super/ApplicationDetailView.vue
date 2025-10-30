<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CompanyDetail from '@/components/CompanyDetail.vue'
import Button from '@/components/Button.vue'
import companyApi from '@/services/super/super_api'

const router = useRouter()
const route = useRoute()

const company = ref(null)
const loading = ref(false)
const error = ref(null)
const rejectionReason = ref('')

// 상수
const ERROR_MESSAGES = {
  FETCH_FAILED: '데이터를 불러오는 데 실패했습니다.',
  NETWORK_ERROR: '서버와의 연결에 실패했습니다.',
  REJECTION_REQUIRED: '거절 사유를 입력해주세요.',
  REJECTION_TOO_LONG: '거절 사유는 500자를 초과할 수 없습니다.',
}

const MAX_REJECTION_LENGTH = 500

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
 * 거절 사유 유효성 검사
 */
const validateRejectionReason = () => {
  if (!rejectionReason.value.trim()) {
    alert(ERROR_MESSAGES.REJECTION_REQUIRED)
    return false
  }

  if (rejectionReason.value.length > MAX_REJECTION_LENGTH) {
    alert(ERROR_MESSAGES.REJECTION_TOO_LONG)
    return false
  }

  return true
}

/**
 * 기업 거절
 */
const handleReject = async () => {
  if (!validateRejectionReason()) return

  if (!confirm('이 기업 신청을 거절하시겠습니까?')) return

  try {
    const companyId = route.params.companyId
    const response = await companyApi.rejectCompany(companyId, rejectionReason.value)

    if (response.isSuccess) {
      alert('기업 신청이 거절되었습니다.')
      router.push('/super/applications')
    } else {
      alert(response.message || '거절에 실패했습니다.')
    }
  } catch (err) {
    console.error('기업 거절 실패:', err)
    alert('거절 처리 중 오류가 발생했습니다.')
  }
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
      <CompanyDetail :company="company" @approve="handleApprove" @reject="handleReject">
        <h3 class="section-title">추가 전달사항</h3>
        <p class="inline-note">
          승인/거절 시 해당 관리자에게 메일이 전송 됩니다. 관리자에게 보낼 메일에 추가적으로 전달할
          사항이 있다면 입력해 주세요.
        </p>
        <textarea
          v-model="rejectionReason"
          class="rejection-textarea"
          placeholder="승인/거절 사유를 입력해주세요 (최대 500자)"
          :maxlength="MAX_REJECTION_LENGTH"
          rows="6"
        ></textarea>

        <!-- ✅ 승인/거절 버튼 -->
        <div class="button-container">
          <Button @click="handleReject" theme="light" class="reject-button">거절</Button>
          <Button @click="handleApprove" theme="primary">승인</Button>
        </div>
      </CompanyDetail>
    </div>
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

/* ✅ 추가 전달사항 영역 스타일 */
.additional-section {
  @apply space-y-3;
}

.section-title {
  @apply text-lg font-semibold text-gray-800;
}

.inline-note {
  @apply text-xs text-gray-400 block;
}

.rejection-textarea {
  @apply w-full px-4 py-3 rounded border border-gray-line bg-gray-200
    focus:border-primary focus:ring-2 focus:ring-primary/20
    placeholder-gray-400 transition-all resize-none;
}

.button-container {
  @apply flex justify-center gap-3 mt-4;
}

.reject-button {
  @apply bg-gray-200 text-gray-700 font-medium;
}

.reject-button:hover {
  @apply bg-gray-300;
}
</style>
