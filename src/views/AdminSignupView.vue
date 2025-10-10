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
        <h1 class="components-card-title text-gray-600 mt-[20px] mb-[10px]">
          가입 정보를 입력해주세요.
        </h1>
        <p class="components-card-description text-gray-400 font-medium">
          승인까지 최대 3일 정도 소요됩니다. 빠른 승인을 원하실 경우 [ 문의하기 ]를 통해 알려주세요.
        </p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handleSubmit" class="flex flex-col items-center">
        <!-- 기업명 -->
        <div class="flex items-center w-full max-w-[450px] mb-[10px] mr-[30px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">기업명</label>
          <div class="components-input-with-button-wrapper flex-1">
            <Input
              v-model="formData.companyName"
              type="text"
              placeholder="기업명을 입력해주세요."
              @input="resetCompanyNameCheck"
            />
            <Button type="button" @click="checkCompanyName">
              중복확인
            </Button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="flex items-center w-full max-w-[500px] mb-[10px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">이름</label>
          <Input
            v-model="formData.name"
            type="text"
            class="flex-1"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- 이메일 -->
        <div class="flex items-center w-full max-w-[450px] mb-[10px] mr-[30px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">이메일</label>
          <div class="components-input-with-button-wrapper flex-1">
            <Input
              v-model="formData.email"
              type="email"
              placeholder="이메일을 입력해주세요."
              @input="resetEmailCheck"
            />
            <Button type="button" @click="checkEmail">
              중복확인
            </Button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="flex items-center w-full max-w-[500px] mb-[10px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">연락처</label>
          <Input
            v-model="formData.phone"
            type="tel"
            class="flex-1"
            placeholder="연락처를 입력해주세요."
          />
        </div>

        <!-- 기업로고 -->
        <div class="flex items-center w-full max-w-[500px] mb-[55px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">기업로고</label>
          <div class="components-file-upload-wrapper flex-1">
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
            />
            <label for="logo-upload" class="components-file-upload-label">
              {{ fileName || '클릭해서 파일첨부' }}
            </label>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <Button type="submit" class="rounded-[20px] mb-[27px]">
          사용 신청하기
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.components-card {
  @apply bg-white rounded-[25px] shadow-md p-10;
}

.components-card-title {
  @apply text-gray-800 font-semibold text-xl text-center mb-4;
}

.components-card-subtitle {
  @apply text-gray-700 font-normal text-sm text-center leading-relaxed;
}

.components-form-label {
        @apply text-gray-700 font-medium text-[15px] text-center min-w-[80px];
    }

    .components-input-with-button-wrapper {
        @apply relative w-full;
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
</style>
