<script setup>
import Modal from '@/components/Modal.vue'
import SuperBreadcrumb from '@/components/Breadcrumb.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showModal = ref(false)

const companyName = route.params.companyName
const serviceGroupName = route.params.serviceGroupName
const serviceGroup = {
  status: '활성',
  type: '회의실',
  creator: '홍길동',
  created_at: '2025-10-16',
  description: '이 서비스 그룹은 회사 내 회의실 예약 관리를 위해 사용됩니다.',
}

const goToServiceDetail = (serviceName) => {
  router.push(
    `/super/companies/${encodeURIComponent(companyName)}/services/${serviceGroupName}/${serviceName}`,
  )
}

const services = [
  {
    name: '회의실 A',
    status: '활성',
    capacity: 10,
    createdAt: '2025-09-01',
    createdBy: '김철수',
    updatedAt: '2025-10-10',
    updatedBy: '박영희',
  },
  {
    name: '회의실 B',
    status: '비활성',
    capacity: 8,
    createdAt: '2025-08-20',
    createdBy: '이민호',
    updatedAt: '2025-09-30',
    updatedBy: '김영희',
  },
  {
    name: '회의실 C',
    status: '활성',
    capacity: 12,
    createdAt: '2025-07-15',
    createdBy: '박준형',
    updatedAt: '2025-10-01',
    updatedBy: '홍길동',
  },
  {
    name: '교육실 A',
    status: '활성',
    capacity: 20,
    createdAt: '2025-06-10',
    createdBy: '김민지',
    updatedAt: '2025-10-05',
    updatedBy: '이수민',
  },
  {
    name: '교육실 B',
    status: '비활성',
    capacity: 15,
    createdAt: '2025-05-25',
    createdBy: '최현우',
    updatedAt: '2025-09-20',
    updatedBy: '박지훈',
  },
]

// 브레드크럼 항목
const breadcrumbItems = [
  { label: '기업 목록', path: '/super/companies' },
  { label: companyName, path: `/super/companies/${encodeURIComponent(companyName)}` },
  { label: '서비스 그룹 목록', path: `/super/companies/${encodeURIComponent(companyName)}/services` },
  { label: serviceGroupName}
]
</script>

<template>
  <SuperBreadcrumb :items="breadcrumbItems"/>
  <div class="components-page-title">서비스 그룹 상세</div>
  <div class="components-white-container">
    <div class="subtitle-container">
      <span class="subtitle">{{ serviceGroupName }}</span>
      <div class="modal-toggle-btn" @click="showModal = !showModal">
        <img src="/public/assets/icons/ic-more.png" />
      </div>
    </div>
    <div v-if="showModal" class="action-modal" @click="showModal = false">
      <div class="action-menu">비활성화</div>
      <div class="action-menu">삭제</div>
    </div>
    <p class="service-group-info">
      {{ serviceGroup.type }} | {{ serviceGroup.creator }} | {{ serviceGroup.created_at }}
    </p>
    <p class="service-group-info">{{ serviceGroup.description }}</p>
    <br />
    <div class="subtitle">서비스 목록</div>
    <div class="components-super-table-container">
      <table class="components-super-table">
        <thead>
          <tr>
            <th>서비스명</th>
            <th>상태</th>
            <th>최대 수용 인원</th>
            <th>생성일</th>
            <th>생성자</th>
            <th>수정일</th>
            <th>수정자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in services" :key="i">
            <td>
              <div class="service-link" @click="goToServiceDetail(s.name)">
                {{ s.name }} <img src="/public/assets/icons/ic-arrow-outward.png" />
              </div>
            </td>
            <td>{{ s.status }}</td>
            <td>{{ s.capacity }}</td>
            <td>{{ s.createdAt }}</td>
            <td>{{ s.createdBy }}</td>
            <td>{{ s.updatedAt }}</td>
            <td>{{ s.updatedBy }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.subtitle-container {
  @apply flex relative;
}

.subtitle-container img {
  @apply h-1 ml-auto mr-3 self-center;
}

.subtitle {
  @apply text-lg font-semibold mb-2;
}

.modal-toggle-btn {
  @apply w-[24px] h-[24px] ml-auto content-center cursor-pointer;
}

.action-modal {
  @apply float-right inline-flex flex-col rounded-md shadow-md;
}

.action-menu {
  @apply w-20 h-10 text-center content-center text-sm hover:bg-gray-100 cursor-pointer;
}

.service-group-info {
  @apply text-sm text-gray-600 mt-1;
}

.service-link {
  @apply flex items-center hover:underline cursor-pointer;
}

td img {
  @apply h-[16px];
}
</style>
