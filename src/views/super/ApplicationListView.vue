<script setup>
import Button from '@/components/Button.vue'
import SuperLayout from '@/components/SuperLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToApplicationDetail = (company) => {
  router.push(`/super/applications/${company.companyId}/details`)
}

const companies = [
  {
    companyId: 1,
    companyName: '넥스트테크',
    applicationDate: '2025-10-10',
    administrator: '김민수',
  },
  {
    companyId: 2,
    companyName: '에이아이랩스',
    applicationDate: '2025-10-11',
    administrator: '이서연',
  },
  {
    companyId: 3,
    companyName: '블루웨이브',
    applicationDate: '2025-10-12',
    administrator: '박지훈',
  },
  { companyId: 4, companyName: '오픈루프', applicationDate: '2025-10-12', administrator: '최윤아' },
  {
    companyId: 5,
    companyName: '하이브소프트',
    applicationDate: '2025-10-13',
    administrator: '정우성',
  },
  {
    companyId: 6,
    companyName: '메타브릿지',
    applicationDate: '2025-10-13',
    administrator: '홍지민',
  },
  {
    companyId: 7,
    companyName: '코드크래프트',
    applicationDate: '2025-10-14',
    administrator: '한지호',
  },
  {
    companyId: 8,
    companyName: '데이터버스',
    applicationDate: '2025-10-14',
    administrator: '유지연',
  },
  {
    companyId: 9,
    companyName: '그로스앤컴퍼니',
    applicationDate: '2025-10-15',
    administrator: '김도현',
  },
  {
    companyId: 10,
    companyName: '인사이트랩',
    applicationDate: '2025-10-15',
    administrator: '오세은',
  },
]
</script>

<template>
  <SuperLayout>
    <span class="components-page-title">신청 목록</span>

    <div class="components-white-container">
      <div class="table-container">
        <!-- header -->
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>기업명</th>
              <th>신청일자</th>
              <th>관리자명</th>
              <th></th>
            </tr>
          </thead>
        </table>

        <!-- scroll body -->
        <div class="table-body">
          <table>
            <tbody>
              <tr v-for="(c, i) in companies" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ c.companyName }}</td>
                <td>{{ c.applicationDate }}</td>
                <td>{{ c.administrator }}</td>
                <td><Button @click="goToApplicationDetail(c)">상세 보기</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </SuperLayout>
</template>

<style scoped>
.table-container {
  @apply w-full;
}

table {
  @apply w-full border-collapse;
}

thead th {
  @apply text-gray-700 font-semibold bg-gray-100 py-3 px-4 text-center border-b border-gray-300;
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-body {
  @apply overflow-y-auto;
  max-height: calc(100vh - 200px);
}

tbody td {
  @apply border-b border-gray-200 py-3 px-4 text-center;
}

.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-[4px];
}

.table-body::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

tbody tr:hover td {
  @apply bg-gray-50;
}
</style>
