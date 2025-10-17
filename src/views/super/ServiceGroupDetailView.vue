<script setup>
import SuperLayout from '@/components/SuperLayout.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyName = route.params.companyName
const serviceGroupName = route.params.serviceGroupName
const serviceGroup = {
  status: '활성',
  type: '회의실',
  creator: '홍길동',
  created_at: '2025-10-16',
  description: '이 서비스 그룹은 회사 내 회의실 예약 관리를 위해 사용됩니다.',
}

const goToCompanies = () => {
  router.push('/super/companies')
}

const goToCompanyDetail = () => {
  router.push(`/super/companies/${encodeURIComponent(companyName)}`)
}

const goToServiceDetail = (serviceName) => {
  router.push(`/super/companies/${encodeURIComponent(companyName)}/services/${serviceName}`)
}

const goToServiceGroupList = () => {
  router.push(`/super/companies/${encodeURIComponent(companyName)}/services`)
}

const goToServiceGroup = () => {
  router.push(`/super/companies/${encodeURIComponent(companyName)}/services/${serviceGroupName}`)
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
</script>

<template>
  <SuperLayout>
    <div class="path">
      <span @click="goToCompanies">기업 목록</span> >
      <span @click="goToCompanyDetail">{{ companyName }}</span> >
      <span @click="goToServiceGroupList">서비스 그룹 목록</span> >
      <span @click="goToServiceGroup">{{ serviceGroupName }}</span>
    </div>
    <span class="components-page-title">서비스 그룹 상세</span>
    <div class="components-white-container">
      <div>
        <span class="subtitle">{{ serviceGroupName }}</span>
      </div>
      <p class="service-group-info">
        {{ serviceGroup.type }} | {{ serviceGroup.creator }} | {{ serviceGroup.created_at }}
      </p>
      <p class="service-group-info">{{ serviceGroup.description }}</p>
      <br />
      <span class="subtitle">서비스 목록</span>
      <div class="table-body">
        <table>
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
  </SuperLayout>
</template>

<style scoped>
.path {
  @apply text-sm text-gray-600 mb-2;
}
.path span {
  @apply cursor-pointer hover:underline;
}

.subtitle {
  @apply text-lg;
}

.service-group-info {
  @apply text-sm text-gray-600 mt-1;
}

.service-link {
  @apply flex items-center hover:underline cursor-pointer;
}

table {
  @apply w-full border-collapse;
}

.table-body {
  @apply overflow-y-auto;
  max-height: calc(100vh - 200px);
}

th,
td {
  @apply border-b border-gray-200 py-3 px-4 text-center;
}
th {
  @apply text-gray-700 font-semibold sticky;
}
tr:hover td {
  @apply bg-gray-50;
}

td img {
  @apply h-[16px];
}
</style>
