<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { reactive, computed } from 'vue'
import draggable from 'vuedraggable'

const serviceGroupName = '회의실 예약'

const breadcrumbItems = [
  { label: '서비스 그룹', path: `admin/service-group-managation` },
  // 경로 설정
  { label: serviceGroupName, path: `` },
]

const services = reactive([
  {
    serviceId: 1,
    adminName: '김아영 관리자',
    serviceName: '회의실 B',
    updatedAt: '2025.10.03',
    status: 'upcoming',
  },
  {
    serviceId: 2,
    adminName: '유현경 관리자',
    serviceName: '회의실 A',
    updatedAt: '2025.10.03',
    status: 'upcoming',
  },
  {
    serviceId: 3,
    adminName: '박철수 관리자',
    serviceName: '회의실 C',
    updatedAt: '2025.10.04',
    status: 'in-progress',
  },
  {
    serviceId: 4,
    adminName: '이민호 관리자',
    serviceName: '회의실 D',
    updatedAt: '2025.10.01',
    status: 'finished',
  },
])

const goToServiceDetail = (id) => {
  // 서비스 상세 관리로 이동
}

// 상태별 computed 배열 + API 호출
const createStatusComputed = (statusName) =>
  computed({
    get: () => services.filter((s) => s.status === statusName),
    set: (newList) => {
      newList.forEach((item) => {
        const original = services.find((s) => s.serviceId === item.serviceId)
        if (original && original.status !== statusName) {
          original.status = statusName
          // 상태 변경 API 호출
          console.log(`${original.serviceName} 상태가 ${statusName}로 업데이트되었습니다.`)
        }
      })
    },
  })

// 서비스 추가
const createService = () => {}

const upcomingServices = createStatusComputed('upcoming')
const inProgressServices = createStatusComputed('in-progress')
const finishedServices = createStatusComputed('finished')
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
                <span class="service-name" @click="goToServiceDetail(s.serviceId)">{{
                  s.serviceName
                }}</span>
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
                <span class="service-name" @click="goToServiceDetail(s.serviceId)">{{
                  s.serviceName
                }}</span>
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
                <span class="service-name" @click="goToServiceDetail(s.serviceId)">{{
                  s.serviceName
                }}</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
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
</style>
