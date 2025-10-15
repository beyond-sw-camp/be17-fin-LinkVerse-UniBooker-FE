<script setup>
import SuperLayout from '@/components/SuperLayout.vue'
import { useRouter, useRoute } from 'vue-router'
import CompanyDetail from '@/components/CompanyDetail.vue'

const router = useRouter()
const route = useRoute()

const goToCompanies = () => {
  router.push('/super/companies')
}

const companyName = route.params.companyName

const company = {
  name: companyName,
  id: '000000',
  status: true,
  link: 'https://unibooker.kro.kr/550e8400-e29b-41d4-a716-446655440000',
  logo: '/public/assets/images/admin_logo.png',
  registrationDate: '2025.10.05',
  administrator: '김아영',
  email: 'ayoung@hanwha.com',
  phone: '010-1234-5678',
  serviceGroups: 4,
  customers: 1234,
  lastLogin: '2025.10.14 12:30',
}
</script>

<template>
  <SuperLayout>
    <div class="path">
      <span @click="goToCompanies">기업 목록</span> > <span>{{ company.name }}</span>
    </div>

    <h2 class="title">기업 상세 페이지</h2>

    <CompanyDetail :company="company" />
  </SuperLayout>
</template>

<style scoped>
.path {
  @apply text-sm text-gray-600 mb-2;
}

.path span {
  @apply cursor-pointer hover:underline;
}

.title {
  @apply text-lg font-bold mb-4;
}

.company-container {
  @apply bg-white rounded-md shadow p-8 space-y-6;
}

.section-block {
  @apply relative;
}

.section-title {
  @apply font-semibold text-gray-800 text-lg mb-2;
}

table {
  @apply w-full text-left ml-3;
}

th {
  @apply text-gray-700 font-normal w-[150px] py-2 align-top;
}

td {
  @apply py-2;
}

.link {
  @apply text-blue-600 underline;
}

.company-logo {
  @apply h-8 object-contain;
}

.link-button {
  @apply flex absolute top-[10px] right-[10px] text-sm cursor-pointer hover:underline;
}

.link-button img {
  @apply h-[16px];
}
</style>
