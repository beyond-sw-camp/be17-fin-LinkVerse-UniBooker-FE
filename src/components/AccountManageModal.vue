<script setup>
import { ref, watch } from 'vue'
import adminApi from '@/services/admin/admin_api'

const props = defineProps({
  open: Boolean,
  userData: Object,
})
const emit = defineEmits(['close'])

const mode = ref('view') // view | edit | password

// 수정용 임시 데이터 (수정 모드에서 사용)
const editInfo = ref({
  businessNumber: '',
  name: '',
  phone: '',
  logoFile: null,
  logoUrl: '', // 기존 로고 URL
})

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
      logoUrl: newVal.logo || '/public/assets/images/admin_logo.png',
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
    await adminApi.managerInfoEdit(payload)

    // 서버에서 최신 데이터 가져오기
    const response = await adminApi.getManagerInfo()
    Object.assign(props.userData, response.data) // props.userData 직접 업데이트

    // 모드 전환
    mode.value = 'view'
    alert('수정이 완료되었습니다.')
  } catch (err) {
    alert('수정에 실패했습니다.')
    console.error(err)
  }
}

// 서비스 탈퇴
const handleWithdraw = () => {
  if (confirm('정말 탈퇴하시겠습니까?')) {
    alert('탈퇴 완료되었습니다.')
    emit('close')
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
          <span class="cursor-pointer" @click="enterEditMode">수정</span>
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
          <Button @click="handleWithdraw" theme="gray" size="sm">서비스 탈퇴</Button>
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
          <input type="password" class="modal-input" />
        </div>
        <div class="modal-input-section">
          <label>새 비밀번호</label>
          <input type="password" class="modal-input" />
        </div>
        <div class="modal-input-section">
          <label>새 비밀번호 확인</label>
          <input type="password" class="modal-input" />
        </div>

        <div class="modal-button-container">
          <Button theme="gray" size="sm" @click="mode = 'view'">취소</Button>
          <Button size="sm">변경하기</Button>
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
.modal-input-file {
  @apply bg-gray-line px-[12px] py-[8px] text-[14px] rounded-[3px];
}

.modal-input-file {
  @apply w-[193px] text-[12px] cursor-pointer;
}
</style>
