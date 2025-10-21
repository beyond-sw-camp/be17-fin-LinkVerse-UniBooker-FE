<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import { reactive, computed, ref } from 'vue'
import draggable from 'vuedraggable'

const serviceGroupName = '회의실 예약'

const breadcrumbItems = [
  { label: '서비스 그룹', path: `admin/service-group-managation` },
  { label: serviceGroupName, path: `` },
]

// 더미 서비스 데이터
const services = reactive([
  {
    serviceId: 1,
    adminName: '김아영 관리자',
    serviceName: '회의실 B',
    updatedAt: '2025.10.03',
    status: 'upcoming',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 10,
    location: 'B동 2층',
    description: '회의실 B 예약',
  },
  {
    serviceId: 2,
    adminName: '유현경 관리자',
    serviceName: '회의실 A',
    updatedAt: '2025.10.03',
    status: 'upcoming',
    startTime: '10:30',
    endTime: '11:30',
    capacity: 8,
    location: 'A동 1층',
    description: '회의실 A 예약',
  },
  {
    serviceId: 3,
    adminName: '박철수 관리자',
    serviceName: '회의실 C',
    updatedAt: '2025.10.04',
    status: 'in-progress',
    startTime: '11:00',
    endTime: '12:00',
    capacity: 12,
    location: 'C동 3층',
    description: '회의실 C 예약',
  },
  {
    serviceId: 4,
    adminName: '이민호 관리자',
    serviceName: '회의실 D',
    updatedAt: '2025.10.01',
    status: 'finished',
    startTime: '13:00',
    endTime: '14:00',
    capacity: 5,
    location: 'D동 4층',
    description: '회의실 D 예약',
  },
])

const selectedService = reactive({
  serviceId: null,
  serviceName: '',
  startTime: '',
  endTime: '',
  capacity: 0,
  location: '',
  description: '',
})

const showDetailModal = ref(false)

// 모달 열기
const viewServiceDetail = (id) => {
  const service = services.find((s) => s.serviceId === id)
  if (service) {
    Object.assign(selectedService, service)
    showDetailModal.value = true
  }
}

const goToEditService = () => {}

// 상태별 computed 배열 + 상태 변경 시 로그(API 호출 시점)
const createStatusComputed = (statusName) =>
  computed({
    get: () => services.filter((s) => s.status === statusName),
    set: (newList) => {
      newList.forEach((item) => {
        const original = services.find((s) => s.serviceId === item.serviceId)
        if (original && original.status !== statusName) {
          original.status = statusName
          console.log(`${original.serviceName} 상태가 ${statusName}로 업데이트되었습니다.`)
          // 실제 API 호출 위치
          // axios.patch(`/api/services/${original.serviceId}/status`, { status: statusName })
        }
      })
    },
  })

const upcomingServices = createStatusComputed('upcoming')
const inProgressServices = createStatusComputed('in-progress')
const finishedServices = createStatusComputed('finished')

// 서비스 추가 (더미로 새로운 서비스 생성)
const createService = () => {
  const newId = services.length + 1
  services.push({
    serviceId: newId,
    adminName: '신규 관리자',
    serviceName: `회의실 ${String.fromCharCode(64 + newId)}`,
    updatedAt: '2025.10.21',
    status: 'upcoming',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 5,
    location: `${String.fromCharCode(64 + newId)}동`,
    description: '신규 서비스',
  })
}
</script>

<template>
  <AdminLayout>
    <Breadcrumb :items="breadcrumbItems" />
    <div class="upper-bar">
      <div class="components-page-title">서비스 관리</div>
      <span class="plus-btn" @click="createService">+</span>
    </div>
    <div class="content-container">
      <!-- 진행 전 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-upcoming"></div>
          진행 전 서비스
        </div>
        <draggable
          v-model="upcomingServices"
          group="services"
          :item-key="'serviceId'"
          class="service-list"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.adminName }}</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div>
                <span class="service-name" @click="viewServiceDetail(s.serviceId)">
                  {{ s.serviceName }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 진행 중 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-in-progress"></div>
          진행 중인 서비스
        </div>
        <draggable
          v-model="inProgressServices"
          group="services"
          :item-key="'serviceId'"
          class="service-list"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.adminName }}</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div>
                <span class="service-name" @click="viewServiceDetail(s.serviceId)">
                  {{ s.serviceName }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 종료된 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-finished"></div>
          종료된 서비스
        </div>
        <draggable
          v-model="finishedServices"
          group="services"
          :item-key="'serviceId'"
          class="service-list"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.adminName }}</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div>
                <span class="service-name" @click="viewServiceDetail(s.serviceId)">
                  {{ s.serviceName }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <Modal :open="showDetailModal">
      <div class="service-image mb-4"></div>

      <div class="info-row">
        <span class="info-label font-semibold">서비스명:</span>
        <span>{{ selectedService.serviceName }}</span>
      </div>

      <div class="info-row">
        <span class="info-label font-semibold">시작시간:</span>
        <span>{{ selectedService.startTime }}</span>
      </div>

      <div class="info-row">
        <span class="info-label font-semibold">종료시간:</span>
        <span>{{ selectedService.endTime }}</span>
      </div>

      <div class="info-row">
        <span class="info-label font-semibold">인원수:</span>
        <span>{{ selectedService.capacity }}</span>
      </div>

      <div class="info-row">
        <span class="info-label font-semibold">장소:</span>
        <span>{{ selectedService.location }}</span>
      </div>

      <div class="info-row">
        <span class="info-label font-semibold">설명:</span>
        <span>{{ selectedService.description }}</span>
      </div>

      <div class="modal-footer">
        <Button class="modal-btn" :theme="'gray'" @click="showDetailModal = false">닫기</Button>
        <Button class="modal-btn" @click="goToEditService">수정</Button>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
.upper-bar {
  @apply flex;
}
.upper-bar div {
  @apply grow;
}
.plus-btn {
  @apply font-semibold text-2xl text-gray-dark cursor-pointer p-2;
}
.content-container {
  @apply flex gap-3 h-full;
}
.status-container {
  @apply grow flex flex-col gap-2;
}
.status {
  @apply flex bg-gray-300 rounded-md px-3 py-2 font-normal items-center;
}
.status-upcoming {
  @apply rounded-full w-4 h-4 mr-2 bg-blue-300 border-2 border-blue-500;
}
.status-in-progress {
  @apply rounded-full w-4 h-4 mr-2 bg-green-300 border-2 border-green-500;
}
.status-finished {
  @apply rounded-full w-4 h-4 mr-2 bg-red-300 border-2 border-red-500;
}
.service-list {
  @apply bg-gray-50 p-3 rounded-md flex flex-col gap-2 h-full overflow-y-auto;
}
.service {
  @apply bg-white rounded-md p-2 hover:shadow-md cursor-pointer;
}
.service-info {
  @apply flex justify-between text-sm text-gray-700 mb-1;
}
.service-name {
  @apply text-blue-600 hover:underline cursor-pointer;
}
.service-image {
  @apply w-full h-40 bg-gray-200 rounded-md;
}
.info-row {
  @apply flex gap-2 mb-2 items-center  min-w-[300px];
}
.info-label {
  @apply w-24 text-gray-700 text-sm;
}
.modal-footer {
  @apply flex float-right gap-3 mt-2;
}
.modal-btn {
  @apply w-[130px] text-sm;
}
</style>
