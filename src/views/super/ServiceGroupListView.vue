<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SuperBreadcrumb from '@/components/Breadcrumb.vue'
import superApi from '@/services/super/super_api'

const route = useRoute()
const router = useRouter()

// ===== 상태 관리 =====
const rawServiceGroups = ref([])
const loading = ref(false)
const error = ref(null)
const companyId = ref(route.params.companyId)
const actionLoading = ref(false)

/**
 * 서비스 그룹 목록 조회
 */
const fetchServiceGroups = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await superApi.getCompanyResourceGroups(companyId.value)

    if (response.isSuccess) {
      rawServiceGroups.value = response.data.resourceGroups || []
    } else {
      error.value = response.message || '데이터를 불러오는 데 실패했습니다.'
    }
  } catch (err) {
    console.error('❌ 서비스 그룹 목록 조회 실패:', err)
    error.value = '서버와의 연결에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * API 데이터를 기존 구조로 변환
 */
const serviceGroups = computed(() => {
  return rawServiceGroups.value.map((group) => {
    return {
      id: group.id,
      groupName: group.name,
      groupCode: group.groupCode || '-',
      category: group.category || '-',
      createdAt: formatDate(group.createdAt),
      updatedAt: formatDate(group.updatedAt),
      isActive: group.isActive,
      createdBy: group.administrator,
      updatedBy: group.updatedByName || '-',
    }
  })
})

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 상태별 배지 스타일 반환
 */
const getStatusBadgeClass = (isActive) => {
  return isActive
    ? 'px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800'
    : 'px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800'
}

/**
 * 상태 텍스트 반환
 */
const getStatusText = (isActive) => {
  return isActive ? '활성' : '비활성'
}

/**
 * 서비스 목록으로 이동
 */
const goToServiceList = (groupId) => {
  router.push({
    name: 'superServiceGroupDetail',
    params: {
      companyId: companyId.value,
      serviceGroupId: groupId,
    },
  })
}

/**
 * 상태 변경 처리
 */
const handleStatusChange = async (group) => {
  const isActivating = !group.isActive
  const actionText = isActivating ? '활성화' : '비활성화'
  const warningText = isActivating 
    ? '' 
    : '\n비활성화하면 일반 사용자가 해당 서비스를 볼 수 없게 됩니다.'

  const confirmed = confirm(
    `'${group.groupName}'을(를) ${actionText}하시겠습니까?${warningText}`
  )

  if (!confirmed) return

  actionLoading.value = true

  try {
    const response = isActivating
      ? await superApi.activateResourceGroup(group.id)
      : await superApi.deactivateResourceGroup(group.id)

    if (response.isSuccess) {
      alert(response.message || `서비스 그룹이 ${actionText}되었습니다.`)
      await fetchServiceGroups()
    } else {
      alert(response.message || '상태 변경에 실패했습니다.')
    }
  } catch (err) {
    console.error('❌ 상태 변경 실패:', err)
    alert('서버와의 연결에 실패했습니다.')
  } finally {
    actionLoading.value = false
  }
}

// 브레드크럼 항목
const breadcrumbItems = [
  { label: '기업 목록', path: '/super/companies' },
  { label: '기업 상세', path: `/super/companies/${companyId.value}` },
  { label: '서비스 그룹 목록' },
]

onMounted(() => {
  fetchServiceGroups()
})
</script>

<template>
  <SuperBreadcrumb :items="breadcrumbItems" />
  <span class="components-page-title">서비스 그룹 목록</span>

  <!-- 로딩 상태 -->
  <div v-if="loading" class="components-white-container">
    <div class="loading-message">로딩 중...</div>
  </div>

  <!-- 에러 상태 -->
  <div v-else-if="error" class="components-white-container">
    <div class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchServiceGroups" class="retry-button">다시 시도</button>
    </div>
  </div>

  <!-- 데이터 없음 -->
  <div v-else-if="serviceGroups.length === 0" class="components-white-container">
    <div class="empty-message">등록된 서비스 그룹이 없습니다.</div>
  </div>

  <!-- 테이블 -->
  <div v-else class="components-white-container">
    <div class="components-super-table-container">
      <table class="components-super-table">
        <thead>
          <tr>
            <th>그룹명</th>
            <th>그룹코드</th>
            <th>카테고리</th>
            <th>생성일자</th>
            <th>수정일자</th>
            <th>상태</th>
            <th>생성자</th>
            <th>수정자</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in serviceGroups" :key="i">
            <td>
              <div class="service-link" @click="goToServiceList(s.id)">
                {{ s.groupName }} <img src="/assets/icons/ic-arrow-outward.png" />
              </div>
            </td>
            <td>{{ s.groupCode }}</td>
            <td>{{ s.category }}</td>
            <td>{{ s.createdAt }}</td>
            <td>{{ s.updatedAt }}</td>
            <td>
              <span :class="getStatusBadgeClass(s.isActive)">
                {{ getStatusText(s.isActive) }}
              </span>
            </td>
            <td>{{ s.createdBy }}</td>
            <td>{{ s.updatedBy }}</td>
            <td>
              <button
                @click.stop="handleStatusChange(s)"
                :disabled="actionLoading"
                :class="s.isActive ? 'action-button-deactivate' : 'action-button-activate'"
              >
                {{ s.isActive ? '비활성화' : '활성화' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.loading-message,
.error-message,
.empty-message {
  @apply text-center py-12 text-gray-500;
}

.error-message p {
  @apply text-red-600 mb-4;
}

.retry-button {
  @apply px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors;
}

td img {
  @apply h-[16px];
}

.service-link {
  @apply flex items-center hover:underline cursor-pointer;
}

/* 액션 버튼 */
.action-button-activate {
  @apply px-3 py-1 text-sm rounded bg-green-600 text-white 
         hover:bg-green-700 transition-colors disabled:opacity-50 
         disabled:cursor-not-allowed;
}

.action-button-deactivate {
  @apply px-3 py-1 text-sm rounded bg-gray-600 text-white 
         hover:bg-gray-700 transition-colors disabled:opacity-50 
         disabled:cursor-not-allowed;
}
</style>
