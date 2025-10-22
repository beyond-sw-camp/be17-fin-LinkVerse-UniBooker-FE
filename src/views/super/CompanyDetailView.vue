<script setup>
import { useRoute } from 'vue-router'
import CompanyDetail from '@/components/CompanyDetail.vue'
import SuperBreadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()

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

// 브레드크럼 항목
const breadcrumbItems = [
  { label: '기업 목록', path: '/super/companies' },
  { label: companyName }, 
]
</script>

<template>
  <SuperBreadcrumb :items="breadcrumbItems"/>
  <span class="components-page-title">기업 상세 페이지</span>
  <CompanyDetail :company="company" />
</template>

<style scoped></style>
