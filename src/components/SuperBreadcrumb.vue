<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// 표시용 이름
const companyName = route.params.companyName
const serviceGroupName = route.params.serviceGroupName
const serviceName = route.params.serviceName

const goToCompanies = () => router.push({ name: 'superCompanyList' })
const goToCompanyDetail = () => router.push({ name: 'superCompanyDetail', params: { companyName } })
const goToServiceGroupList = () =>
  router.push({ name: 'superServiceGroupList', params: { companyName } })
const goToServiceGroup = () =>
  router.push({
    name: 'superServiceGroupDetail',
    params: { companyName, serviceGroupName },
  })
const goToServiceDetail = () =>
  router.push({
    name: 'superServiceDetail',
    params: { companyName, serviceGroupName, serviceName },
  })

/* 데이터 불러와서 사용할 경우 */
// route params
// const companyId = route.params.companyId
// const groupId = route.params.groupId
// const serviceId = route.params.serviceId

// 표시용 이름
// const companyName = ref('')
// const groupName = ref('')
// const serviceName = ref('')

// 페이지 진입 시 이름 불러오기
// watchEffect(async () => {
//   if (companyId) {
//     const { data } = await axios.get(`/api/companies/${companyId}`)
//     companyName.value = data.name
//   }
//   if (groupId) {
//     const { data } = await axios.get(`/api/service-groups/${groupId}`)
//     groupName.value = data.name
//   }
//   if (serviceId) {
//     const { data } = await axios.get(`/api/services/${serviceId}`)
//     serviceName.value = data.name
//   }
// })

// 이동 함수(데이터 불러와서 사용할 경우)
// const goToCompanies = () => router.push('/super/management')
// const goToCompanyDetail = () => router.push(`/super/management/${companyName}`)
// const goToServiceGroupList = () => router.push(`/super/management/${companyId}/groups`)
// const goToServiceGroup = () => router.push(`/super/management/${companyId}/groups/${groupId}`)
// const goToServiceList = () =>
//   router.push(`/super/management/${companyId}/groups/${groupId}/services`)
</script>

<template>
  <div class="breadcrumb">
    <span @click="goToCompanies">기업 목록</span>
    <template v-if="companyName">
      > <span @click="goToCompanyDetail">{{ companyName }}</span>
    </template>
    <template v-if="route.path.includes('managers')">
      > <span @click="goToServiceGroupList">관리자 계정 목록</span>
    </template>
    <template v-if="route.path.includes('services')">
      > <span @click="goToServiceGroupList">서비스 그룹 목록</span>
    </template>
    <template v-if="serviceGroupName">
      > <span @click="goToServiceGroup">{{ serviceGroupName }}</span>
    </template>
    <template v-if="serviceName">
      > <span>{{ serviceName }}</span>
    </template>
  </div>
</template>

<style scoped>
.breadcrumb {
  @apply flex text-[14px] text-gray-dark gap-2;
}

.breadcrumb span:hover {
  text-decoration: underline;
}
</style>
