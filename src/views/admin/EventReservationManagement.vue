<script setup>
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import { ref, computed, onMounted } from 'vue'
import serviceApi from '@/services/service/service_api'
import reservationApi from '@/services/reservation/reservation_api'

const router = useRouter()
const route = useRoute()
const serviceId = route.params.serviceId
const serviceGroupId = ref(null)
const showDetailModal = ref(false)

const service = ref({})
const reservations = ref([])

const getService = async () => {
  const serviceInfo = await serviceApi.getServiceInfo(serviceId)
  service.value = serviceInfo
  const customFields = await serviceApi.getResourceCustomFieldAndValue(serviceId)
  service.value.customFields = customFields.data.data
  serviceGroupId.value = service.value.resourceGroupdId

  console.log('service:', service.value)
}

const getReservations = async () => {
  const response = await reservationApi.getServiceReservations(serviceId)
  // API 데이터가 배열이라고 가정
  reservations.value = response.map((r) => ({
    id: r.id,
    name: r.userName,
    email: r.email,
    date: new Date(r.applicationDate).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    status: r.status === 'CONFIRMED' ? '신청 완료' : r.status,
  }))

  applicants.value = [...reservations.value]
}

const openServiceDetailModal = () => {
  showDetailModal.value = true
}

/* 페이지 이동 */
const goToEditService = (serviceId) => {
  if (!serviceId) {
    console.warn('서비스 ID가 없습니다.')
    return
  }

  router.push({
    name: 'ServiceEdit',
    params: { serviceGroupId, serviceId },
  })
}

/* 신청자 데이터 */
const applicants = ref([])

const totalCapacity = ref(50)
const appliedCount = computed(() => applicants.value.filter((a) => a.status !== '취소').length)
const progressPercentage = computed(() => (appliedCount.value / totalCapacity.value) * 100)

/*   필터 및 정렬 */
const excludeCanceled = ref(true)
const selection = ref(null)
const dropdownOptions = [
  { label: '이름순', value: 'name' },
  { label: '신청일순', value: 'date' },
]

const filteredApplicants = computed(() => {
  let list = excludeCanceled.value
    ? applicants.value.filter((a) => a.status !== '취소')
    : [...applicants.value]

  if (selection.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  } else if (selection.value === 'date') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return list
})

/* 상태 뱃지 및 취소 기능 */
const statusClasses = {
  '신청 완료': 'bg-green-100 text-green-800',
  취소: 'bg-gray-100 text-gray-600',
}

const cancelReservation = (id) => {
  if (confirm(`신청 번호 ${id}을(를) 취소하시겠습니까?`)) {
    const applicant = applicants.value.find((a) => a.id === id)
    if (applicant) applicant.status = '취소'
    alert('신청이 취소되었습니다.')
  }
}

onMounted(() => {
  getService()
  getReservations()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-8">
      <h1 class="page-title">예약 관리</h1>

      <!-- 요약 카드 & 신청자 목록 카드 -->
      <div class="space-y-3">
        <!-- 1. 요약 카드 -->
        <div class="summary-card">
          <div class="summary-header">
            <h2 class="cursor-pointer hover:underline" @click="openServiceDetailModal">
              {{ service.name }}
            </h2>
            <p class="period">모집 기간 : {{ service.startDate }} ~ {{ service.endDate }}</p>
          </div>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="label">신청 현황</span>
              <div class="flex items-baseline gap-2">
                <span class="value-applied">{{ appliedCount }}</span>
                <span class="value-total">/ {{ service.capacity }}명</span>
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
            <div class="controls-wrapper">
              <Input type="checkbox" v-model="excludeCanceled" label="취소자 제외" />
              <Dropdown
                v-model="selection"
                :options="dropdownOptions"
                placeholder="정렬"
                width="w-28"
              />
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
                      size="sm"
                      v-if="item.status !== '취소'"
                      theme="primary"
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
    </div>
    <Modal :open="showDetailModal">
      <div class="modal-container">
        <img class="resource-image-box" :src="service.resourceImage" alt="리소스 이미지" />

        <div class="resource-info-container">
          <h2>{{ service.name }}</h2>

          <!-- 운영 시간 -->
          <div class="info-row-time">
            <span class="info-label">운영시간</span>

            <div class="daily-timeslots">
              <div
                v-for="daySlot in service.dailyTimeSlots"
                :key="daySlot.day"
                class="day-container"
              >
                <span>{{ daySlot.day }}</span>
                <div>
                  <div v-for="time in daySlot.slots" :key="time">{{ time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 예외 시간 -->
          <div class="info-row-time">
            <span class="info-label">예외시간</span>

            <div class="daily-timeslots">
              <div
                v-for="item in service.exceptionTimeSlots"
                :key="item.date"
                class="day-container"
              >
                <span class="w-[78px]">{{ item.date }}</span>
                <div class="w-[305px]">
                  {{ item.slots.join(', ') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 인원수 -->
          <div class="info-row">
            <span class="info-label">인원수</span>
            <span>{{ service.capacity }} 명</span>
          </div>

          <!-- 커스텀 필드 -->
          <div v-if="service.customFields.length">
            <div v-for="(field, index) in service.customFields" :key="index" class="info-row">
              <span class="info-label">{{ field.fieldName }}</span>
              <span>{{ field.value }}</span>
            </div>
          </div>

          <!-- 설명 -->
          <div class="service-info-description-container">
            <span class="info-label">설명</span>
            <p>{{ service.description }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <Button class="modal-btn" :theme="'gray'" @click="showDetailModal = false">닫기</Button>
          <Button class="modal-btn" @click="goToEditService(service.id)">수정</Button>
        </div>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
.page-title {
  @apply text-xl font-medium text-text;
}

/* 요약 카드 */
.summary-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-between items-center;
}
.summary-header h2 {
  @apply text-2xl font-bold text-gray-900 mb-1;
}
.period {
  @apply text-sm text-gray-500;
}
.summary-stats {
  @apply flex flex-col items-end gap-3;
}
.stat-item {
  @apply flex items-baseline gap-4;
}
.label {
  @apply text-base text-gray-600 font-medium;
}
.value-applied {
  @apply text-3xl font-bold text-primary;
}
.value-total {
  @apply text-xl font-medium text-gray-500;
}
.progress-bar-container {
  @apply w-64 h-2 bg-gray-200 rounded-full overflow-hidden;
}
.progress-bar {
  @apply h-full bg-primary transition-all duration-500;
}

/* 신청자 목록 카드 */
.applicant-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-3;
}
.applicant-header {
  @apply flex justify-end items-center mb-2;
}
.controls-wrapper {
  @apply flex items-center gap-4 text-sm;
}
.table-container {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}
.applicant-table {
  @apply w-full text-sm text-center;
}
.applicant-table th {
  @apply bg-gray-50 text-gray-600 font-medium py-3 px-4 border-b border-gray-200;
}
.applicant-table td {
  @apply py-4 px-4 border-b border-gray-100 last:border-b-0;
}
.applicant-table tbody tr:hover {
  @apply bg-gray-50;
}
.status-badge {
  @apply px-2 py-0.5 text-xs font-semibold rounded-md inline-block;
}

/* Input / Dropdown 사이즈 조정 */
:deep(.controls-wrapper .input-container) {
  @apply text-sm;
}
:deep(.controls-wrapper .dropdown-selected-container) {
  @apply text-sm py-1.5;
}

/** 서비스 상세 모달 */

.service-info {
  @apply flex justify-between text-[12px] text-text border-b border-gray-line p-[13px];
}
.service-name {
  @apply text-blue-600 hover:font-medium hover:underline cursor-pointer text-[14px];
}
.service-image {
  @apply w-full h-40 bg-gray-200 rounded-md;
}
.info-row {
  @apply flex gap-2 mb-3 items-center  min-w-[300px] text-[14px];
}
.info-label {
  @apply w-24 text-[#535353] text-[14px];
}
.modal-footer {
  @apply flex float-right gap-1 mt-2 w-full justify-end;
}
.modal-btn {
  @apply w-[80px] text-sm rounded-[5px];
}

.service-name-container {
  @apply px-[14px] py-[10px];
}

.resource-image-box {
  @apply w-full h-[220px] object-cover rounded-[5px];
}

.modal-container {
  @apply w-[512px] max-h-[500px] flex flex-col overflow-y-auto;
}

.modal-container h2 {
  @apply text-[18px] font-bold mt-[15px] mb-[15px];
}

.resource-info-container {
  @apply p-[5px] flex-1;
}

.service-info-description-container {
  @apply flex items-start gap-2 mt-[10px];
}

.service-info-description-container p {
  @apply text-[14px] mb-[20px] max-w-[650px];
}

::-webkit-scrollbar-track {
  background: #eeeeee;
}

.info-row-time {
  @apply flex gap-2 mb-3;
}

.day-container {
  @apply flex gap-3 text-[14px] mb-[2px];
}
</style>
