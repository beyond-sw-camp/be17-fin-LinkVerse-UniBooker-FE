<script setup>
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import SuperBreadcrumb from '@/components/SuperBreadcrumb.vue'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyName = route.params.companyName
const serviceGroupName = route.params.serviceGroupName
const serviceName = route.params.serviceName

// 서비스 정보
const service = {
  name: serviceName,
  status: '활성',
  capacity: 10,
  createdAt: '2025-09-01',
  createdBy: '김철수',
  updatedAt: '2025-10-10',
  updatedBy: '박영희',
  description: '이 회의실은 내부 회의를 위한 공간으로 예약 관리가 가능합니다.',
}

// 예약 목록
const reservations = ref([
  {
    id: 101,
    user: '홍길동',
    start: '2025-10-20T09:00',
    end: '2025-10-20T10:00',
    status: '예약완료',
  },
  { id: 102, user: '김민수', start: '2025-10-20T13:00', end: '2025-10-20T14:30', status: '취소' },
  {
    id: 103,
    user: '박지현',
    start: '2025-10-21T09:00',
    end: '2025-10-21T10:00',
    status: '예약완료',
  },
  {
    id: 104,
    user: '이수민',
    start: '2025-10-21T11:00',
    end: '2025-10-21T12:00',
    status: '지난 예약',
  },
])

// 정렬
const sortKey = ref(null)
const sortOrder = ref('asc')
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
const sortedReservations = computed(() => {
  let list = [...reservations.value]
  if (sortKey.value) {
    list.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  return list
})

// 필터 모달
const showFilterModal = ref(false)
const filterStart = ref('')
const filterEnd = ref('')

const applyFilter = () => {
  showFilterModal.value = false
}

// 필터링된 목록
const filteredReservations = computed(() => {
  if (!filterStart.value && !filterEnd.value) return sortedReservations.value
  return sortedReservations.value.filter((r) => {
    return (
      (!filterStart.value || r.start >= filterStart.value) &&
      (!filterEnd.value || r.end <= filterEnd.value)
    )
  })
})
</script>

<template>
  <SuperBreadcrumb />
  <div class="components-page-title">서비스 상세</div>

  <!-- 서비스 정보 -->
  <div class="components-white-container">
    <div class="subtitle">{{ service.name }}</div>
    <p class="text-sm text-gray-600">{{ service.status }} | {{ service.capacity }}명 수용</p>
    <p class="text-sm text-gray-600 mt-1">{{ service.description }}</p>

    <!-- 예약 목록 -->
    <div class="flex justify-between items-center mt-6 mb-2">
      <div class="subtitle">예약 내역</div>
    </div>

    <!-- 캘린더 버튼 -->
    <div class="calendar-btn" @click="showFilterModal = true">
      <div>
        시작 시간:
        <span class="font-medium">{{
          filterStart ? new Date(filterStart).toLocaleString() : '선택 안됨'
        }}</span>
      </div>
      <div>
        종료 시간:
        <span class="font-medium">{{
          filterEnd ? new Date(filterEnd).toLocaleString() : '선택 안됨'
        }}</span>
      </div>
    </div>

    <!-- 필터 모달 -->
    <Modal :open="showFilterModal" class="filter-modal">
      <h3 class="mb-3 font-semibold">기간 선택</h3>
      <div class="space-y-2">
        <div>
          <label>시작 일시</label>
          <input type="datetime-local" v-model="filterStart" step="1800" />
        </div>
        <div>
          <label>종료 일시</label>
          <input type="datetime-local" v-model="filterEnd" step="1800" />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button @click="showFilterModal = false" class="cancel-btn">취소</Button>
        <Button @click="applyFilter">적용</Button>
      </div>
    </Modal>

    <div class="components-super-table-container">
      <table class="components-super-table">
        <thead>
          <tr>
            <th>예약 번호</th>
            <th>예약자</th>
            <th @click="sortBy('start')">시작 일시 ⬍</th>
            <th>종료 일시</th>
            <th @click="sortBy('status')">상태 ⬍</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filteredReservations" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.user }}</td>
            <td>{{ new Date(r.start).toLocaleString() }}</td>
            <td>{{ new Date(r.end).toLocaleString() }}</td>
            <td>{{ r.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.path {
  @apply text-sm text-gray-600 mb-2;
}
.path span {
  @apply cursor-pointer hover:underline;
}
.subtitle {
  @apply text-lg font-semibold;
}
.calendar-btn {
  @apply inline-flex float-right bg-white p-2 ml-auto mb-3 rounded-md shadow-md text-sm text-gray-dark;
}
.calendar-btn div {
  @apply w-[250px];
}
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center;
}
.filter-modal label {
  @apply mr-3;
}
.cancel-btn {
  @apply bg-gray-300 hover:bg-gray-400;
}
</style>
