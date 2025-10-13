<script setup>
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import SuperLayout from '@/components/SuperLayout.vue'
import { ref } from 'vue'

const selected = ref(1)
const searchKeyword = ref('')

const dropdownOptions = [
  { label: '최신순', value: 1 },
  { label: '신청일자순', value: 1 },
  { label: '서비스 그룹 수순', value: 1 },
  { label: '고객 수순', value: 1 },
]
const companies = [
  { name: 'Alpha Corp', domain: 'alpha.com', admin: '홍길동', date: '2025-10-01', status: '승인' },
  { name: 'Beta Inc', domain: 'beta.io', admin: '김철수', date: '2025-09-28', status: '대기' },
  { name: 'Gamma LLC', domain: 'gamma.net', admin: '이영희', date: '2025-09-30', status: '거부' },
  { name: 'Delta Co', domain: 'delta.org', admin: '박민수', date: '2025-10-05', status: '승인' },
  {
    name: 'Epsilon Ltd',
    domain: 'epsilon.ai',
    admin: '최수연',
    date: '2025-10-03',
    status: '승인',
  },
  {
    name: 'Zeta Solutions',
    domain: 'zeta.com',
    admin: '오지훈',
    date: '2025-09-29',
    status: '대기',
  },
  { name: 'Eta Systems', domain: 'eta.io', admin: '한지민', date: '2025-10-02', status: '승인' },
  { name: 'Theta Tech', domain: 'theta.net', admin: '강다은', date: '2025-09-27', status: '거부' },
  {
    name: 'Iota Enterprises',
    domain: 'iota.org',
    admin: '유승민',
    date: '2025-10-04',
    status: '승인',
  },
  {
    name: 'Kappa Solutions',
    domain: 'kappa.ai',
    admin: '조하나',
    date: '2025-10-06',
    status: '대기',
  },
]
</script>

<template>
  <SuperLayout>
    <span class="title">플랫폼 이용 기업 목록</span>
    <div class="controls-bar">
      <Input
        v-model="searchKeyword"
        type="text"
        class="search-bar"
        placeholder="검색어를 입력하세요"
      />
      <Dropdown
        v-model="selected"
        :options="dropdownOptions"
        placeholder="정렬 기준"
        width="w-40"
      />
      <div class="checkboxes">
        <Input type="checkbox" label="신청 중" />
        <Input type="checkbox" label="승인됨" />
        <Input type="checkbox" label="비활성" />
        <Input type="checkbox" label="거절됨" />
      </div>
    </div>
    <div class="company-list">
      <div class="list-container">
        <table>
          <thead>
            <tr>
              <th>기업명</th>
              <th>도메인</th>
              <th>관리자명</th>
              <th>신청일자</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(company, index) in companies" :key="index" class="list-row">
              <td>{{ company.name }}</td>
              <td>{{ company.domain }}</td>
              <td>{{ company.admin }}</td>
              <td>{{ company.date }}</td>
              <td>
                {{ company.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SuperLayout>
</template>

<style scoped>
.title {
  @apply text-lg;
}
.controls-bar {
  @apply flex gap-3;
}

.controls-bar span {
  @apply text-gray-dark;
}

.controls-bar img {
  @apply h-[24px];
}

.search-bar {
  @apply ml-auto;
}

.controls-bar-button {
  @apply relative flex gap-1 cursor-pointer;
}

.checkboxes {
  @apply flex gap-3 items-center;
}

.list-container {
  @apply bg-white p-3 mt-3;
}

.list-row {
  @apply border-t hover:bg-gray-50 cursor-pointer;
}

table {
  @apply w-full text-center;
}

td,
th {
  @apply py-2 px-3;
}
</style>
