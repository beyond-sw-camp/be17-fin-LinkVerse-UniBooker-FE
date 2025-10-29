<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Button from '@/components/Button.vue'
import superApi from '@/services/super/super_api'

const route = useRoute()

// ===== 상태 관리 =====
const managers = ref([])
const loading = ref(false)
const error = ref(null)
const companyId = ref(route.params.companyId)

/**
 * 관리자 목록 조회
 */
const fetchManagers = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await superApi.getCompanyManagers(companyId.value)

    if (response.isSuccess) {
      managers.value = response.data.managers
    } else {
      error.value = response.message || '데이터를 불러오는 데 실패했습니다.'
    }
  } catch (err) {
    error.value = '서버와의 연결에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * 상태 변경 처리
 */
const handleStatusChange = async (manager, newStatus) => {
  const statusText = newStatus === 'ACTIVE' ? '활성화' : '정지'

  if (!confirm(`정말 ${manager.name}님의 상태를 ${statusText}로 변경하시겠습니까?`)) {
    return
  }

  try {
    const response = await superApi.updateManagerStatus(manager.userId, newStatus)

    if (response.isSuccess) {
      alert(`상태가 ${statusText}로 변경되었습니다.`)
      await fetchManagers() // 목록 재조회
    } else {
      alert(`상태 변경에 실패했습니다: ${response.message}`)
    }
  } catch (err) {
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}

/**
 * 날짜 포맷팅 (YYYY.MM.DD HH:mm)
 */
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/**
 * 역할 뱃지 CSS 클래스 반환
 */
const getRoleBadgeClass = (role) => {
  const roleMap = {
    ADMIN: 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium',
    MANAGER: 'px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium',
  }
  return roleMap[role] || 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium'
}

/**
 * 역할 텍스트 변환
 */
const getRoleText = (role) => {
  return role === 'ADMIN' ? '관리자' : '매니저'
}

/**
 * 상태 뱃지 CSS 클래스 반환
 */
const getStatusBadgeClass = (status) => {
  const statusMap = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    DELETED: 'bg-red-100 text-red-800',
  }
  return `px-2 py-1 rounded text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`
}

/**
 * 상태 텍스트 변환
 */
const getStatusText = (status) => {
  const map = {
    ACTIVE: '활성',
    INACTIVE: '승인대기',
    SUSPENDED: ' 정지 ',
    DELETED: ' 삭제 ',
  }
  return map[status] || status
}

onMounted(() => {
  fetchManagers()
})
</script>

<template>
  <Breadcrumb
    :items="[
      { label: '기업 목록', path: '/super/companies' },
      { label: '기업 상세', path: `/super/companies/${companyId}` },
      { label: '관리자 계정 목록' },
    ]"
  />
  <span class="components-page-title">관리자 계정 목록</span>

  <div class="components-white-container">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <p>로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <Button @click="fetchManagers">다시 시도</Button>
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="managers.length === 0" class="empty-container">
      <p>관리자 계정이 없습니다.</p>
    </div>

    <!-- 테이블 -->
    <div v-else class="components-super-table-container">
      <table class="components-super-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>권한</th>
            <th>이메일</th>
            <th>연락처</th>
            <th>상태</th>
            <th>생성일시</th>
            <th>수정일시</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in managers" :key="manager.userId">
            <td>{{ manager.name }}</td>
            <td>
              <span :class="getRoleBadgeClass(manager.role)">
                {{ getRoleText(manager.role) }}
              </span>
            </td>
            <td class="info-text">{{ manager.email }}</td>
            <td class="info-text">{{ manager.phone || '-' }}</td>
            <td>
              <span :class="getStatusBadgeClass(manager.status)">
                {{ getStatusText(manager.status) }}
              </span>
            </td>
            <td class="info-text">{{ formatDateTime(manager.createdAt) }}</td>
            <td class="info-text">{{ formatDateTime(manager.updatedAt) }}</td>
            <td>
              <div class="action-buttons">
                <!-- ACTIVE 상태일 때 -->
                <Button
                  v-if="manager.status === 'ACTIVE'"
                  @click="handleStatusChange(manager, 'SUSPENDED')"
                  theme="gray"
                  size="sm"
                >
                  정지
                </Button>

                <!-- SUSPENDED 상태일 때 -->
                <Button
                  v-else-if="manager.status === 'SUSPENDED'"
                  @click="handleStatusChange(manager, 'ACTIVE')"
                  theme="primary"
                  size="sm"
                >
                  활성화
                </Button>

                <!-- INACTIVE 상태일 때는 버튼 없음 -->
                <span v-else class="text-gray-400 text-sm">-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.loading-container,
.error-container,
.empty-container {
  @apply text-center py-12;
}

.error-message {
  @apply text-red-600 mb-4;
}

.empty-container p {
  @apply text-gray-400 text-lg;
}

.action-buttons {
  @apply flex gap-2 justify-center;
}

.info-text {
  @apply text-[12px];
}
</style>
