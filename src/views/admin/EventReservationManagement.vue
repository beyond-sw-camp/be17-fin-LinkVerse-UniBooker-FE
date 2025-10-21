<script setup>
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue' // Button 컴포넌트 import 추가
import { ref, computed } from 'vue'

const router = useRouter()

/* 서비스 상세 페이지로 이동 */
const goToServiceDetail = () => {
  router.push('/admin/service-group-edit')
}

/* 신청자 데이터 */
const applicants = ref([
  { id: 1, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 21일 15:20:00', status: '신청 완료' },
  { id: 2, name: '김철수', email: 'kim@gmail.com', date: '2025년 10월 20일 12:10:00', status: '취소' },
  { id: 3, name: '이영희', email: 'lee@gmail.com', date: '2025년 10월 19일 10:30:00', status: '신청 완료' },
  { id: 5, name: '박지성', email: 'park@gmail.com', date: '2025년 10월 18일 18:50:00', status: '신청 완료' },
])

const totalCapacity = ref(50)
const appliedCount = computed(() => applicants.value.filter(a => a.status !== '취소').length)
const progressPercentage = computed(() => (appliedCount.value / totalCapacity.value) * 100)

/* 필터 및 정렬 */
const excludeCanceled = ref(true)
const selection = ref(null)
const dropdownOptions = [
  { label: '이름순', value: 'name' },
  { label: '신청일순', value: 'date' },
]

const filteredApplicants = computed(() => {
  let list = excludeCanceled.value
    ? applicants.value.filter(a => a.status !== '취소')
    : [...applicants.value]

  if (selection.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  } else if (selection.value === 'date') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return list
})

/* 상태별 뱃지 스타일 */
const statusClasses = {
  '신청 완료': 'bg-green-100 text-green-800',
  '취소': 'bg-gray-100 text-gray-600',
}

/* 예약 취소 */
const cancelReservation = (id) => {
  if (confirm(`신청 번호 ${id}을(를) 취소하시겠습니까?`)) {
    const applicant = applicants.value.find(a => a.id === id)
    if (applicant) {
      applicant.status = '취소'
    }
    alert('신청이 취소되었습니다.')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-8">
      <h1 class="page-title">예약 관리</h1>

      <!-- 1. 상단 요약 카드 -->
      <div class="summary-card">
        <div class="summary-header">
          <h2 class="cursor-pointer hover:underline" @click="goToServiceDetail">
            보드게임 동아리
          </h2>
          <p class="period">모집 기간 : 2025/09/01 ~ 2025/10/31</p>
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="label">신청 현황</span>
            <div class="flex items-baseline gap-2">
              <span class="value-applied">{{ appliedCount }}</span>
              <span class="value-total">/ {{ totalCapacity }}명</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 2. 신청자 목록 카드 -->
      <div class="applicant-card">
        <div class="applicant-header">

          <!-- 오른쪽 정렬된 작은 컨트롤러 -->
          <div class="controls-wrapper">
            <Input type="checkbox" v-model="excludeCanceled" label="취소자 제외" />
            <Dropdown v-model="selection" :options="dropdownOptions" placeholder="정렬" width="w-28" />
          </div>
        </div>

        <div class="table-container">
          <table class="applicant-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>신청일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredApplicants" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.date }}</td>
                <td>
                  <span class="status-badge" :class="statusClasses[item.status]">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <Button 
                    v-if="item.status !== '취소'"
                    theme="danger" 
                    @click="cancelReservation(item.id)"
                  >
                    취소
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-title { @apply text-2xl font-bold text-gray-800; }
.section-title { @apply text-lg font-semibold text-gray-700; }

/* 요약 카드 */
.summary-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-between items-center;
}
.summary-header h2 { @apply text-2xl font-bold text-gray-900 mb-1; }
.period { @apply text-sm text-gray-500; }
.summary-stats { @apply flex flex-col items-end gap-3; }
.stat-item { @apply flex items-baseline gap-4; }
.label { @apply text-base text-gray-600 font-medium; }
.value-applied { @apply text-3xl font-bold text-primary; }
.value-total { @apply text-xl font-medium text-gray-500; }
.progress-bar-container { @apply w-64 h-2 bg-gray-200 rounded-full overflow-hidden; }
.progress-bar { @apply h-full bg-primary transition-all duration-500; }

/* 신청자 목록 카드 */
.applicant-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-4;
}
.applicant-header { @apply flex justify-end items-center mb-2; }
.controls-wrapper { @apply flex items-center gap-4 text-sm; }

.table-container { @apply border border-gray-200 rounded-lg overflow-hidden; }
.applicant-table { @apply w-full text-sm text-center; }
.applicant-table th { @apply bg-gray-50 text-gray-600 font-medium py-3 px-4 border-b border-gray-200; }
.applicant-table td { @apply py-4 px-4 border-b border-gray-100 last:border-b-0; }
.applicant-table tbody tr:hover { @apply bg-gray-50; }

.status-badge { @apply px-2 py-0.5 text-xs font-semibold rounded-md inline-block; }

/* Input, Dropdown 컴포넌트의 크기를 조절하기 위해 :deep() 사용 */
:deep(.controls-wrapper .input-container) { @apply text-sm; }
:deep(.controls-wrapper .dropdown-selected-container) { @apply text-sm py-1.5; }
</style>

