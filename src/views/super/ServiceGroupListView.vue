<script setup>
import SuperBreadcrumb from '@/components/SuperBreadcrumb.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyName = route.params.companyName

const goToServiceList = (serviceGroupName) => {
  router.push(`/super/companies/${encodeURIComponent(companyName)}/services/${serviceGroupName}`)
}

const serviceGroups = [
  {
    groupName: '회의실 예약',
    groupCode: 'SRV001',
    category: '예약/신청',
    createdAt: '2025-01-02',
    updatedAt: '2025-01-10',
    status: '활성',
    createdBy: '홍길동',
    updatedBy: '김수현',
  },
  {
    groupName: '출장 신청',
    groupCode: 'SRV002',
    category: '예약/신청',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-05',
    status: '활성',
    createdBy: '이영희',
    updatedBy: '박세진',
  },
  {
    groupName: '교육 신청',
    groupCode: 'SRV003',
    category: '예약/신청',
    createdAt: '2025-03-15',
    updatedAt: '2025-03-18',
    status: '활성',
    createdBy: '박민수',
    updatedBy: '최유리',
  },
  {
    groupName: '휴가/연차 신청',
    groupCode: 'SRV004',
    category: '예약/신청',
    createdAt: '2025-04-10',
    updatedAt: '2025-04-15',
    status: '활성',
    createdBy: '최지훈',
    updatedBy: '김보라',
  },
  {
    groupName: '물품 신청',
    groupCode: 'SRV005',
    category: '예약/신청',
    createdAt: '2025-05-02',
    updatedAt: '2025-05-05',
    status: '활성',
    createdBy: '김나영',
    updatedBy: '이승현',
  },
]
</script>

<template>
  <SuperBreadcrumb />
  <span class="components-page-title">서비스 그룹 목록</span>
  <div class="components-white-container">
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in serviceGroups" :key="i">
            <td>
              <div class="service-link" @click="goToServiceList(s.groupName)">
                {{ s.groupName }} <img src="/public/assets/icons/ic-arrow-outward.png" />
              </div>
            </td>
            <td>{{ s.groupCode }}</td>
            <td>{{ s.category }}</td>
            <td>{{ s.createdAt }}</td>
            <td>{{ s.updatedAt }}</td>
            <td>{{ s.status }}</td>
            <td>{{ s.createdBy }}</td>
            <td>{{ s.updatedBy }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.service-group-list-container {
  @apply bg-white rounded-md shadow p-8 mt-3 space-y-6 overflow-x-auto;
}

td img {
  @apply h-[16px];
}

.service-link {
  @apply flex items-center hover:underline cursor-pointer;
}
</style>
