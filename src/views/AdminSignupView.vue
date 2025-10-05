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

// 중복확인 상태 추가
const companyNameChecked = ref(false)
const emailChecked = ref(false)

// 기업명 중복확인 함수
const checkCompanyName = async () => {
  if (!formData.companyName) {
    alert('기업명을 입력해주세요.')
    return
  }

  // TODO: API 호출 (백엔드 API 연동 필요)
  // const response = await checkCompanyNameDuplicate(formData.companyName)

  // 임시 로직
  companyNameChecked.value = true
  alert('사용 가능한 기업명입니다.')
}

// 이메일 중복확인 함수
const checkEmail = async () => {
  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    alert('올바른 이메일 형식이 아닙니다.')
    return
  }

  // TODO: API 호출 (백엔드 API 연동 필요)
  // const response = await checkEmailDuplicate(formData.email)

  // 임시 로직
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
  // 중복확인 검증
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
    <div class="w-full max-w-[1194px] mt-[58px]">
      <AdminNavbar />
    </div>

    <!-- 메인 카드 -->
    <div class="card w-full max-w-[1194px] mt-[30px] p-12 flex flex-col items-center">
      <!-- 타이틀 섹션 -->
      <div class="text-center mb-12">
        <h1 class="text-[20px] font-semibold mt-[50px] mb-[10px]">가입 정보를 입력해주세요.</h1>
        <p class="text-[14px] text-black leading-relaxed mb-[50px]">
          승인까지 최대 3일 정도 소요됩니다. 빠른 승인을 원하실 경우 [ 문의하기 ]를 통해 알려주세요.
        </p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handleSubmit" class="flex flex-col items-center w-[350px]">
        <!-- 기업명 -->
        <div class="flex items-center w-full max-w-[600px] mb-[10px]">
          <label class="w-[80px] text-lg text-center text-[15px] font-[450] mr-[20px]"
            >기업명</label
          >
          <div class="relative w-full max-w-[400px]">
            <input
              v-model="formData.companyName"
              type="text"
              class="input-field-with-button w-full h-[38px] p-[10px]"
              placeholder="기업명을 입력해주세요."
              @input="resetCompanyNameCheck"
            />
            <button
              type="button"
              @click="checkCompanyName"
              style="
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background-color: transparent;
                color: #007bff;
                padding: 2px 8px;
                font-size: 14px;
                border: 1px solid #007bff;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
                z-index: 10;
              "
            >
              중복확인
            </button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="flex items-center w-full max-w-[600px] mb-[5px]">
          <label class="w-[80px] text-lg text-center text-[15px] font-[450] mr-[20px]">이름</label>
          <input
            v-model="formData.name"
            type="text"
            class="input-field w-full max-w-[400px] h-[44px] px-4"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- 이메일 -->
        <div class="flex items-center w-full max-w-[600px] mb-[5px]">
          <label class="w-[80px] text-lg text-center text-[15px] font-[450] mr-[20px]"
            >이메일</label
          >
          <div class="relative w-full max-w-[400px]">
            <input
              v-model="formData.email"
              type="email"
              class="input-field-with-button w-full h-[38px] p-[10px]"
              placeholder="이메일을 입력해주세요."
              @input="resetEmailCheck"
            />
            <button
              type="button"
              @click="checkEmail"
              style="
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background-color: transparent;
                color: #007bff;
                padding: 2px 8px;
                font-size: 14px;
                border: 1px solid #007bff;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
                z-index: 10;
              "
            >
              중복확인
            </button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="flex items-center w-full max-w-[600px] mb-[5px]">
          <label class="w-[80px] text-lg text-center text-[15px] font-[450] mr-[20px]"
            >연락처</label
          >
          <input
            v-model="formData.phone"
            type="tel"
            class="input-field w-full max-w-[400px] h-[44px] px-[5px]"
            placeholder="연락처를 입력해주세요."
          />
        </div>

        <!-- 기업로고 -->
        <div class="flex items-center w-full max-w-[600px] mb-[50px]">
          <label class="w-[80px] text-lg text-center text-[15px] font-[450] mr-[20px]">
            기업로고
          </label>
          <div class="w-full max-w-[400px]">
            <input
              id="logo-upload"
              type="file"
              class="file-upload-input"
              accept="image/*"
              @change="handleFileUpload"
            />
            <label for="logo-upload" class="file-upload-label w-full h-[44px]">
              {{ fileName || '클릭해서 파일첨부' }}
            </label>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="btn btn-primary btn-large mb-[50px]">사용 신청하기</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
