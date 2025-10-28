<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import superApi from '@/services/super/super_api'
import CompanyDetail from '@/components/CompanyDetail.vue'

const route = useRoute()
const company = ref(null)
const isConfirmModalOpen = ref(false)
const targetStatus = ref('')

/**
 * 기업 상세 정보 조회
 */
const fetchCompanyDetail = async () => {
  try {
    const response = await superApi.getCompanyDetail(route.params.companyId)

    if (response && response.isSuccess && response.data) {
      company.value = response.data
      console.log('✅ 기업 상세:', company.value)
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
 * 서비스 정지 처리
 */
const handleSuspend = () => {
  targetStatus.value = 'SUSPENDED'
  isConfirmModalOpen.value = true
}

/**
 * 서비스 재개 처리
 */
const handleActivate = () => {
  targetStatus.value = 'ACTIVE'
  isConfirmModalOpen.value = true
}

/**
 * 상태 변경 확정
 */
const confirmStatusChange = async () => {
  try {
    await superApi.updateCompanyStatus(company.value.companyId, targetStatus.value)
    await fetchCompanyDetail()
    isConfirmModalOpen.value = false
    alert('상태가 변경되었습니다.')
  } catch (error) {
    console.error('❌ 상태 변경 실패:', error)
    alert('상태 변경에 실패했습니다.')
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
    status: apiData.status === 'ACTIVE',
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

/**
 * 상태 텍스트 변환
 */
const getStatusText = (status) => {
  const statusMap = {
    ACTIVE: '활성',
    SUSPENDED: '정지',
    PENDING: '승인 대기',
    REJECTED: '거절',
  }
  return statusMap[status] || status
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
      <!-- 상단 헤더 -->
      <div class="page-header">
        <h1>{{ company.companyName }}</h1>
        <div class="status-badge" :class="'status-' + company.status.toLowerCase()">
          {{ getStatusText(company.status) }}
        </div>
      </div>

      <!-- CompanyDetail 컴포넌트 사용 -->
      <CompanyDetail :company="transformCompanyData(company)">
        <!-- 상태 변경 버튼 추가 (slot 사용) -->
        <template #additional-section>
          <div class="action-section">
            <button v-if="company.status === 'ACTIVE'" @click="handleSuspend" class="btn-danger">
              서비스 정지
            </button>
            <button
              v-else-if="company.status === 'SUSPENDED'"
              @click="handleActivate"
              class="btn-primary"
            >
              서비스 재개
            </button>
          </div>
        </template>
      </CompanyDetail>
    </div>

    <!-- 확인 모달 -->
    <div v-if="isConfirmModalOpen" class="modal-overlay" @click="isConfirmModalOpen = false">
      <div class="modal-content" @click.stop>
        <h3>상태 변경 확인</h3>
        <p>
          정말 {{ targetStatus === 'SUSPENDED' ? '서비스를 정지' : '서비스를 재개' }}하시겠습니까?
        </p>
        <div class="modal-buttons">
          <button @click="confirmStatusChange" class="btn-confirm">확인</button>
          <button @click="isConfirmModalOpen = false" class="btn-cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.loading {
  text-align: center;
  padding: 48px;
  color: #666;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-suspended {
  background: #f8d7da;
  color: #721c24;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.action-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-danger {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
}

.modal-content p {
  margin: 0 0 24px 0;
  color: #666;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-confirm,
.btn-cancel {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background: #007bff;
  color: white;
}

.btn-confirm:hover {
  background: #0056b3;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}
</style>
