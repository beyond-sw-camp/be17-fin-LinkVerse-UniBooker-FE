<script setup>
import { ref, watch } from 'vue'
import adminApi from '@/services/admin/admin_api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/UseStore'

const props = defineProps({
  open: Boolean,
  userData: Object,
})
const emit = defineEmits(['close'])

const mode = ref('view') // view | edit | password | withdraw
const router = useRouter()
const authStore = useAuthStore()

// 프로필 정보 수정용 임시 데이터
const editInfo = ref({
  businessNumber: '',
  name: '',
  phone: '',
  logoFile: null,
  logoUrl: '', // 기존 로고 URL
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
watch(
  () => props.userData,
  (newVal) => {
    if (!newVal) return // userData가 아직 없으면 아무 것도 안 함
    editInfo.value = {
      businessNumber: newVal.businessNumber || '',
      name: newVal.name || '',
      phone: newVal.phone || '',
      logoFile: null,
      logoUrl: newVal.logoUrl || '/public/assets/images/admin_logo.png',
    }
  },
  { immediate: true },
)

// 수정 모드 진입
const enterEditMode = () => {
  mode.value = 'edit'
}

// 파일 선택 처리
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    editInfo.value.logoFile = file
    editInfo.value.logoUrl = URL.createObjectURL(file)
  }
}

// 수정 완료 처리
const handleEditSubmit = async () => {
  try {
    const payload = {
      name: editInfo.value.name,
      phone: editInfo.value.phone,
    }

    // 서버에 수정 요청
    const updatedData = await adminApi.managerInfoEdit(payload)
    authStore.updateUser(updatedData)

    // 서버에서 최신 데이터 가져오기
    const response = await adminApi.getMyProfile() // ← getManagerInfo → getMyProfile
    Object.assign(props.userData, response.data) // props.userData 직접 업데이트

    // 모드 전환
    mode.value = 'view'
    alert('수정이 완료되었습니다.')
  } catch (err) {
    alert('수정에 실패했습니다.')
    console.error(err)
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
          <img
            class="modal-logo-image"
            src="/public/assets/images/admin_logo.png"
            alt="기업로고 이미지"
          />
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
        <div class="modal-input-section">
          <label>기업로고</label>
          <input @change="handleFileChange" type="file" class="modal-input-file" />
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

.modal-logo-image {
  @apply h-[50px] border border-gray-deep;
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
</style>
