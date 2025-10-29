<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['approve', 'reject', 'suspend', 'activate'])

/**
 * 상태별 배지 클래스 반환
 */
const getStatusBadgeClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-red-100 text-red-800',
  }
  return `px-2 py-1 rounded text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-800'}`
}

/**
 * 상태 텍스트 반환
 */
const getStatusText = (status) => {
  const map = {
    PENDING: '승인 대기',
    ACTIVE: '활성',
    SUSPENDED: '정지',
  }
  return map[status] || status
}

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
          <tr>
            <th>상태</th>
            <td>
              <span :class="getStatusBadgeClass(company.status)">
                {{ getStatusText(company.status) }}
              </span>
            </td>
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
      <div v-if="company.status !== 'PENDING'" class="link-button" @click="goToManagerList">
        관리자 계정 목록
        <img src="/assets/icons/ic-arrow-outward.png" />
      </div>
    </section>

    <hr />

    <!-- 플랫폼 이용 현황 -->
    <section v-if="company.status !== 'PENDING'" class="section-block relative">
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

    <hr />

    <!-- 버튼 영역 -->
    <section class="action-section">
      <!-- PENDING: 승인/거절 버튼 -->
      <div v-if="company.status === 'PENDING'" class="button-group">
        <button @click="emit('reject')" class="button-reject">거절</button>
        <button @click="emit('approve')" class="button-approve">승인</button>
      </div>

      <!-- ACTIVE: 정지 버튼 -->
      <div v-else-if="company.status === 'ACTIVE'" class="button-group">
        <button @click="emit('suspend')" class="button-suspend">서비스 정지</button>
      </div>

      <!-- SUSPENDED: 활성화 버튼 -->
      <div v-else-if="company.status === 'SUSPENDED'" class="button-group">
        <button @click="emit('activate')" class="button-activate">서비스 활성화</button>
      </div>
    </section>
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

.action-section {
  @apply mt-6 pt-6;
}

.button-group {
  @apply flex justify-center gap-3;
}

.button-approve {
  @apply px-6 py-2 rounded bg-primary text-white hover:bg-primary-hover transition-colors;
}

.button-reject {
  @apply px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors;
}

.button-suspend {
  @apply px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors;
}

.button-activate {
  @apply px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors;
}
</style>
