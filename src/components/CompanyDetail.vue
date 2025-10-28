<script setup>
import { defineProps } from 'vue'
import Button from './Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

/**
 * 관리자 계정 목록 페이지로 이동
 */
const goToManagerList = () => {
  const companyId = props.company.companyId

  if (!companyId) {
    console.error('❌ companyId가 없습니다:', props.company)
    alert('기업 ID를 찾을 수 없습니다.')
    return
  }

  router.push(`/super/companies/${companyId}/managers`)
}

/**
 * 서비스 그룹 목록 페이지로 이동
 */
const goToServiceGroupList = () => {
  const companyId = props.company.companyId

  if (!companyId) {
    console.error('❌ companyId가 없습니다:', props.company)
    alert('기업 ID를 찾을 수 없습니다.')
    return
  }

  router.push(`/super/companies/${companyId}/services`)
}
</script>

<template>
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

      <!-- 관리자 계정 목록 버튼 -->
      <div v-if="company.status" class="link-button" @click="goToManagerList">
        관리자 계정 목록
        <img src="/assets/icons/ic-arrow-outward.png" />
      </div>
    </section>

    <hr />

    <!-- 플랫폼 이용 현황 -->
    <section v-if="company.status" class="section-block relative">
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

      <!-- 서비스 그룹 목록 버튼 -->
      <div class="link-button" @click="goToServiceGroupList">
        서비스 그룹 목록
        <img src="/assets/icons/ic-arrow-outward.png" />
      </div>
    </section>
    <div v-else>
      <span class="section-title">추가 전달사항</span>
      <span class="inline-note"
        >승인/거절 시 해당 관리자에게 메일이 전송 됩니다. 관리자에게 보낼 메일에 추가적으로 전달할
        사항이 있다면 입력해 주세요.</span
      >
      <textarea> </textarea>
    </div>
    <div class="button-container">
      <Button class="deny-button">거절</Button>
      <Button>승인</Button>
    </div>
  </div>
</template>

<style scoped>
.company-container {
  @apply bg-white rounded-md shadow p-8 space-y-6;
}

.section-block {
  @apply relative;
}

.section-title {
  @apply text-lg font-semibold text-gray-800 text-lg mb-2;
}

.inline-note {
  @apply text-xs text-gray-dark ml-3;
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

textarea {
  @apply bg-gray-line w-full h-[6rem] mt-3;
}

.button-container {
  @apply flex justify-center gap-3;
}

.deny-button {
  @apply bg-gray-line text-gray-dark;
}

.deny-button:hover {
  @apply bg-gray-deep;
}
</style>
