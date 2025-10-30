<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import adminApi from '@/services/admin/admin_api'

const router = useRouter()

// ===== 폼 데이터 =====
const formData = reactive({
  businessNumber: '',
  companyName: '',
  companySlug: '',
  name: '',
  email: '',
  phone: '',
  logoUrl: '', // ← logo 제거, logoUrl만 사용
})

const fileName = ref('')
const thumbnail = ref('')
const isLoading = ref(false)

// ===== 중복확인 상태 =====
const duplicateCheckState = reactive({
  businessNumber: false,
  slug: false,
  email: false,
})

// ===== 자동 형식 입력 함수 (기존 유지) =====
const formatBusinessNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '')
  const limited = numbers.slice(0, 10)
  if (limited.length <= 3) return limited
  if (limited.length <= 5) return `${limited.slice(0, 3)}-${limited.slice(3)}`
  return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`
}

const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '')
  const limited = numbers.slice(0, 11)
  if (limited.length <= 3) return limited
  if (limited.length <= 7) return `${limited.slice(0, 3)}-${limited.slice(3)}`
  return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`
}

const formatSlug = (value) => {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  const limited = cleaned.slice(0, 30)
  const withoutDoubleHyphen = limited.replace(/--+/g, '-')
  return withoutDoubleHyphen.replace(/^-+|-+$/g, '')
}

// ===== 형식 검증 computed (기존 유지) =====
const isBusinessNumberValid = computed(() => {
  const cleaned = formData.businessNumber.replace(/[^0-9]/g, '')
  return cleaned.length === 10
})

const isSlugValid = computed(() => {
  const slug = formData.companySlug
  return (
    slug.length >= 3 &&
    slug.length <= 30 &&
    !slug.startsWith('-') &&
    !slug.endsWith('-') &&
    !slug.includes('--')
  )
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(formData.email)
})

// ===== 중복확인 함수 (기존 유지) =====
const checkBusinessNumber = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.checkBusinessNumber(formData.businessNumber)
    if (response.data.data === false) {
      duplicateCheckState.businessNumber = true
      alert('사용 가능한 사업자등록번호입니다.')
    } else {
      alert('이미 등록된 사업자등록번호입니다.')
    }
  } catch (error) {
    console.error('사업자등록번호 중복 확인 실패:', error)
    alert(error.response?.data?.message || '중복 확인 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

const checkSlug = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.checkSlug(formData.companySlug)
    const result = response.data.data
    if (result.available) {
      duplicateCheckState.slug = true
      alert(result.message || '사용 가능한 Slug입니다.')
    } else {
      alert(result.message || '사용할 수 없는 Slug입니다.')
    }
  } catch (error) {
    console.error('Slug 중복 확인 실패:', error)
    alert(error.response?.data?.message || '중복 확인 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

const checkEmail = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.checkEmail(formData.email)
    if (response.data.data === false) {
      duplicateCheckState.email = true
      alert('사용 가능한 이메일입니다.')
    } else {
      alert('이미 사용 중인 이메일입니다.')
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    alert(error.response?.data?.message || '중복 확인 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// ===== 파일 업로드 =====
/**
 * 기업 로고 파일 업로드
 * - adminApi 사용으로 통일
 * - CloudFront URL 자동 생성
 */
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 파일 크기 검증 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('파일 크기는 10MB를 초과할 수 없습니다.')
    event.target.value = ''
    return
  }

  // 파일 형식 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    event.target.value = ''
    return
  }

  fileName.value = file.name
  thumbnail.value = URL.createObjectURL(file) // 임시 미리보기

  try {
    // 1. Presigned URL 요청
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('imageType', 'serviceGroup')

    const presignedUrl = await adminApi.getPresignedURL(uploadForm)
    if (!presignedUrl) {
      throw new Error('Presigned URL을 가져오지 못했습니다.')
    }

    // 2. S3에 직접 업로드
    await adminApi.uploadImage(presignedUrl, file)

    // 3. CloudFront URL 생성
    const cloudFrontDomain =
      import.meta.env.VITE_CLOUDFRONT_URL || 'https://d2h9e9y86awp4t.cloudfront.net'
    const s3Path = presignedUrl.split('.com')[1].split('?')[0]
    const fullUrl = cloudFrontDomain + s3Path

    // 4. formData에 URL 저장
    formData.logoUrl = fullUrl
    thumbnail.value = fullUrl
  } catch (err) {
    console.error('이미지 업로드 오류:', err)
    alert('이미지 업로드 중 오류가 발생했습니다.')

    // 실패 시 초기화
    fileName.value = ''
    thumbnail.value = ''
    formData.logoUrl = ''
    event.target.value = ''
  }
}

// ===== 폼 제출 =====
/**
 * 관리자 회원가입 제출
 */
const handleSubmit = async () => {
  // 1. 사업자등록번호 검증
  const cleanedBusinessNumber = formData.businessNumber.replace(/[^0-9]/g, '')
  if (cleanedBusinessNumber.length !== 10) {
    alert('사업자등록번호 10자리를 모두 입력해주세요.')
    return
  }

  // 2. 중복확인 검증
  if (!duplicateCheckState.businessNumber) {
    alert('사업자등록번호 중복확인을 해주세요.')
    return
  }

  // 3. 기업명 검증
  if (!formData.companyName || formData.companyName.length < 2) {
    alert('기업명을 2자 이상 입력해주세요.')
    return
  }

  // 4. Slug 검증
  if (formData.companySlug.length < 3 || formData.companySlug.length > 30) {
    alert('Company Slug는 3~30자여야 합니다.')
    return
  }

  // 5. Slug 중복확인 검증
  if (!duplicateCheckState.slug) {
    alert('Company Slug 중복확인을 해주세요.')
    return
  }

  // 6. 이름 검증
  if (!formData.name || formData.name.length < 2) {
    alert('이름을 2자 이상 입력해주세요.')
    return
  }

  // 7. 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    alert('올바른 이메일 형식이 아닙니다.')
    return
  }

  // 8. 이메일 중복확인 검증
  if (!duplicateCheckState.email) {
    alert('이메일 중복확인을 해주세요.')
    return
  }

  // 9. 연락처 검증
  const cleanedPhone = formData.phone.replace(/[^0-9]/g, '')
  if (cleanedPhone.length !== 11) {
    alert('연락처 11자리를 모두 입력해주세요.')
    return
  }

  // 10. 로고 업로드 검증 (선택사항이면 제거 가능)
  if (!formData.logoUrl) {
    alert('기업 로고를 업로드해주세요.')
    return
  }

  // 11. JSON 데이터 생성 및 전송
  const requestData = {
    businessNumber: formData.businessNumber,
    companyName: formData.companyName,
    companySlug: formData.companySlug,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    logoUrl: formData.logoUrl, // CloudFront URL
  }

  try {
    isLoading.value = true
    const response = await adminApi.signUpAdmin(requestData)

    alert(response.data.data.message || '회원가입 신청이 완료되었습니다.')

    router.push({
      name: 'adminStatus',
      query: { email: formData.email },
    })
  } catch (error) {
    console.error('❌ 회원가입 실패:', error)
    alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// ===== 제출 버튼 활성화 여부 =====
const isSubmitEnabled = computed(() => {
  return (
    duplicateCheckState.businessNumber &&
    duplicateCheckState.slug &&
    duplicateCheckState.email &&
    formData.companyName &&
    formData.name &&
    formData.phone &&
    formData.logoUrl
  )
})

// ===== 로그인 페이지 이동 =====
const goToLogin = () => {
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin-signup-container">
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
        <!-- 사업자등록번호 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">사업자등록번호</label>
          <div class="admin-signup-input-with-button">
            <Input
              :modelValue="formData.businessNumber"
              @update:modelValue="
                (value) => {
                  formData.businessNumber = formatBusinessNumber(value)
                  duplicateCheckState.businessNumber = false
                }
              "
              type="text"
              placeholder="123-45-67890"
              class="admin-signup-input"
            />
            <Button
              class="admin-signup-check-button"
              :class="{ checked: duplicateCheckState.businessNumber }"
              type="button"
              @click="checkBusinessNumber"
              :disabled="!isBusinessNumberValid || isLoading"
            >
              {{ duplicateCheckState.businessNumber ? '✓' : '중복확인' }}
            </Button>
          </div>
        </div>

        <!-- 기업명 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">기업명</label>
          <div class="admin-signup-input-wrapper">
            <Input
              v-model="formData.companyName"
              type="text"
              placeholder="기업명을 입력해주세요 (2~100자)"
            />
          </div>
        </div>

        <!-- 사용 도메인 (Slug) -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">사용 도메인</label>
          <div class="admin-signup-domain-input-with-button">
            <span class="domain-prefix">unibooker.co.kr/c/</span>
            <Input
              :modelValue="formData.companySlug"
              @update:modelValue="
                (value) => {
                  formData.companySlug = formatSlug(value)
                  duplicateCheckState.slug = false
                }
              "
              type="text"
              placeholder="company-name"
              class="admin-signup-input"
            />
            <Button
              class="admin-signup-check-button"
              :class="{ checked: duplicateCheckState.slug }"
              type="button"
              @click="checkSlug"
              :disabled="!isSlugValid || isLoading"
            >
              {{ duplicateCheckState.slug ? '✓' : '중복확인' }}
            </Button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">이름</label>
          <div class="admin-signup-input-wrapper">
            <Input v-model="formData.name" type="text" placeholder="이름을 입력해주세요 (2~50자)" />
          </div>
        </div>

        <!-- 이메일 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">이메일</label>
          <div class="admin-signup-input-with-button">
            <Input
              v-model="formData.email"
              @input="() => (duplicateCheckState.email = false)"
              type="email"
              placeholder="example@email.com"
              class="admin-signup-input"
            />
            <Button
              class="admin-signup-check-button"
              :class="{ checked: duplicateCheckState.email }"
              type="button"
              @click="checkEmail"
              :disabled="!isEmailValid || isLoading"
            >
              {{ duplicateCheckState.email ? '✓' : '중복확인' }}
            </Button>
          </div>
        </div>

        <!-- 연락처 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">연락처</label>
          <div class="admin-signup-input-wrapper">
            <Input
              :modelValue="formData.phone"
              @update:modelValue="(value) => (formData.phone = formatPhoneNumber(value))"
              type="tel"
              placeholder="010-1234-5678"
            />
          </div>
        </div>

        <!-- 기업로고 -->
        <div class="admin-signup-field">
          <label class="admin-signup-label">기업로고</label>
          <div class="admin-signup-input-wrapper">
            <label for="logo-upload" class="file-upload-label">
              <!-- 이미지가 있으면 보여주기, 없으면 안내 문구 -->
              <template v-if="thumbnail">
                <img :src="thumbnail" class="preview-img" alt="로고 미리보기" />
              </template>
              <template v-else> 이미지 업로드 </template>
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              class="file-upload-input hidden"
              @change="handleFileUpload"
            />
          </div>
          <span v-if="fileName" class="file-name">{{ fileName }}</span>
        </div>

        <!-- 제출 버튼 -->
        <Button
          type="submit"
          class="admin-signup-submit-button"
          :class="{ disabled: !isSubmitEnabled || isLoading }"
          :disabled="!isSubmitEnabled || isLoading"
        >
          {{ isLoading ? '처리 중...' : '사용 신청하기' }}
        </Button>

        <div class="admin-signup-info">
          <!-- 로그인 안내 -->
          <div class="admin-signup-signup">
            이미 서비스를 이용중이신가요?
            <span class="admin-signup-signup-link" @click="goToLogin"> 로그인 </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-signup-container {
  @apply min-h-screen bg-[#eeeeee] flex flex-col items-center px-4;
}

/* 회원가입 카드 */
.admin-signup-card {
  @apply bg-white shadow-md rounded-[20px] w-full max-w-7xl p-10 mt-[30px] mb-[50px];
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
  @apply flex items-center w-full max-w-[500px] mb-5;
}

.admin-signup-label {
  @apply min-w-[100px] text-center text-[14px] text-gray-600 font-medium mr-5;
}

/* 입력 래퍼 (일반) */
.admin-signup-input-wrapper {
  @apply flex-1 text-sm flex flex-col gap-2;
}

/* 입력 래퍼 (버튼 포함) */
.admin-signup-input-with-button {
  @apply flex items-center gap-2 flex-1 text-sm;
}

/* 도메인 입력 래퍼 */
.admin-signup-domain-input-with-button {
  @apply flex items-center gap-2 flex-1 text-sm;
}

.domain-prefix {
  @apply text-sm text-gray-600 font-medium whitespace-nowrap;
}

.admin-signup-input {
  @apply w-full;
}

/* 파일 input 스타일 */
.admin-sigup-file-input-field {
  @apply flex flex-col w-full max-w-[500px] mb-10;
}

.admin-signup-field-file {
  @apply flex items-center w-full max-w-[500px] mb-2;
}

.file-input {
  @apply w-full px-2 py-2 border-b-2 border-gray-200 rounded-md text-gray-400
  focus:border-primary focus:ring-primary transition-all;
}

.file-name {
  @apply text-sm text-primary-bright ml-[130px];
}

/* 중복확인 버튼 */
.admin-signup-check-button {
  @apply h-[32px] min-w-[70px] bg-[#f5f5f5] border border-gray-400 font-normal text-gray-400 text-[12px] px-2 py-1 rounded-full shadow-sm;
  @apply transition-all;
}

/* 활성 상태 (형식 검증 통과) */
.admin-signup-check-button:not(:disabled):not(.checked) {
  @apply bg-primary text-white border-primary;
  @apply hover:bg-primary-hover hover:shadow-md;
}

/* 중복확인 완료 상태 */
.admin-signup-check-button.checked {
  @apply bg-green-500 text-white border-green-500;
}

/* 비활성 상태 (형식 검증 실패 또는 로딩 중) */
.admin-signup-check-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 제출 버튼 */
.admin-signup-submit-button {
  @apply w-[550px] rounded-[50px] text-sm font-medium mt-[19px] mb-[12px];
  @apply bg-primary text-white hover:bg-primary-hover transition-all;
}

.admin-signup-submit-button.disabled {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed;
}

/* 로그인 안내 */
.admin-signup-info {
  @apply flex flex-col pt-3 pb-10 gap-2;
}

.admin-signup-signup {
  @apply text-sm text-gray-400 w-[450px] flex justify-center;
}

.admin-signup-signup-link {
  @apply text-gray-600 font-medium hover:text-primary-hover ml-2 underline cursor-pointer bg-transparent border-none;
}

.preview-img {
  @apply h-[50px] border border-gray-deep rounded-[3px];
}
</style>
