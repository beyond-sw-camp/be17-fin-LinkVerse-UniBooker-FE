<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import { ref, computed } from 'vue'

/* 신청자 데이터 */
const applicants = ref([
  { id: 1, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 21일 15:20:00', status: '신청 완료' },
  { id: 2, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 20일 12:10:00', status: '취소' },
  { id: 3, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 19일 10:30:00', status: '신청 완료' },
  { id: 5, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 18일 18:50:00', status: '신청 완료' },
  { id: 6, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 20일 12:10:00', status: '신청 완료' },
  { id: 7, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 19일 10:30:00', status: '신청 완료' },
  { id: 8, name: '윤소민', email: 'test@gmail.com', date: '2025년 10월 18일 18:50:00', status: '신청 완료' },
])

/* 체크박스 기본값 true */
const excludeCanceled = ref(true)

/* 드롭다운 (정렬 기능 아직 없음) */
const selection = ref(null)
const dropdownOptions = [
  { label: '이름순', value: 1 },
  { label: '신청일순', value: 2 },
]

const filteredApplicants = computed(() => {
  return excludeCanceled.value
    ? applicants.value.filter(a => a.status !== '취소')
    : applicants.value
})

/* 예약 취소 */
const cancelReservation = () => {
  if (confirm('이 신청을 취소하시겠습니까?')) {
    alert('신청이 취소되었습니다.')
  }
}
</script>

<template>
  <AdminLayout>
    <!-- 제목 -->
    <div class="components-page-title mb-4">
      <span>예약 관리</span>
    </div>

    <!-- 요약 카드 -->
    <div class="summary-card">
      <div class="summary-header">
        <h2>보드게임 동아리</h2>
        <p class="period">모집 기간 : 2025/09/01 ~ 2025/10/31</p>
      </div>

      <div class="summary-stats">
        <div class="stat-item">
          <span class="label applied">신청</span>
          <span class="value applied">17명</span>
        </div>
        <div class="stat-item">
          <span class="label total">모집</span>
          <span class="value total">50명</span>
        </div>
      </div>
    </div>

    <!-- 신청자 목록 -->
    <div class="applicant-section mt-16">
      <div class="flex justify-between items-center mb-6">
        <h1 class="components-page-title">신청자 목록</h1>
        <div class="flex items-center gap-6">
          <Input
            type="checkbox"
            v-model="excludeCanceled"
            label="취소 제외"
            class="flex items-center leading-none text-sm whitespace-nowrap"
          />
          <Dropdown
            v-model="selection"
            :options="dropdownOptions"
            placeholder="정렬 선택"
            width="w-40"
          />
        </div>
      </div>

      <table class="applicant-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>신청일</th>
            <th>상태</th>
            <th>신청 취소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredApplicants" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.status }}</td>
            <td>
              <Button
                size="sm"
                class="!px-3 !py-1 text-sm transition-none"
                :class="item.status === '취소'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:white'
                  : ''"
                :disabled="item.status === '취소'"
                @click="cancelReservation"
              >
                취소
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<style scoped>
.summary-card {
  @apply bg-gray-50 rounded-lg shadow flex justify-between items-center px-10 py-8;
}

.summary-header h2 {
  @apply text-2xl font-bold mb-2;
}

.period {
  @apply text-xs text-gray-dark/70;
}

.summary-stats {
  @apply flex items-center gap-10;
}

.stat-item {
  @apply flex items-baseline gap-3;
}

.label {
  @apply text-[15px] text-gray-dark font-medium;
}
.label.applied {
  @apply text-primary;
}
.label.total {
  @apply text-gray-dark;
}

.value {
  @apply text-[40px] font-bold leading-none;
}
.value.applied {
  @apply text-primary;
}
.value.total {
  @apply text-gray-dark;
}

/* 신청자 목록 */
.applicant-table {
  @apply w-full border-collapse bg-white shadow rounded-lg text-sm;
}

.applicant-table th {
  @apply bg-gray-100 text-gray-700 font-medium py-2 border-b px-5;
}

.applicant-table td {
  @apply text-center py-3 border-b;
}
</style>
