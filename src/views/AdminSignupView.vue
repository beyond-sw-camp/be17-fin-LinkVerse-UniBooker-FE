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

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.logo = file
    fileName.value = file.name
  }
}

const handleSubmit = () => {
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
    <div class="card w-full max-w-[1194px] mt-[30px] p-12">
      <!-- 타이틀 섹션 -->
      <div class="text-center mb-12">
        <h1 class="text-[20px] font-semibold mt-[50px] mb-[10px]">가입 정보를 입력해주세요.</h1>
        <p class="text-[14px] text-black leading-relaxed mb-[50px]">
          승인까지 최대 3일 정도 소요됩니다. 빠른 승인을 원하실 경우 [ 문의하기 ]를 통해 알려주세요.
        </p>
      </div>

      <!-- 폼 영역 -->
      <form @submit.prevent="handleSubmit" class="space-y-4 flex flex-col items-center">
        <!-- 기업명 -->
        <div class="flex items-center gap-4">
          <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]"> 기업명 </label>
          <input
            v-model="formData.companyName"
            type="text"
            class="input-field flex-1 mb-[10px]"
            placeholder="기업명을 입력해주세요."
          />
        </div>

        <!-- 이름 -->
        <div class="flex items-center gap-4">
          <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]"> 이름 </label>
          <input
            v-model="formData.name"
            type="text"
            class="input-field flex-1 mb-[10px]"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- 이메일 -->
        <div class="flex items-center gap-4">
          <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]"> 이메일 </label>
          <input
            v-model="formData.email"
            type="email"
            class="input-field flex-1 mb-[10px]"
            placeholder="이메일을 입력해주세요."
          />
        </div>

        <!-- 연락처 -->
        <div class="flex items-center gap-4">
          <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]"> 연락처 </label>
          <input
            v-model="formData.phone"
            type="tel"
            class="input-field flex-1 mb-[10px]"
            placeholder="연락처를 입력해주세요."
          />
        </div>

        <!-- 기업로고 -->
        <div class="flex items-center justify-center gap-4 mb-[50px] w-full">
          <label class="min-w-[68px] text-right text-[14px] font-medium mr-[15px]">
            기업로고
          </label>
          <input
            id="logo-upload"
            type="file"
            class="file-upload-input flex-1"
            accept="image/*"
            @change="handleFileUpload"
          />
          <label for="logo-upload" class="file-upload-label w-full">
            {{ fileName || '클릭해서 파일첨부' }}
          </label>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="btn btn-primary btn-large mb-[50px]">사용 신청하기</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
