<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import superApi from '@/services/super/super_api'
import CompanyDetail from '@/components/CompanyDetail.vue'

const route = useRoute()
const router = useRouter()
const company = ref(null)

/**
 * 기업 상세 정보 조회
 */
const fetchCompanyDetail = async () => {
  try {
    const response = await superApi.getCompanyDetail(route.params.companyId)

    if (response && response.isSuccess && response.data) {
      company.value = response.data
    } else {
      company.value = null
    }
  } catch (error) {
    console.error('❌ 기업 상세 조회 실패:', error)
    company.value = null
  }
}

onMounted(() => {
  fetchCompanyDetail()
})

/**
 * 기업 승인
 */
const handleApprove = async () => {
  const confirmed = confirm(
    `'${company.value.companyName}'을 승인하시겠습니까?\n승인 시 해당 관리자에게 메일이 전송됩니다.`
  )
  if (!confirmed) return

  try {
    const response = await superApi.approveCompany(company.value.companyId)
    if (response.isSuccess) {
      alert('기업이 승인되었습니다.')
      await fetchCompanyDetail()
    } else {
      alert(response.message || '승인에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 승인 실패:', error)
    alert('승인 처리 중 오류가 발생했습니다.')
  }
}

/**
 * 기업 거절
 */
const handleReject = async () => {
  const reason = prompt('거절 사유를 입력해주세요:')
  if (!reason || reason.trim() === '') {
    alert('거절 사유를 입력해야 합니다.')
    return
  }

  const confirmed = confirm(
    `'${company.value.companyName}'을 거절하시겠습니까?\n거절 시 해당 관리자에게 메일이 전송됩니다.`
  )
  if (!confirmed) return

  try {
    const response = await superApi.rejectCompany(company.value.companyId, reason)
    if (response.isSuccess) {
      alert('기업이 거절되었습니다.')
      router.push('/super/companies/pending')
    } else {
      alert(response.message || '거절에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 거절 실패:', error)
    alert('거절 처리 중 오류가 발생했습니다.')
  }
}

/**
 * 기업 정지
 */
const handleSuspend = async () => {
  const confirmed = confirm(
    `'${company.value.companyName}'을 정지하시겠습니까?\n` +
      `정지하면 해당 기업의 서비스가 중단되고, 관리자/매니저가 로그인할 수 없게 됩니다.`
  )
  if (!confirmed) return

  try {
    const response = await superApi.updateCompanyStatus(company.value.companyId, 'SUSPENDED')
    if (response.isSuccess) {
      alert('기업이 정지되었습니다.')
      await fetchCompanyDetail()
    } else {
      alert(response.message || '상태 변경에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 정지 실패:', error)
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}

/**
 * 기업 활성화
 */
const handleActivate = async () => {
  const confirmed = confirm(`'${company.value.companyName}'을 활성화하시겠습니까?`)
  if (!confirmed) return

  try {
    const response = await superApi.updateCompanyStatus(company.value.companyId, 'ACTIVE')
    if (response.isSuccess) {
      alert('기업이 활성화되었습니다.')
      await fetchCompanyDetail()
    } else {
      alert(response.message || '상태 변경에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 활성화 실패:', error)
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}

/**
 * API 응답 데이터를 CompanyDetail 컴포넌트 props 형식으로 변환
 */
const transformCompanyData = (apiData) => {
  return {
    companyId: apiData.companyId,
    companySlug: apiData.companySlug,
    name: apiData.companyName,
    id: apiData.businessNumber,
    link: apiData.companySlug ? `${window.location.origin}/c/${apiData.companySlug}` : '-',
    logo: apiData.logoUrl || '/assets/icons/ic-logo-default.png',
    registrationDate: formatDate(apiData.createdAt),
    administrator: apiData.adminName,
    email: apiData.email,
    phone: apiData.phone,
    status: apiData.status,
    serviceGroups: apiData.serviceGroupCount || 0,
    customers: apiData.userCount || 0,
    lastLogin: apiData.lastLoginAt ? formatDateTime(apiData.lastLoginAt) : '-',
  }
}

/**
 * 날짜 포맷팅
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 날짜+시간 포맷팅
 */
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="company-detail-view">
    <!-- 로딩 상태 -->
    <div v-if="!company" class="loading">
      <p>기업 정보를 불러오는 중...</p>
    </div>

    <!-- 기업 정보 표시 -->
    <div v-else>
      <!-- CompanyDetail 컴포넌트 사용 -->
      <CompanyDetail
        :company="transformCompanyData(company)"
        @approve="handleApprove"
        @reject="handleReject"
        @suspend="handleSuspend"
        @activate="handleActivate"
      />
    </div>
  </div>
</template>

<style scoped>
.company-detail-view {
  @apply max-w-7xl mx-auto py-6;
}

.loading {
  @apply text-center py-12 text-gray-500;
}
</style>
