<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import adminApi from '@/services/admin/admin_api'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email || '')
const statusData = ref(null)
const loading = ref(false)
const error = ref('')

// 페이지 로드 시 이메일이 있으면 자동 조회
onMounted(() => {
  if (email.value) {
    checkStatus()
  }
})

const checkStatus = async () => {
  console.log('1. checkStatus 시작, email:', email.value)

  if (!email.value) {
    error.value = '이메일을 입력해주세요.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = '올바른 이메일 형식이 아닙니다.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('2. API 호출 시작')
    const response = await adminApi.getSignUpStatus(email.value)
    console.log('3. API 응답:', response.data)
    statusData.value = response.data.data
    console.log('4. statusData 설정 완료:', statusData.value)
  } catch (err) {
    console.error('5. 에러 발생:', err)
    error.value = err.response?.data?.message || '상태 조회에 실패했습니다.'
  } finally {
    loading.value = false
    console.log('6. loading 종료')
  }
}

const goToLogin = () => {
  router.push('/admin/login')
}

const goToSignup = () => {
  router.push('/admin/signup')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="admin-status-container">
    <div class="admin-status-card">
      <!-- 헤더 -->
      <div class="admin-status-header">
        <h1 class="admin-status-title">가입 승인 상태 확인</h1>
        <p class="admin-status-description">회원가입 신청 후 승인 상태를 확인할 수 있습니다.</p>
      </div>

      <!-- 이메일 입력 폼 (상태 조회 전) -->
      <div v-if="!statusData" class="admin-status-email-form">
        <div class="admin-status-field">
          <label class="admin-status-label">이메일</label>
          <Input
            v-model="email"
            type="email"
            placeholder="가입 신청 시 입력한 이메일을 입력하세요"
            class="admin-status-email-input"
            @keyup.enter="checkStatus"
          />
        </div>
        <Button @click="checkStatus" :disabled="loading" class="admin-status-check-button">
          {{ loading ? '조회 중...' : '상태 확인' }}
        </Button>

        <p v-if="error" class="admin-status-error-message">{{ error }}</p>

        <!-- 로그인 페이지 안내 -->
        <div class="admin-status-login-guide">
          <p class="admin-status-guide-text">
            이미 승인되었나요?
            <button @click="goToLogin" class="admin-status-guide-link">로그인 페이지로 이동</button>
          </p>
        </div>
      </div>

      <!-- 상태 조회 결과 -->
      <div v-else class="admin-status-result">
        <!-- PENDING -->
        <div v-if="statusData.status === 'PENDING'" class="admin-status-pending">
          <img
            class="admin-status-icon"
            src="/assets/icons/free-icon-loading-arrow-10697084.png"
            alt="승인 대기 중"
          />
          <h2 class="admin-status-result-title">승인 대기중</h2>
          <p class="admin-status-result-message">
            회원가입 신청이 완료되었습니다.<br />
            승인까지 최대 3일이 소요될 수 있습니다.
          </p>
          <div class="admin-status-info">
            <p>
              <strong>기업명:</strong>
              <span class="admin-status-info-text">{{ statusData.companyName }}</span>
            </p>
            <p>
              <strong>도메인:</strong>
              <span class="admin-status-info-text">{{ statusData.companySlug }}</span>
            </p>
            <p>
              <strong>이메일:</strong>
              <span class="admin-status-info-text">{{ statusData.email }}</span>
            </p>
            <p>
              <strong>신청일:</strong>
              <span class="admin-status-info-text">{{ formatDate(statusData.appliedAt) }}</span>
            </p>
          </div>
        </div>

        <!-- APPROVED -->
        <div v-else-if="statusData.status === 'APPROVED'" class="admin-status-approved">
          <img
            class="admin-status-icon"
            src="/assets/icons/free-icon-check-3699516.png"
            alt="승인 완료"
          />
          <h2 class="admin-status-result-title">승인 완료!</h2>
          <p class="admin-status-result-message">
            회원가입이 승인되었습니다.<br />
            이메일에서 임시 비밀번호를 확인하세요.
          </p>
          <div class="admin-status-info">
            <div class="admin-status-info">
              <p>
                <strong>기업명:</strong>
                <span class="admin-status-info-text">{{ statusData.companyName }}</span>
              </p>
              <p>
                <strong>도메인:</strong>
                <span class="admin-status-info-text">{{ statusData.companySlug }}</span>
              </p>
              <p>
                <strong>이메일:</strong>
                <span class="admin-status-info-text">{{ statusData.email }}</span>
              </p>
              <p>
                <strong>신청일:</strong>
                <span class="admin-status-info-text">{{ formatDate(statusData.appliedAt) }}</span>
              </p>
            </div>
          </div>
          <Button @click="goToLogin" class="admin-status-login-button"> 로그인하러 가기 </Button>
        </div>

        <!-- REJECTED -->
        <div v-else-if="statusData.status === 'REJECTED'" class="admin-status-rejected">
          <img
            class="admin-status-icon"
            src="/assets/icons/free-icon-cancel-190406.png"
            alt="승인 거절"
          />
          <h2 class="admin-status-result-title">승인 거절</h2>
          <p class="admin-status-result-message">회원가입 신청이 거절되었습니다.</p>
          <div class="admin-status-rejection-info">
            <p><strong>거절 사유:</strong></p>
            <p class="admin-status-rejection-reason">
              {{ statusData.rejectionReason || '관리자에게 문의해주세요.' }}
            </p>
          </div>
          <Button @click="goToSignup" class="admin-status-retry-button"> 다시 신청하기 </Button>
        </div>

        <!-- 다시 조회하기 -->
        <button @click="statusData = null" class="admin-status-recheck-button">
          다른 이메일로 조회하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-status-container {
  @apply bg-gray-line flex items-center justify-center px-4 mt-0;
}

.admin-status-card {
  @apply bg-white shadow-md rounded-xl w-full max-w-7xl py-20 mt-10;
}

/* 헤더 */
.admin-status-header {
  @apply text-center mb-8;
}

.admin-status-title {
  @apply text-2xl font-bold text-gray-800 mb-2;
}

.admin-status-description {
  @apply text-sm text-gray-600;
}

/* 이메일 입력 폼 */
.admin-status-email-form {
  @apply space-y-4;
}

.admin-status-field {
  @apply flex items-center justify-center w-full mb-5 px-5;
}

.admin-status-label {
  @apply min-w-[50px] text-center text-[14px] text-gray-600 font-medium mr-2;
}

.admin-status-email-input {
  @apply w-full text-sm;
}

.admin-status-check-button {
  @apply w-full rounded-full text-sm font-medium;
}

.admin-status-error-message {
  @apply text-red-500 text-sm text-center;
}

/* 로그인 가이드 */
.admin-status-login-guide {
  @apply mt-6 pt-6 border-t border-gray-200 text-center;
}

.admin-status-guide-text {
  @apply text-sm text-gray-400;
}

.admin-status-guide-link {
  @apply text-gray-600 font-medium hover:text-primary-hover underline cursor-pointer bg-transparent border-none;
}

/* 상태 조회 결과 */
.admin-status-result {
  @apply space-y-4 flex flex-col items-center;
}

/* 아이콘 가운데 정렬 */
.admin-status-icon {
  @apply w-40 h-auto mb-4 mx-auto block;
}

.admin-status-result-title {
  @apply text-xl font-bold text-center mb-2;
}

.admin-status-result-message {
  @apply text-sm text-gray-600 text-center mb-4 leading-relaxed;
}

.admin-status-info,
.admin-status-rejection-info {
  @apply bg-gray-50 p-4 rounded-lg mb-4 text-sm space-y-2 w-full;
}

/* <strong>과 텍스트를 한 줄에 배치, strong은 오른쪽 정렬, 텍스트는 가운데 정렬 */
.admin-status-info p {
  @apply flex items-center justify-between;
}

.admin-status-info strong {
  @apply text-left text-gray-600 mr-5;
}

.admin-status-info-text {
  @apply flex-1 text-center;
}

.admin-status-rejection-reason {
  @apply text-red-600 font-medium mt-2;
}

.admin-status-login-button,
.admin-status-retry-button {
  @apply w-full rounded-full;
}

.admin-status-recheck-button {
  @apply w-full text-sm text-gray-600 hover:text-primary underline cursor-pointer bg-transparent border-none mt-4;
}

/* 상태별 타이틀 색상 */
.admin-status-pending .admin-status-result-title {
  @apply text-primary-bright;
}

.admin-status-approved .admin-status-result-title {
  @apply text-green-600;
}

.admin-status-rejected .admin-status-result-title {
  @apply text-red-600;
}
</style>
