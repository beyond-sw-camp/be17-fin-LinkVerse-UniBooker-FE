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
            <input
              v-model="formData.companyName"
              type="text"
              class="components-input-with-button"
              placeholder="기업명을 입력해주세요."
              @input="resetCompanyNameCheck"
            />
            <button type="button" @click="checkCompanyName" class="components-btn-check-inside">
              중복확인
            </button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="flex items-center w-full max-w-[500px] mb-[10px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">이름</label>
          <input
            v-model="formData.name"
            type="text"
            class="components-input-field flex-1"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- 이메일 -->
        <div class="flex items-center w-full max-w-[450px] mb-[10px] mr-[30px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">이메일</label>
          <div class="components-input-with-button-wrapper flex-1">
            <input
              v-model="formData.email"
              type="email"
              class="components-input-with-button"
              placeholder="이메일을 입력해주세요."
              @input="resetEmailCheck"
            />
            <button type="button" @click="checkEmail" class="components-btn-check-inside">
              중복확인
            </button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="flex items-center w-full max-w-[500px] mb-[10px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">연락처</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="components-input-field flex-1"
            placeholder="연락처를 입력해주세요."
          />
        </div>

        <!-- 기업로고 -->
        <div class="flex items-center w-full max-w-[500px] mb-[55px] ml-[20px]">
          <label class="components-form-label text-gray-600 text-[16px] mr-5">기업로고</label>
          <div class="components-file-upload-wrapper flex-1">
            <input
              id="logo-upload"
              type="file"
              class="components-file-upload-input"
              accept="image/*"
              @change="handleFileUpload"
            />
            <label for="logo-upload" class="components-file-upload-label">
              {{ fileName || '클릭해서 파일첨부' }}
            </label>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="components-btn-large rounded-[20px] mb-[27px]">
          사용 신청하기
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컴포넌트별 추가 스타일이 필요한 경우에만 사용 */
</style>
