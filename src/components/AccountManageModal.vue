<script setup>
import { ref, watch } from 'vue'
import adminApi from '@/services/admin/admin_api'
import serviceApi from '@/services/service/service_api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'
import { getCompanyLogoUrl } from '@/utils/imageUrl'
import { computed } from 'vue'

const props = defineProps({
  open: Boolean,
  userData: Object,
})
const emit = defineEmits(['close'])

const mode = ref('view') // view | edit | password | withdraw
const router = useRouter()
const authStore = useAuthStore()
const thumbnail = ref('')

// 프로필 정보 수정용 임시 데이터
const editInfo = ref({
  businessNumber: '',
  name: '',
  phone: '',
  logoFile: null,
  logoUrl: '', // 기존 로고 URL
})

// ===== 파일 업로드 관련 =====

/** 선택된 로고 파일 */
const logoFile = ref(null)

/** 로고 파일명 */
const logoFileName = ref('')

/** 로고 미리보기 URL */
const logoPreviewUrl = ref('')

/** 로고 파일 input ref */
const logoFileInput = ref(null)

/**
 * 로고 파일 선택 처리
 */
const handleLogoFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 파일 크기 검증 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('파일 크기는 10MB를 초과할 수 없습니다.')
    logoFileInput.value.value = ''
    return
  }

  // 파일 형식 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    logoFileInput.value.value = ''
    return
  }

  logoFile.value = file
  logoFileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreviewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

/**
 * 로고 파일 삭제
 */
const removeLogoFile = () => {
  logoFile.value = null
  logoFileName.value = ''
  logoPreviewUrl.value = ''
  if (logoFileInput.value) {
    logoFileInput.value.value = ''
  }
}

/**
 * 현재 표시할 로고 URL
 */
const displayLogoUrl = computed(() => {
  if (logoPreviewUrl.value) {
    return logoPreviewUrl.value
  }

  if (!props.userData?.logoUrl) {
    return '/assets/images/admin_logo.png'
  }

  return getCompanyLogoUrl(props.userData.logoUrl)
})

// 비밀번호 변경용 임시 데이터
const passwordInfo = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 탈퇴용 임시 데이터
const withdrawInfo = ref({
  password: '',
  reason: '',
})

// 탈퇴 모드 진입
const enterWithdrawMode = () => {
  withdrawInfo.value = { password: '', reason: '' }
  mode.value = 'withdraw'
}

// 탈퇴 요청
const handleWithdrawSubmit = async () => {
  if (!withdrawInfo.value.password) {
    alert('비밀번호를 입력해주세요.')
    return
  }
  try {
    const payload = {
      password: withdrawInfo.value.password,
      reason: withdrawInfo.value.reason,
    }
    const response = await adminApi.managerInfoDelete(payload)

    // 서버에서 성공 여부 확인
    alert('탈퇴 완료되었습니다.')
    emit('close')
    router.replace('/admin/home')
  } catch (err) {
    console.error(err)
    alert('탈퇴에 실패했습니다.')
  }
}

// props.userData가 바뀌면 editInfo에 반영 (모달 열 때 초기화용)
// props.userData가 바뀌면 editInfo에 반영 (모달 열 때 초기화용)
watch(
  () => props.userData,
  (newVal) => {
    if (!newVal || mode.value === 'edit') return // 편집 중엔 덮어쓰기 X

    editInfo.value = {
      businessNumber: newVal.businessNumber || '',
      name: newVal.name || '',
      phone: newVal.phone || '',
      logoFile: null,
      // logoUrl이 비어있을 때만 기본 이미지 넣기
      logoUrl: newVal.logoUrl && newVal.logoUrl.trim() !== ''
        ? newVal.logoUrl
        : '/assets/images/no-image.png',
    }

    // 썸네일도 동일하게 처리
    thumbnail.value =
      newVal.logoUrl && newVal.logoUrl.trim() !== ''
        ? newVal.logoUrl
        : '/assets/images/no-image.png'
  },
  { immediate: true },
)



// 수정 모드 진입
const enterEditMode = () => {
  logoFile.value = null
  logoFileName.value = ''
  logoPreviewUrl.value = ''
  mode.value = 'edit'
}

// 파일 선택 처리
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', 'serviceGroup')

    const presignedUrl = await serviceApi.getServiceGroupPresignedURL(formData)
    if (!presignedUrl) throw new Error('Presigned URL을 가져오지 못했습니다.')
    await serviceApi.uploadImage(presignedUrl, file)

    const cloudFrontDomain = 'https://d2h9e9y86awp4t.cloudfront.net'
    const s3Path = presignedUrl.split('.com')[1].split('?')[0]
    thumbnail.value = cloudFrontDomain + s3Path // 미리보기 변경
    editInfo.value.logoUrl = thumbnail.value // 수정 정보에도 반영
  } catch (error) {
    console.error('이미지 업로드 과정에서 오류 발생:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
  }
}

/**
 * 수정 완료 처리
 */
const handleEditSubmit = async () => {
  try {
    const logoUrlToSend =
      editInfo.value.logoUrl && editInfo.value.logoUrl !== '/assets/images/no-image.png'
        ? editInfo.value.logoUrl
        : props.userData.logoUrl

    const payload = {
      name: editInfo.value.name,
      phone: editInfo.value.phone,
      logoUrl: logoUrlToSend,
    }

    await adminApi.managerInfoEdit(payload)
    authStore.updateUser(payload)

    // 3. 최신 데이터 가져오기
    const response = await adminApi.getMyProfile()
    Object.assign(props.userData, response.data)

    // 4. 모드 전환
    mode.value = 'view'
    logoFile.value = null
    logoFileName.value = ''
    logoPreviewUrl.value = ''

    alert('수정이 완료되었습니다.')
  } catch (err) {
    console.error('수정 실패:', err)
    alert('수정에 실패했습니다.')
  }
}

// 비밀번호 변경 완료
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
    alert('비밀번호 변경에 실패했습니다.')
  }
}

// 전화번호 입력 시 하이픈 자동 추가
const formatPhoneNumber = (e) => {
  let input = e.target.value.replace(/\D/g, '') // 숫자만 남기기
  input = input.slice(0, 11) // 최대 11자리 제한

  if (input.length > 3 && input.length <= 7) {
    input = input.replace(/(\d{3})(\d+)/, '$1-$2')
  } else if (input.length > 7) {
    input = input.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
  }

  e.target.value = input
  editInfo.value.phone = input
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
          <div id="service-group-image-upload">
            <label for="file-upload" class="file-upload-label">
              <template v-if="thumbnail">
                <img :src="thumbnail" class="service-group-thumbnail" alt="미리보기" />
              </template>
              <template v-else>
                <img
                  src="/assets/images/no-image.png"
                  class="service-group-thumbnail"
                  alt="기본 이미지"
                />
              </template>
            </label>
            <input id="file-upload" type="file" class="file-upload-input hidden" @change="onFileChange"/>
          </div>
        </div>

        <div class="modal-button-container">
          <Button @click="enterWithdrawMode" theme="gray" size="sm">서비스 탈퇴</Button>
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
        <div class="modal-input-section-logo">
          <label>기업로고</label>
          <input @change="onFileChange" type="file" class="modal-input-file" />
        </div>

        <div class="modal-button-container">
          <Button theme="gray" size="sm" @click="mode = 'view'">취소</Button>
          <Button size="sm" @click="handleEditSubmit">완료</Button>
        </div>
      </template>

      <!-- 비밀번호 변경 모드 -->
      <template v-else-if="mode === 'password'">
        <div class="modal-header">
          <h3>비밀번호 변경</h3>
        </div>

        <div class="modal-input-section">
          <label>기존 비밀번호</label>
          <input v-model="passwordInfo.currentPassword" type="password" class="modal-input" />
        </div>
        <div class="modal-input-section">
          <label>새 비밀번호</label>
          <input v-model="passwordInfo.newPassword" type="password" class="modal-input" />
        </div>
        <div class="modal-input-section">
          <label>새 비밀번호 확인</label>
          <input v-model="passwordInfo.confirmPassword" type="password" class="modal-input" />
        </div>

        <div class="modal-button-container">
          <Button theme="gray" size="sm" @click="mode = 'view'">취소</Button>
          <Button size="sm" @click="handlePasswordSubmit">변경하기</Button>
        </div>
      </template>

      <!-- 탈퇴 모드 -->
      <template v-else-if="mode === 'withdraw'">
        <div class="modal-header">
          <h3>서비스 탈퇴</h3>
        </div>
        <div class="modal-input-section secession">
          <label>비밀번호 확인</label>
          <input v-model="withdrawInfo.password" type="password" class="modal-input" />
        </div>
        <div class="modal-input-section secession">
          <label>탈퇴 사유</label>
          <textarea v-model="withdrawInfo.reason" type="text" class="modal-textarea"></textarea>
        </div>
        <div class="modal-button-container">
          <Button theme="gray" size="sm" @click="mode = 'view'">취소</Button>
          <Button size="sm" @click="handleWithdrawSubmit">탈퇴하기</Button>
        </div>
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
</style>
