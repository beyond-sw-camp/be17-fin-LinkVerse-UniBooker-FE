<script setup>
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selected = ref(1)
const searchKeyword = ref('')

const dropdownOptions = [
  { label: '최신순', value: 1 },
  { label: '신청일자순', value: 1 },
  { label: '서비스 그룹 수순', value: 1 },
  { label: '고객 수순', value: 1 },
]

const goToCompanyDetail = (company) => {
  router.push(`/super/companies/${encodeURIComponent(company.name)}`)
}

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
  {
    name: 'Lambda Corp',
    domain: 'lambda.com',
    admin: '김민재',
    date: '2025-10-07',
    status: '승인',
  },
  { name: 'Mu Inc', domain: 'mu.io', admin: '박서준', date: '2025-10-08', status: '대기' },
  { name: 'Nu LLC', domain: 'nu.net', admin: '이지은', date: '2025-10-09', status: '승인' },
  { name: 'Xi Co', domain: 'xi.org', admin: '정해인', date: '2025-10-10', status: '승인' },
  {
    name: 'Omicron Ltd',
    domain: 'omicron.ai',
    admin: '손예진',
    date: '2025-10-11',
    status: '대기',
  },
  { name: 'Pi Solutions', domain: 'pi.com', admin: '이승기', date: '2025-10-12', status: '승인' },
  { name: 'Rho Systems', domain: 'rho.io', admin: '박보검', date: '2025-10-13', status: '거부' },
  { name: 'Sigma Tech', domain: 'sigma.net', admin: '김태리', date: '2025-10-14', status: '승인' },
  {
    name: 'Tau Enterprises',
    domain: 'tau.org',
    admin: '유재석',
    date: '2025-10-15',
    status: '승인',
  },
  {
    name: 'Upsilon Solutions',
    domain: 'upsilon.ai',
    admin: '이영호',
    date: '2025-10-16',
    status: '대기',
  },
  { name: 'Phi Corp', domain: 'phi.com', admin: '정우성', date: '2025-10-17', status: '승인' },
  { name: 'Chi Inc', domain: 'chi.io', admin: '한효주', date: '2025-10-18', status: '승인' },
  { name: 'Psi LLC', domain: 'psi.net', admin: '조정석', date: '2025-10-19', status: '대기' },
  { name: 'Omega Co', domain: 'omega.org', admin: '신민아', date: '2025-10-20', status: '승인' },
  { name: 'Alpha2 Ltd', domain: 'alpha2.ai', admin: '김우빈', date: '2025-10-21', status: '승인' },
  {
    name: 'Beta2 Solutions',
    domain: 'beta2.com',
    admin: '수지',
    date: '2025-10-22',
    status: '거부',
  },
  {
    name: 'Gamma2 Systems',
    domain: 'gamma2.io',
    admin: '류준열',
    date: '2025-10-23',
    status: '승인',
  },
  {
    name: 'Delta2 Tech',
    domain: 'delta2.net',
    admin: '박서준',
    date: '2025-10-24',
    status: '승인',
  },
  {
    name: 'Epsilon2 Enterprises',
    domain: 'epsilon2.org',
    admin: '김태희',
    date: '2025-10-25',
    status: '대기',
  },
  {
    name: 'Zeta2 Solutions',
    domain: 'zeta2.ai',
    admin: '원빈',
    date: '2025-10-26',
    status: '승인',
  },
]
</script>

<template>
  <span class="components-page-title">플랫폼 이용 기업 목록</span>
  <div class="controls-bar">
    <Input
      v-model="searchKeyword"
      type="text"
      class="search-bar"
      placeholder="검색어를 입력하세요"
    />
    <Dropdown v-model="selected" :options="dropdownOptions" placeholder="정렬 기준" width="w-40" />
  </div>
  <div class="company-list">
    <div class="list-container components-super-table-container">
      <table class="components-super-table">
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
          <tr
            v-for="(company, index) in companies"
            :key="index"
            class="list-row"
            @click="goToCompanyDetail(company)"
          >
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
</template>

<style scoped>
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
  @apply bg-white mt-3 max-h-[calc(100vh-200px)];
}

.list-row {
  @apply border-t hover:bg-gray-50 cursor-pointer;
}

table {
  @apply w-full text-center;
}

thead {
  @apply bg-gray-50;
}

td,
th {
  @apply py-2 px-3;
}
</style>
