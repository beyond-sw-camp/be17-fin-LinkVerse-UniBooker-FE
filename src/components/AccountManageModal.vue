<script setup>
import { ref, watch, computed } from 'vue'
import adminApi from '@/services/admin/admin_api'
import serviceApi from '@/services/service/service_api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import { getCompanyLogoUrl } from '@/utils/imageUrl'

const props = defineProps({
  open: Boolean,
  userData: Object,
})
const emit = defineEmits(['close'])

const mode = ref('view')
const router = useRouter()
const authStore = useAuthStore()

// ===== 로고 관련 상태 (단일화) =====
const logoPreviewUrl = ref('')
const logoFileName = ref('')
const logoFileInput = ref(null)

// ===== 프로필 정보 수정용 데이터 =====
const editInfo = ref({
  name: '',
  phone: '',
  logoUrl: '',
})

// ===== 비밀번호 변경용 데이터 =====
const passwordInfo = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// ===== 현재 표시할 로고 URL =====
/**
 * 로고 표시 우선순위:
 * 1. 미리보기 URL (업로드 중)
 * 2. 사용자 로고 URL (기존 로고)
 * 3. 기본 이미지
 */
const displayLogoUrl = computed(() => {
  if (logoPreviewUrl.value) {
    return logoPreviewUrl.value
  }

  if (props.userData?.logoUrl) {
    return getCompanyLogoUrl(props.userData.logoUrl)
  }

  return '/assets/images/admin_logo.png'
})

// ===== props 변경 감지 =====
/**
 * 모달 열릴 때 사용자 데이터 동기화
 */
watch(
  () => props.userData,
  (newVal) => {
    if (!newVal || mode.value === 'edit') return

    editInfo.value = {
      name: newVal.name || '',
      phone: newVal.phone || '',
      logoUrl: newVal.logoUrl || '',
    }

    // 미리보기 초기화
    logoPreviewUrl.value = ''
    logoFileName.value = ''
  },
  { immediate: true },
)

// ===== 수정 모드 진입 =====
const enterEditMode = () => {
  logoPreviewUrl.value = ''
  logoFileName.value = ''
  mode.value = 'edit'
}

// ===== 로고 파일 선택 =====
/**
 * 기업 로고 파일 업로드
 * - adminApi 사용으로 통일
 * - 파일 검증 추가
 */
const handleLogoFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 파일 크기 검증 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('파일 크기는 10MB를 초과할 수 없습니다.')
    if (logoFileInput.value) logoFileInput.value.value = ''
    return
  }

  // 파일 형식 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    if (logoFileInput.value) logoFileInput.value.value = ''
    return
  }

  logoFileName.value = file.name
  logoPreviewUrl.value = URL.createObjectURL(file) // 임시 미리보기

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

    // 4. editInfo에 URL 저장
    editInfo.value.logoUrl = fullUrl
    logoPreviewUrl.value = fullUrl
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')

    // 실패 시 초기화
    logoPreviewUrl.value = ''
    logoFileName.value = ''
    editInfo.value.logoUrl = props.userData?.logoUrl || ''
    if (logoFileInput.value) logoFileInput.value.value = ''
  }
}

// ===== 로고 파일 삭제 =====
const removeLogoFile = () => {
  logoPreviewUrl.value = ''
  logoFileName.value = ''
  editInfo.value.logoUrl = props.userData?.logoUrl || ''
  if (logoFileInput.value) logoFileInput.value.value = ''
}

// ===== 수정 완료 =====
/**
 * 프로필 수정 제출
 */
const handleEditSubmit = async () => {
  try {
    // 1. 개인 프로필 수정 (로고 제외)
    const payload = {
      name: editInfo.value.name,
      phone: editInfo.value.phone,
    }

    await adminApi.managerInfoEdit(payload)
    authStore.updateUser({ data: payload })

    // 2. 로고가 변경된 경우 별도 API 호출
    const isLogoChanged =
      editInfo.value.logoUrl && editInfo.value.logoUrl !== props.userData.logoUrl

    if (isLogoChanged) {
      await adminApi.updateCompanyLogo(editInfo.value.logoUrl)
      authStore.updateCompany({ logoUrl: editInfo.value.logoUrl })
    }

    // 3. 최신 데이터 가져오기
    const response = await adminApi.getMyProfile()
    Object.assign(props.userData, response.data.data || response.data)

    mode.value = 'view'
    logoPreviewUrl.value = ''
    logoFileName.value = ''

    alert('수정이 완료되었습니다.')
  } catch (err) {
    console.error('수정 실패:', err)
    alert(err.response?.data?.message || '수정에 실패했습니다.')
  }
}

// ===== 비밀번호 변경 완료 =====
const handlePasswordSubmit = async () => {
  if (passwordInfo.value.newPassword !== passwordInfo.value.confirmPassword) {
    alert('새 비밀번호와 확인이 일치하지 않습니다.')
    return
  }

  try {
    await adminApi.resetPassword({
      currentPassword: passwordInfo.value.currentPassword,
      newPassword: passwordInfo.value.newPassword,
      confirmPassword: passwordInfo.value.confirmPassword,
    })

    alert('비밀번호가 변경되었습니다.')
    passwordInfo.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    mode.value = 'view'
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || '비밀번호 변경에 실패했습니다.')
  }
}

// ===== 전화번호 입력 시 하이픈 자동 추가 =====
const formatPhoneNumber = (e) => {
  let input = e.target.value.replace(/\D/g, '')
  input = input.slice(0, 11)

  if (input.length > 3 && input.length <= 7) {
    input = input.replace(/(\d{3})(\d+)/, '$1-$2')
  } else if (input.length > 7) {
    input = input.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
  }

  e.target.value = input
  editInfo.value.phone = input
}

// ===== 로고 파일 선택 트리거 ===== (이 함수만 추가)
// 로고 파일 선택 트리거 (이 함수만 추가)
const triggerFileInput = () => {
  if (logoFileInput.value) {
    logoFileInput.value.click()
  }
}
</script>

<template>
  <Modal :open="props.open" @close="emit('close')">
    <div class="modal-container">
      <!-- 보기 모드 -->
      <template v-if="mode === 'view'">
        <div class="modal-header">
          <h3>내 계정관리</h3>
          <span class="cursor-pointer update-btn" @click="enterEditMode">수정</span>
        </div>

        <div class="modal-input-section">
          <label>기업명</label>
          <span>{{ userData?.companyName }}</span>
        </div>
        <div class="modal-input-section">
          <label>사업자등록번호</label>
          <span>{{ userData?.businessNumber }}</span>
        </div>
        <div class="modal-input-section">
          <label>이메일</label>
          <span>{{ userData?.email }}</span>
        </div>
        <div class="modal-input-section">
          <label>이름</label>
          <span>{{ userData?.name }}</span>
        </div>
        <div class="modal-input-section">
          <label>연락처</label>
          <span>{{ userData?.phone }}</span>
        </div>
        <div class="modal-input-section">
          <label>기업로고</label>
          <img :src="displayLogoUrl" class="service-group-thumbnail" alt="기업 로고" />
        </div>

        <div class="modal-button-container">
          <Button size="sm" @click="mode = 'password'">비밀번호 변경</Button>
        </div>
      </template>

      <!-- 수정 모드 -->
      <template v-else-if="mode === 'edit'">
        <div class="modal-header">
          <h3>내 계정 수정</h3>
        </div>

        <div class="modal-input-section">
          <label>이름</label>
          <input v-model="editInfo.name" type="text" class="modal-input" />
        </div>
        <div class="modal-input-section">
          <label>연락처</label>
          <input
            v-model="editInfo.phone"
            type="text"
            class="modal-input"
            @input="formatPhoneNumber"
          />
        </div>
        <!-- 기업로고 업로드 필드 -->
        <div class="modal-input-section">
          <div class="modal-input-section-logo">
            <div class="logo-upload-container">
              <label>기업로고</label>
              <label for="logo-upload" class="file-upload-label">
                <img :src="displayLogoUrl" class="service-group-thumbnail" alt="로고 미리보기" />
              </label>
              <input
                id="logo-upload"
                ref="logoFileInput"
                type="file"
                accept="image/*"
                class="file-upload-input hidden"
                @change="handleLogoFileChange"
              />
            </div>
            <div class="modal-input-file-logo-section">
              <span v-if="logoFileName" class="file-name">{{ logoFileName }}</span>
              <div class="modal-input-file-logo-btn-section">
                <button @click="triggerFileInput" class="upload-logo-btn">첨부</button>
                <button v-if="logoPreviewUrl" @click="removeLogoFile" class="remove-logo-btn">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-button-container">
          <Button theme="gray" size="sm" @click="mode = 'view'">취소</Button>
          <Button size="sm" @click="handleEditSubmit">완료</Button>
        </div>
      </template>

      <!-- 비밀번호 변경 모드 (기존 유지) -->
      <template v-else-if="mode === 'password'">
        <!-- ... -->
      </template>
    </div>
  </Modal>
</template>

<style scoped>
.modal-container {
  @apply p-[20px] flex flex-col overflow-y-auto max-h-[600px] min-w-[400px];
}

h3 {
  @apply text-[18px] font-medium mb-[3px];
}

.modal-input-section {
  @apply flex justify-between items-center mt-[15px] mb-[5px];
}

label,
.modal-input-section > span {
  @apply text-[14px] text-black;
}

.modal-input-section-logo {
  @apply w-full flex flex-col items-center;
}

.modal-button-container {
  @apply flex gap-2 mt-[45px];
}

.modal-button-container button {
  @apply flex-1 h-[40px] font-normal rounded-[3px];
}

.modal-header {
  @apply flex justify-between items-center mb-[20px];
}

.modal-header span {
  @apply text-[12px] text-gray-dark cursor-pointer hover:text-[#CE0202];
}

.modal-input,
.modal-input-file,
.modal-textarea {
  @apply bg-gray-line px-[12px] py-[8px] text-[14px] rounded-[3px];
}

.modal-input-file {
  @apply w-[193px] text-[12px] cursor-pointer;
}

.modal-textarea {
  @apply h-[100px] w-[400px] align-top outline-none resize-none;
}

.secession {
  @apply flex items-start gap-5;
}

.secession label {
  @apply mt-[9px];
}

.secession input {
  @apply w-[400px];
}

.update-btn {
  @apply border border-opacity-50 border-primary text-primary font-medium px-3 py-0.5 rounded-full hover:border-red-600 hover:bg-gray-line;
}

.service-group-thumbnail {
  @apply h-[50px] border border-gray-deep rounded-[3px];
}

.modal-input-file-logo-section {
  @apply w-full flex justify-between items-center mt-4;
}

.logo-upload-container {
  @apply w-full flex justify-between items-center;
}

.file-upload-label {
  @apply cursor-pointer;
}

.file-upload-input {
  @apply hidden;
}

.modal-input-file-logo-btn-section {
  @apply w-full max-h-8 flex justify-end gap-2;
}

.remove-logo-btn {
  @apply px-5 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600;
}

.upload-logo-btn {
  @apply px-5 py-1 text-sm bg-gray-500 text-white rounded hover:bg-red-600;
}

.file-name {
  @apply text-sm text-primary mt-1 max-w-[180px];
}
</style>
