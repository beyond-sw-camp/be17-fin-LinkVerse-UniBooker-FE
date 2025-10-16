<script setup>
import CompanyDetail from '@/components/CompanyDetail.vue'
import SuperLayout from '@/components/SuperLayout.vue'

const company = {
  name: '한화시스템',
  id: '000000',
  status: false,
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
    <CompanyDetail :company="company" />
  </SuperLayout>
</template>

<style scoped></style>
