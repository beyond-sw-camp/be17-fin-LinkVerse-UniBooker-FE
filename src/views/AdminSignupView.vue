<script setup>
import { ref, reactive } from 'vue'
import AdminNavbar from '@/components/AdminNavbar.vue'

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

  // TODO: API 호출
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
  <div class="min-h-screen bg-[#eeeeee] flex flex-col items-center px-4">
    <!-- 네비게이션 -->
    <div class="w-full max-w-[1194px] mt-[30px]">
      <AdminNavbar />
    </div>

    <!-- 메인 카드 -->
    <div class="components-card w-full max-w-[1194px] mt-[30px]">
      <!-- 타이틀 섹션 -->
      <div class="text-center mb-12">
        <h1 class="components-card-title mt-[20px]">가입 정보를 입력해주세요.</h1>
        <p class="components-card-description text-[14px] text-text">
          승인까지 최대 3일 정도 소요됩니다. 빠른 승인을 원하실 경우 [ 문의하기 ]를 통해 알려주세요.
        </p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handleSubmit" class="flex flex-col items-center">
        <!-- 기업명 -->
        <div class="flex items-center w-full max-w-[450px] mb-[20px] mr-[30px]">
          <label class="components-form-label">기업명</label>
          <div class="components-input-with-button-wrapper flex-1">
            <input
              v-model="formData.companyName"
              type="text"
              placeholder="기업명을 입력해주세요."
              class="input-style"
              @input="resetCompanyNameCheck"
            />
            <Button class="bg-[#b4b4b4] hover:bg-[#9b9b9b] text-[12px] px-3 py-1 rounded-[8px]" type="button" @click="checkCompanyName"> 중복확인 </Button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="flex items-center items-start mb-[20px]">
          <label class="min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px]">
            이름
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="input-style"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- 이메일 -->
        <div class="flex items-center w-full max-w-[450px] mb-[20px] mr-[30px]">
          <label class="components-form-label">이메일</label>
          <div class="components-input-with-button-wrapper flex-1">
            <input
              v-model="formData.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              class="input-style"
              @input="resetEmailCheck"
            />
            <Button class="bg-[#b4b4b4] hover:bg-[#9b9b9b] text-[12px] px-3 py-1 rounded-[8px]" type="button" @click="checkEmail"> 중복확인 </Button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="flex items-center items-start mb-[20px]">
          <label class="min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px]">연락처</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="input-style"
            placeholder="연락처를 입력해주세요."
          />
        </div>

        <!-- 신청 사유 -->
         <div class="flex items-center items-start mb-[70px]">
          <label class="min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px]">신청사유</label>
          <input
            type="text"
            class="input-style"
            placeholder="신청사유를 간단하게 입력해주세요."
          />
        </div>

        <!-- 기업로고 -->
        <div class="flex items-center w-full max-w-[500px] mb-[55px] ml-[20px]">
          <label class="components-form-label">기업로고</label>
          <div class="components-file-upload-wrapper flex-1">
            <input id="logo-upload" class="input-style !hover:border-0" type="file" accept="image/*" @change="handleFileUpload" />
          </div>
        </div>

        <!-- 제출 버튼 -->
        <Button type="submit" class="w-[510px] mb-[12px] rounded-[50px] text-sm font-medium"> 사용 신청하기 </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.components-card {
  @apply bg-white rounded-[20px] p-10 mb-[50px];
}

.components-card-title {
  @apply font-semibold text-center mb-2 text-[18px];
}

.components-card-subtitle {
  @apply text-gray-700 text-sm text-center leading-relaxed;
}

.components-form-label {
  @apply min-w-[68px] text-left text-[14px] text-gray-600 font-medium ml-[5px];
}

.components-input-with-button-wrapper {
  @apply flex w-full gap-2;
}

.components-file-upload-wrapper {
  @apply relative;
}

.components-file-upload-input {
  @apply hidden;
}

.components-file-upload-label {
  @apply flex items-center w-full max-w-[350px] h-[35px] px-[10px] py-[10px];
  @apply border border-[#cbcbcb] rounded-[3px];
  @apply font-normal text-base text-[#cbcbcb] cursor-pointer;
  @apply bg-gray-100;
  @apply transition-all duration-300;
}

.components-file-upload-label:hover {
  @apply border-primary bg-primary/[0.02];
  @apply bg-gray-100;
}

.input-style {
  @apply flex-1 w-[407px] text-sm border-b border-transparent hover:border-gray-line focus:border-gray-line px-2 py-1 outline-none;
}
</style>
