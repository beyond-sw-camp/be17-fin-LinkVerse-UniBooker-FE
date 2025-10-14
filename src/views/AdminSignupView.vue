<script setup>
import { ref, reactive } from 'vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

const formData = reactive({
  companyName: '',
  name: '',
  email: '',
  phone: '',
  logo: null,
})

const fileName = ref('')

// 중복확인 상태
const companyNameChecked = ref(false)
const emailChecked = ref(false)

// 기업명 중복확인
const checkCompanyName = async () => {
  if (!formData.companyName) {
    alert('기업명을 입력해주세요.')
    return
  }
  // TODO: API 호출
  companyNameChecked.value = true
  alert('사용 가능한 기업명입니다.')
}

// 이메일 중복확인
const checkEmail = async () => {
  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    alert('올바른 이메일 형식이 아닙니다.')
    return
  }

  emailChecked.value = true
  alert('사용 가능한 이메일입니다.')
}

// 입력값 변경 시 중복확인 상태 초기화
const resetCompanyNameCheck = () => {
  companyNameChecked.value = false
}

const resetEmailCheck = () => {
  emailChecked.value = false
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.logo = file
    fileName.value = file.name
  }
}

const handleSubmit = () => {
  if (!companyNameChecked.value) {
    alert('기업명 중복확인을 해주세요.')
    return
  }

  if (!emailChecked.value) {
    alert('이메일 중복확인을 해주세요.')
    return
  }

  console.log('제출 데이터:', formData)
  alert('신청이 완료되었습니다!')
}
</script>

<template>
  <div class="admin-signup-container">
    <!-- 네비게이션 -->
    <div class="admin-signup-navbar">
      <AdminNavbar />
    </div>

    <!-- 메인 카드 -->
    <div class="admin-signup-card">
      <!-- 타이틀 섹션 -->
      <div class="admin-signup-header">
        <h1 class="admin-signup-title">가입 정보를 입력해주세요.</h1>
        <p class="admin-signup-description">
          승인까지 최대 3일 정도 소요됩니다. 빠른 승인을 원하실 경우
          <a class="admin-signup-link">[문의하기]</a>를 통해 알려주세요.
        </p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handleSubmit" class="admin-signup-form">
        <!-- 사용자등록번호 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">사용자등록번호</label>
          <div class="admin-signup-input-with-button">
            <Input
              v-model="formData.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              @input="resetEmailCheck"
            />
            <Button class="admin-signup-check-button" type="button" @click="checkEmail">
              중복확인
            </Button>
          </div>
        </div>

        <!-- 기업명 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">기업명</label>
          <div class="admin-signup-input-wrapper">
            <Input v-model="formData.name" type="text" placeholder="기업명을 입력해주세요." />
          </div>
        </div>

        <!-- 이름 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">이름</label>
          <div class="admin-signup-input-wrapper">
            <Input v-model="formData.name" type="text" placeholder="이름을 입력해주세요." />
          </div>
        </div>

        <!-- 이메일 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">이메일</label>
          <div class="admin-signup-input-with-button">
            <Input
              v-model="formData.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              @input="resetEmailCheck"
            />
            <Button class="admin-signup-check-button" type="button" @click="checkEmail">
              중복확인
            </Button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">연락처</label>
          <div class="admin-signup-input-wrapper">
            <Input v-model="formData.phone" type="tel" placeholder="연락처를 입력해주세요." />
          </div>
        </div>

        <!-- 기업로고 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">기업로고</label>
          <div class="admin-signup-input-wrapper">
            <Input id="logo-upload" type="file" accept="image/*" @change="handleFileUpload" />
          </div>
        </div>

        <!-- 제출 버튼 -->
        <Button type="submit" class="admin-signup-submit-button"> 사용 신청하기 </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-signup-container {
  @apply min-h-screen bg-[#eeeeee] flex flex-col items-center px-4;
}

/* 네비게이션 영역 */
.admin-signup-navbar {
  @apply w-full max-w-[1194px] mt-[30px];
}

/* 회원가입 카드 */
.admin-signup-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-[1194px] p-10 mt-[30px] mb-[50px];
}

/* 헤더 영역 */
.admin-signup-header {
  @apply text-center mb-[30px];
}

.admin-signup-title {
  @apply text-[18px] font-semibold text-gray-600 mt-[16px];
}

.admin-signup-description {
  @apply text-gray-500 text-[13px] leading-relaxed my-[10px] mb-[4px];
}

.admin-signup-link {
  @apply font-medium text-gray-500 hover:text-primary mx-1 cursor-pointer;
}

/* 폼 영역 */
.admin-signup-form {
  @apply flex flex-col items-center;
}

/* 입력 필드 */
.admin-signup-field {
  @apply flex items-center w-full max-w-[380px] mb-5;
}

.admin-signup-label {
  @apply min-w-[90px] text-center text-[14px] text-gray-600 font-medium mr-5;
}

/* 입력 래퍼 (일반) */
.admin-signup-input-wrapper {
  @apply flex-1 text-sm;
}

/* 입력 래퍼 (버튼 포함) */
.admin-signup-input-with-button {
  @apply flex items-center w-full gap-2 flex-1 text-sm;
}

/* 중복확인 버튼 */
.admin-signup-check-button {
  @apply h-[30px] bg-[#f5f5f5] border border-gray-400 font-normal text-gray-400 text-[12px] px-3 py-1 rounded-[15px] shadow-sm;
  @apply active:bg-primary active:text-white;
}

/* 제출 버튼 */
.admin-signup-submit-button {
  @apply w-[510px] rounded-[50px] text-sm font-medium mt-[19px] mb-[12px];
}
</style>
