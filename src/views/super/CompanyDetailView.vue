<script setup>
import SuperLayout from '@/components/SuperLayout.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goToCompanies = () => {
  router.push('/super/companies')
}

const goToManagerList = () => {
  router.push(`/super/companies/${encodeURIComponent(company.name)}/managers`)
}

const goToServiceGroupList = () => {
  router.push(`/super/companies/${encodeURIComponent(company.name)}/services`)
}

const companyName = route.params.companyName

const company = {
  name: companyName,
  id: '000000',
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

    <div class="company-container">
      <!-- 기본 정보 -->
      <section class="section-block">
        <h3 class="section-title">기본 정보</h3>
        <table>
          <tbody>
            <tr>
              <th>기업명</th>
              <td>{{ company.name }}</td>
            </tr>
            <tr>
              <th>사업자등록번호</th>
              <td>{{ company.id }}</td>
            </tr>
            <tr>
              <th>도메인</th>
              <td>
                <a :href="company.link" target="_blank" class="link">{{ company.link }}</a>
              </td>
            </tr>
            <tr>
              <th>기업로고</th>
              <td>
                <img :src="company.logo" alt="logo" class="company-logo" />
              </td>
            </tr>
            <tr>
              <th>가입일</th>
              <td>{{ company.registrationDate }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr />

      <!-- 담당자 정보 -->
      <section class="section-block relative">
        <h3 class="section-title">담당자 정보</h3>
        <table>
          <tbody>
            <tr>
              <th>대표 관리자</th>
              <td>{{ company.administrator }}</td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <a :href="`mailto:${company.email}`" class="link">{{ company.email }}</a>
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{{ company.phone }}</td>
            </tr>
          </tbody>
        </table>

        <div class="link-button" @click="goToManagerList">
          관리자 계정 목록
          <img src="/public/assets/icons/ic-arrow-outward.png" />
        </div>
      </section>

      <hr />

      <!-- 플랫폼 이용 현황 -->
      <section class="section-block relative">
        <h3 class="section-title">플랫폼 이용 현황</h3>
        <table>
          <tbody>
            <tr>
              <th>서비스 그룹 수</th>
              <td>{{ company.serviceGroups }} 개</td>
            </tr>
            <tr>
              <th>고객 수</th>
              <td>{{ company.customers }} 명</td>
            </tr>
            <tr>
              <th>최근 로그인</th>
              <td>{{ company.lastLogin }}</td>
            </tr>
          </tbody>
        </table>

        <div class="link-button" @click="goToServiceGroupList">
          서비스 그룹 목록
          <img src="/public/assets/icons/ic-arrow-outward.png" />
        </div>
      </section>
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
