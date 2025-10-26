<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import PasswordChangeModal from '@/components/PasswordChangeModal.vue'
import WithdrawConfirmModal from '@/components/WithdrawConfirmModal.vue'
import Toast from '@/components/Toast.vue'
import userApi from '@/services/user/user_api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 로딩 상태
const isLoading = ref(false)

// 비밀번호 변경 모달 표시 여부
const showPasswordModal = ref(false)

// 회원탈퇴 모달 표시 여부
const showWithdrawModal = ref(false)

// Toast 상태
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
})

// 회원정보
const formData = reactive({
  userId: '',
  name: '',
  phone: '',
})

// ========== Toast 알림 ==========

/**
 * Toast 메시지 표시
 */
const showToast = (message, type = 'info') => {
  toast.message = message
  toast.type = type
  toast.show = true
}

/**
 * Toast 닫기
 */
const closeToast = () => {
  toast.show = false
}

// ========== 프로필 조회 ==========

/**
 * 내 프로필 조회
 */
const loadProfile = async () => {
  try {
    isLoading.value = true
    console.log('프로필 조회 시작')

    const response = await userApi.getMyProfile()
    console.log('프로필 API 응답:', response)

    // isSuccess 대신 isSuccess 사용
    if (response.isSuccess) {
      const profile = response.data
      console.log('프로필 데이터:', profile)

      formData.userId = profile.email
      formData.name = profile.name
      formData.phone = profile.phone || ''

      console.log('formData 업데이트 완료:', formData)
    } else {
      console.error('프로필 조회 실패:', response)
      showToast(response.message || '프로필 조회에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('프로필 조회 오류:', error)
    console.error('에러 응답:', error.response)
    showToast('프로필 조회 중 오류가 발생했습니다.', 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== 정보 수정 ==========

/**
 * 프로필 정보 수정
 */
const handleUpdateInfo = async () => {
  try {
    // 유효성 검사
    if (!formData.name || formData.name.trim() === '') {
      showToast('이름을 입력해주세요.', 'warning')
      return
    }

    // 전화번호 형식 검사 (입력된 경우에만)
    if (formData.phone && formData.phone.trim() !== '') {
      const phonePattern = /^010-\d{4}-\d{4}$/
      if (!phonePattern.test(formData.phone)) {
        showToast('전화번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)', 'warning')
        return
      }
    }

    isLoading.value = true

    const updateData = {
      name: formData.name,
      phone: formData.phone || null,
    }

    const response = await userApi.updateMyProfile(updateData)

    if (response.isSuccess) {
      showToast('정보가 성공적으로 수정되었습니다.', 'success') // 수정: 'isSuccess' → 'success'
      await loadProfile()
    } else {
      showToast(response.message || '정보 수정에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('정보 수정 오류:', error)

    // 에러 메시지 처리
    if (error.response?.data?.message) {
      showToast(error.response.data.message, 'error')
    } else {
      showToast('정보 수정 중 오류가 발생했습니다.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

// ========== 비밀번호 변경 ==========

/**
 * 비밀번호 변경 모달 열기
 */
const handleChangePassword = () => {
  showPasswordModal.value = true
}

/**
 * 비밀번호 변경 모달 닫기
 */
const handleClosePasswordModal = () => {
  showPasswordModal.value = false
}

/**
 * 비밀번호 변경 제출
 */
const handleSubmitPasswordChange = async (passwordData) => {
  try {
    isLoading.value = true

    const response = await userApi.changePassword(passwordData)

    if (response.isSuccess) {
      showToast('비밀번호가 성공적으로 변경되었습니다.', 'success') // 수정: 'isSuccess' → 'success'
      showPasswordModal.value = false
    } else {
      showToast(response.message || '비밀번호 변경에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('비밀번호 변경 오류:', error)

    // 에러 메시지 처리
    if (error.response?.data?.message) {
      showToast(error.response.data.message, 'error')
    } else {
      showToast('비밀번호 변경 중 오류가 발생했습니다.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

// ========== 로그아웃 ==========

/**
 * 로그아웃 처리
 */
const handleLogout = async () => {
  try {
    if (!confirm('로그아웃 하시겠습니까?')) {
      return
    }

    isLoading.value = true
    const response = await userApi.logoutUser()

    if (response.isSuccess) {
      authStore.logout()
      showToast('로그아웃되었습니다.', 'success') // 수정: 'isSuccess' → 'success'

      setTimeout(() => {
        const companySlug = route.params.companySlug
        router.push(`/c/${companySlug}/`)
      }, 1000)
    } else {
      showToast(response.message || '로그아웃에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('로그아웃 오류:', error)

    // 에러가 발생해도 클라이언트 측 로그아웃 처리
    authStore.logout()

    const companySlug = route.params.companySlug
    router.push(`/c/${companySlug}/`)
  } finally {
    isLoading.value = false
  }
}

// ========== 회원 탈퇴 ==========

/**
 * 회원탈퇴 모달 열기
 */
const handleWithdrawal = () => {
  showWithdrawModal.value = true
}

/**
 * 회원탈퇴 모달 닫기
 */
const handleCloseWithdrawModal = () => {
  showWithdrawModal.value = false
}

/**
 * 회원탈퇴 확인
 */
const handleConfirmWithdraw = async (password) => {
  try {
    isLoading.value = true

    const withdrawData = {
      password: password,
    }

    const response = await userApi.withdrawUser(withdrawData)

    if (response.isSuccess) {
      showToast(response.data.message || '회원탈퇴가 완료되었습니다.', 'success') // 수정: 'isSuccess' → 'success'
      showWithdrawModal.value = false

      authStore.logout()

      setTimeout(() => {
        const companySlug = route.params.companySlug
        router.push(`/c/${companySlug}/`)
      }, 1500)
    } else {
      showToast(response.message || '회원탈퇴에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('회원탈퇴 오류:', error)

    // 에러 메시지 처리
    if (error.response?.data?.message) {
      showToast(error.response.data.message, 'error')
    } else {
      showToast('회원탈퇴 중 오류가 발생했습니다.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

// ========== 초기화 ==========

/**
 * 컴포넌트 마운트 시 프로필 조회
 */
onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="user-mypage-page">
    <!-- 메인 컨텐츠 -->
    <main class="user-mypage-main">
      <div class="user-mypage-card">
        <h1 class="user-mypage-title">내 계정</h1>

        <form @submit.prevent="handleUpdateInfo" class="user-mypage-form">
          <!-- 아이디 (이메일) -->
          <div class="user-mypage-field">
            <label for="userId" class="user-mypage-label">아이디</label>
            <Input
              id="userId"
              v-model="formData.userId"
              type="email"
              placeholder="example@email.com"
              class="user-mypage-input"
              disabled
            />
          </div>

          <!-- 이름 -->
          <div class="user-mypage-field">
            <label for="name" class="user-mypage-label">이름</label>
            <Input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="이름"
              class="user-mypage-input"
            />
          </div>

          <!-- 전화번호 -->
          <div class="user-mypage-field">
            <label for="phone" class="user-mypage-label">전화번호</label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="010-1234-5678"
              class="user-mypage-input user-mypage-input-last"
            />
          </div>

          <!-- 버튼 그룹 -->
          <div class="user-mypage-button-group">
            <Button type="submit" class="user-mypage-update-button">정보수정</Button>
            <Button type="button" @click="handleChangePassword" class="user-mypage-password-button">
              비밀번호 변경
            </Button>
            <div class="user-mypage-button-container">
              <Button type="button" @click="handleLogout" class="user-mypage-logout-button">
                로그아웃
              </Button>
              <Button type="button" @click="handleWithdrawal" class="user-mypage-withdrawal-button">
                회원탈퇴
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>

    <!-- 비밀번호 변경 모달 -->
    <PasswordChangeModal
      :show="showPasswordModal"
      @close="handleClosePasswordModal"
      @submit="handleSubmitPasswordChange"
    />

    <!-- 회원탈퇴 확인 모달 (추가) -->
    <WithdrawConfirmModal
      :show="showWithdrawModal"
      @close="handleCloseWithdrawModal"
      @confirm="handleConfirmWithdraw"
    />

    <!-- Toast 알림 (추가) -->
    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="closeToast" />

    <!-- 로딩 오버레이 (추가) -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 */
.user-mypage-page {
  @apply min-h-screen flex flex-col bg-gray-100;
}

.user-mypage-main {
  @apply flex-1 flex items-center justify-center py-5 px-4;
}

/* 회원정보 카드 */
.user-mypage-card {
  @apply bg-white rounded-[20px] shadow-md w-full max-w-[900px] h-[600px] p-10;
}

.user-mypage-title {
  @apply text-[23px] font-bold text-center mb-6 text-gray-600;
}

/* 폼 레이아웃 */
.user-mypage-form {
  @apply flex flex-col items-center;
}

.user-mypage-field {
  @apply flex flex-col items-start w-full max-w-[400px] mb-[10px];
}

.user-mypage-label {
  @apply block text-[13px] font-medium text-gray-600 px-2 py-1 mt-1;
}

/* 일반 입력 필드 - 중앙 정렬 */
.user-mypage-input {
  @apply flex-1 w-full rounded-sm text-sm text-center;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  @apply placeholder-gray-400 transition-all duration-200;
}

/* Input 컴포넌트 내부 텍스트 중앙 정렬 */
.user-mypage-input :deep(input) {
  @apply text-center;
}

.user-mypage-input :deep(.input-base) {
  @apply text-center;
}

/* disabled 상태 스타일 (아이디는 수정 불가) */
.user-mypage-input:disabled {
  @apply bg-gray-100 text-gray-500 cursor-not-allowed;
}

/* 전화번호 필드 하단 간격 */
.user-mypage-input-last {
  @apply mb-[60px];
}

/* 버튼 정렬 */
.user-mypage-button-group {
  @apply flex flex-col items-center w-full max-w-[400px] gap-3;
}

.user-mypage-button-container {
  @apply flex justify-between items-center w-full;
  @apply gap-2;
}

/* 정보수정 버튼 */
.user-mypage-update-button {
  @apply w-full py-2 bg-primary text-white font-medium;
  @apply hover:bg-primary-hover transition-all duration-200;
}

/* 비밀번호 변경 버튼 */
.user-mypage-password-button {
  @apply w-full py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
}

/* 로그아웃 버튼 */
.user-mypage-logout-button {
  @apply flex-1 py-2 bg-white text-primary border border-primary font-medium;
  @apply hover:bg-gray-100 transition-all duration-200;
}

/* 회원탈퇴 버튼 */
.user-mypage-withdrawal-button {
  @apply flex-1 py-2 bg-white text-red-600 border border-red-600 font-medium;
  @apply hover:bg-red-100 transition-all duration-200;
}

/* 로딩 오버레이 */
.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-primary border-t-transparent rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
