<script setup>
import SuperLayout from '@/components/SuperLayout.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyName = route.params.companyName

const goToManagement = () => {
  router.push('/super/management')
}

const goToCompanyDetail = () => {
  router.push(`/super/management/${encodeURIComponent(companyName)}`)
}

// 더미 관리자 & 매니저 데이터
const managers = [
  {
    name: '김아영',
    role: 'Admin',
    email: 'ayoung@hanwha.com',
    phone: '010-1234-5678',
    status: '활성',
    createdAt: '2025-09-30 10:15',
    updatedAt: '2025-10-10 09:42',
  },
  {
    name: '이민호',
    role: 'Manager',
    email: 'minho@hanwha.com',
    phone: '010-2222-1111',
    status: '활성',
    createdAt: '2025-10-01 09:10',
    updatedAt: '2025-10-11 13:22',
  },
  {
    name: '정지은',
    role: 'Manager',
    email: 'jieun@hanwha.com',
    phone: '010-3333-2222',
    status: '비활성',
    createdAt: '2025-10-02 14:30',
    updatedAt: '2025-10-12 08:50',
  },
  {
    name: '박서준',
    role: 'Manager',
    email: 'seojoon@hanwha.com',
    phone: '010-4444-3333',
    status: '활성',
    createdAt: '2025-10-03 11:00',
    updatedAt: '2025-10-12 11:12',
  },
  {
    name: '김유정',
    role: 'Manager',
    email: 'yoojung@hanwha.com',
    phone: '010-5555-4444',
    status: '활성',
    createdAt: '2025-10-03 15:45',
    updatedAt: '2025-10-13 10:30',
  },
  {
    name: '최수빈',
    role: 'Manager',
    email: 'subin@hanwha.com',
    phone: '010-6666-5555',
    status: '비활성',
    createdAt: '2025-10-04 08:20',
    updatedAt: '2025-10-14 14:00',
  },
  {
    name: '한지민',
    role: 'Manager',
    email: 'jimin@hanwha.com',
    phone: '010-7777-6666',
    status: '활성',
    createdAt: '2025-10-04 12:40',
    updatedAt: '2025-10-14 16:05',
  },
  {
    name: '이도현',
    role: 'Manager',
    email: 'dohyun@hanwha.com',
    phone: '010-8888-7777',
    status: '활성',
    createdAt: '2025-10-05 09:00',
    updatedAt: '2025-10-15 09:15',
  },
  {
    name: '문채원',
    role: 'Manager',
    email: 'chaewon@hanwha.com',
    phone: '010-9999-8888',
    status: '비활성',
    createdAt: '2025-10-05 17:20',
    updatedAt: '2025-10-15 12:10',
  },
  {
    name: '강하늘',
    role: 'Manager',
    email: 'haneul@hanwha.com',
    phone: '010-1010-9999',
    status: '활성',
    createdAt: '2025-10-06 13:05',
    updatedAt: '2025-10-15 18:30',
  },
  {
    name: '신세경',
    role: 'Manager',
    email: 'sekyung@hanwha.com',
    phone: '010-1212-3434',
    status: '활성',
    createdAt: '2025-10-07 09:40',
    updatedAt: '2025-10-16 10:00',
  },
]
</script>

<template>
  <SuperLayout>
    <div class="path">
      <span @click="goToManagement">기업 목록</span> >
      <span @click="goToCompanyDetail">{{ companyName }}</span> >
      <span>관리자 계정 목록</span>
    </div>

    <div class="manager-list-container">
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>권한</th>
            <th>이메일</th>
            <th>연락처</th>
            <th>상태</th>
            <th>생성일시</th>
            <th>수정일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in managers" :key="i">
            <td>{{ m.name }}</td>
            <td>{{ m.role }}</td>
            <td>{{ m.email }}</td>
            <td>{{ m.phone }}</td>
            <td>{{ m.status }}</td>
            <td>{{ m.createdAt }}</td>
            <td>{{ m.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
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
.manager-list-container {
  @apply bg-white rounded-md shadow p-8 space-y-6 overflow-x-auto;
}
table {
  @apply w-full border-collapse;
}
th,
td {
  @apply border-b border-gray-200 py-3 px-4 text-left;
}
th {
  @apply text-gray-700 font-semibold;
}
tr:hover td {
  @apply bg-gray-50;
}
</style>
