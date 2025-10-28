<script setup>
import { ref, watch, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import PageNation from '@/components/PageNation.vue'
import adminApi from '@/services/admin/admin_api'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'

const isEditModalOpen = ref(false)
const isAddModalOpen = ref(false)

/** 매니저 목록 */
const managers = ref([])

/** 페이징 정보 */
const currentPage = ref(1) // 1-based로 변경 (프론트 표시용)
const totalPages = ref(0) // 백엔드 totalPages (사용 안 함)
const pageSize = ref(10)
const totalElements = ref(0) // 전체 아이템 수

/** 로딩 상태 */
const loading = ref(false)

/** 선택된 매니저 (수정/삭제용) */
const selectedManager = ref(null)

/** 수정 모드 활성화 여부 */
const isEditMode = ref(false)

/** 수정 폼 데이터 */
const editForm = ref({
  name: '',
  phone: '',
})

/** 매니저 추가 폼 데이터 */
const newManager = ref({
  name: '',
  email: '',
  phone: '',
})

// ========== 매니저 목록 조회 ==========

/**
 * 매니저 목록 조회
 * @param {number} page - 페이지 번호 (1-based)
 */
const fetchManagers = async (page = 1) => {
  loading.value = true
  try {
    // 백엔드는 0-based이므로 -1 처리
    const backendPage = page - 1
    const response = await adminApi.getManagers(backendPage, pageSize.value)

    if (response.isSuccess && response.data) {
      managers.value = response.data.managers || []
      totalElements.value = response.data.totalElements || 0

      // 프론트엔드는 1-based로 관리
      currentPage.value = page
    }
  } catch (error) {
    console.error('❌ 매니저 목록 조회 실패:', error.response?.data)
    alert('매니저 목록을 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// ========== 컴포넌트 마운트 시 실행 ==========

onMounted(() => {
  fetchManagers()
})

// ========== 매니저 추가 ==========

/**
 * 매니저 추가 모달 열기
 */
const openAddModal = () => {
  // 폼 초기화
  newManager.value = {
    name: '',
    email: '',
    phone: '',
  }
  isAddModalOpen.value = true
}

/**
 * 매니저 추가 모달 닫기
 */
const closeAddModal = () => {
  isAddModalOpen.value = false
}

/**
 * 매니저 추가 처리
 */
const handleAddManager = async () => {
  // 필수 항목 검사 (이름, 이메일만)
  if (!newManager.value.name || !newManager.value.email) {
    alert('이름과 이메일은 필수 항목입니다.')
    return
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newManager.value.email)) {
    alert('올바른 이메일 형식을 입력해주세요.')
    return
  }

  // 연락처 형식 검증 (입력된 경우에만)
  if (newManager.value.phone && newManager.value.phone.trim()) {
    // 백엔드 정규식에 맞춤: 01X-XXX(X)-XXXX
    const phoneRegex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/
    if (!phoneRegex.test(newManager.value.phone)) {
      alert('연락처는 010-1234-5678 형식으로 입력해주세요.')
      return
    }
  }

  loading.value = true
  try {
    // 빈 문자열을 null로 변환
    const payload = {
      name: newManager.value.name,
      email: newManager.value.email,
      phone:
        newManager.value.phone && newManager.value.phone.trim() ? newManager.value.phone : null,
    }

    const response = await adminApi.createManager(payload)

    // 백엔드 응답 구조: { isSuccess, code, message, data }
    // 백엔드 응답 구조: { isSuccess, code, message, data }
    if (response.isSuccess) {
      alert('매니저가 성공적으로 추가되었습니다. 이메일을 확인해주세요.')
      closeAddModal()

      // 목록을 첫 페이지로 갱신 (1-based)
      currentPage.value = 1
    } else {
      alert(response.message || '매니저 추가에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 매니저 생성 실패:', error.response?.data)
    const errorMessage = error.response?.data?.message || '매니저 추가에 실패했습니다.'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

// ========== 매니저 수정/삭제 ==========

/**
 * 매니저 상세 모달 열기
 */
const openEditModal = (manager) => {
  selectedManager.value = { ...manager }

  // 수정 폼 초기화
  editForm.value = {
    name: manager.name,
    phone: manager.phone || '',
  }

  // 수정 모드 비활성화
  isEditMode.value = false

  isEditModalOpen.value = true
}

/**
 * 매니저 삭제 처리
 */
const handleDeleteManager = async () => {
  if (!selectedManager.value) return

  // 삭제 확인
  if (!confirm(`${selectedManager.value.name} 매니저를 삭제하시겠습니까?`)) {
    return
  }

  loading.value = true
  try {
    const response = await adminApi.deleteManager(selectedManager.value.managerId)

    // 백엔드 응답 구조: { isSuccess, code, message, data }
    if (response.isSuccess) {
      alert('매니저가 삭제되었습니다.')
      isEditModalOpen.value = false
      selectedManager.value = null

      // ✅ 수정: fetchManagers() 직접 호출
      if (managers.value.length === 1 && currentPage.value > 1) {
        // 현재 페이지에 1개만 있고, 첫 페이지가 아니면 이전 페이지로
        currentPage.value = currentPage.value - 1
        await fetchManagers(currentPage.value)
      } else {
        // 그 외의 경우 현재 페이지 새로고침
        await fetchManagers(currentPage.value)
      }
    } else {
      alert(response.message || '매니저 삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 매니저 삭제 실패:', error.response?.data)
    const errorMessage = error.response?.data?.message || '매니저 삭제에 실패했습니다.'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

/**
 * 수정 모드 활성화
 */
const enableEditMode = () => {
  isEditMode.value = true
}

/**
 * 수정 취소
 */
const cancelEdit = () => {
  // 원래 데이터로 복원
  editForm.value = {
    name: selectedManager.value.name,
    phone: selectedManager.value.phone || '',
  }
  isEditMode.value = false
}

/**
 * 매니저 정보 수정 처리
 */
const handleUpdateManager = async () => {
  if (!selectedManager.value) return

  // 필수 항목 검사
  if (!editForm.value.name) {
    alert('이름은 필수 항목입니다.')
    return
  }

  // 연락처 형식 검증 (입력된 경우에만)
  if (editForm.value.phone && editForm.value.phone.trim()) {
    const phoneRegex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/
    if (!phoneRegex.test(editForm.value.phone)) {
      alert('연락처는 010-1234-5678 형식으로 입력해주세요.')
      return
    }
  }

  loading.value = true
  try {
    const payload = {
      name: editForm.value.name,
      phone: editForm.value.phone && editForm.value.phone.trim() ? editForm.value.phone : null,
    }

    const response = await adminApi.updateManager(selectedManager.value.managerId, payload)

    if (response.isSuccess) {
      alert('매니저 정보가 수정되었습니다.')
      selectedManager.value.name = editForm.value.name
      selectedManager.value.phone = editForm.value.phone || null
      isEditMode.value = false

      // 목록 갱신 (watch가 자동 호출하므로 값만 재할당)
      currentPage.value = currentPage.value
    } else {
      alert(response.message || '매니저 수정에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ 매니저 수정 실패:', error.response?.data)
    const errorMessage = error.response?.data?.message || '매니저 수정에 실패했습니다.'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}

// ========== 유틸리티 함수 ==========

/**
 * 계정 상태 텍스트 변환
 */
const getStatusText = (status) => {
  const statusMap = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    SUSPENDED: '정지',
    DELETED: '삭제됨',
  }
  return statusMap[status] || status
}

/**
 * 날짜 포맷 변환
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ========== 컴포넌트 마운트 시 실행 ==========

/**
 * 페이지 변경 감지
 */
watch(currentPage, (newPage) => {
  fetchManagers(newPage)
})

onMounted(() => {
  fetchManagers()
})
</script>

<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <span>관리자 관리</span>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <p>로딩 중...</p>
    </div>

    <!-- 매니저 목록 -->
    <div v-else class="manage-list-container">
      <!-- 매니저 추가 버튼 -->
      <div class="manage-add-button-container card" @click="openAddModal">
        <img src="/assets/icons/ic-plus-circle.png" alt="매니저 추가" />
      </div>

      <!-- 매니저 정보 카드 -->
      <div
        v-for="manager in managers"
        :key="manager.managerId"
        class="manager-info-card card"
        @click="openEditModal(manager)"
      >
        <div class="card-top">
          <span>{{ manager.name }}</span>
        </div>

        <div class="manager-info-row">
          <img src="/assets/icons/ic-email.png" alt="이메일" />
          <span>{{ manager.email }}</span>
        </div>
        <div class="manager-info-row">
          <img src="/assets/icons/ic-phone.png" alt="연락처" />
          <span>{{ manager.phone || '미등록' }}</span>
        </div>
      </div>

      <!-- 매니저 없을 때 -->
      <div v-if="managers.length === 0" class="empty-state">
        <p>등록된 매니저가 없습니다.</p>
      </div>
    </div>

    <!-- 페이징 -->
    <PageNation
      v-if="totalElements > 0"
      v-model="currentPage"
      :total-items="totalElements"
      :items-per-page="pageSize"
      :max-visible-pages="5"
    />

    <!-- 매니저 상세 모달 (조회/수정) -->
    <Modal :open="isEditModalOpen" @close="isEditModalOpen = false">
      <div class="edit-modal-container" v-if="selectedManager">
        <div class="manager-profile-image">
          <img src="/assets/icons/ic-manager-profile.png" alt="관리자 프로필 이미지" />
        </div>

        <!-- 조회 모드 -->
        <template v-if="!isEditMode">
          <div class="manager-name">
            <span class="name-text">{{ selectedManager.name }}</span>
            <span class="role-badge">관리자</span>
          </div>
          <div class="manager-info-modal">
            <span>이메일</span>
            <p>{{ selectedManager.email }}</p>
          </div>
          <div class="manager-info-modal">
            <span>연락처</span>
            <p>{{ selectedManager.phone || '미등록' }}</p>
          </div>
          <div class="manager-info-modal">
            <span>계정 상태</span>
            <p>{{ getStatusText(selectedManager.status) }}</p>
          </div>
          <div class="manager-info-modal">
            <span>가입일</span>
            <p>{{ formatDate(selectedManager.createdAt) }}</p>
          </div>

          <div class="edit-modal-button-container">
            <Button class="button-px" theme="gray" @click="handleDeleteManager">계정삭제</Button>
            <Button class="button-px" theme="light" @click="enableEditMode">수정하기</Button>
            <Button class="button-px" @click="isEditModalOpen = false">닫기</Button>
          </div>
        </template>

        <!-- 수정 모드 -->
        <template v-else>
          <div class="manager-name-edit">
            <span class="name-text">정보 수정</span>
          </div>

          <div class="input-field-container-edit">
            <div class="input-field-item">
              <label>이름 <span>*</span></label>
              <input v-model="editForm.name" type="text" placeholder="이름을 입력해주세요." />
            </div>
            <div class="input-field-item">
              <label>이메일</label>
              <input :value="selectedManager.email" type="email" disabled class="disabled-input" />
            </div>
            <div class="input-field-item">
              <label>연락처</label>
              <input
                v-model="editForm.phone"
                type="text"
                placeholder="010-1234-5678"
                maxlength="13"
              />
            </div>
          </div>

          <div class="edit-modal-button-container">
            <Button class="button-px" theme="gray" @click="cancelEdit">취소</Button>
            <Button class="button-px" @click="handleUpdateManager" :disabled="loading">
              {{ loading ? '처리중...' : '수정완료' }}
            </Button>
          </div>
        </template>
      </div>
    </Modal>

    <!-- 매니저 추가 모달 -->
    <Modal :open="isAddModalOpen" @close="closeAddModal" class="manager-add-modal">
      <div class="add-modal-container">
        <h3>관리자 추가</h3>
        <p>
          기업의 관리자를 추가할 수 있습니다. 입력하신 이메일로 가입에 필요한 계정 정보(이메일 및
          비밀번호)가 발송됩니다. 정확한 안내를 위해 이메일 주소를 신중하게 입력해주세요.
        </p>

        <div class="input-field-container">
          <div class="input-field-item">
            <label>이름 <span>*</span></label>
            <input
              v-model="newManager.name"
              type="text"
              placeholder="관리자의 이름을 입력해주세요."
            />
          </div>
          <div class="input-field-item">
            <label>이메일 <span>*</span></label>
            <input
              v-model="newManager.email"
              type="email"
              placeholder="관리자의 이메일을 입력해주세요."
            />
          </div>
          <div class="input-field-item">
            <label>연락처</label>
            <input
              v-model="newManager.phone"
              type="text"
              placeholder="010-1234-5678 (선택사항)"
              maxlength="13"
            />
          </div>
        </div>

        <div class="add-modal-button-container">
          <Button class="button-px" theme="gray" @click="closeAddModal">취소</Button>
          <Button class="button-px" @click="handleAddManager" :disabled="loading">
            {{ loading ? '처리중...' : '추가하기' }}
          </Button>
        </div>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
.manage-list-container {
  @apply flex flex-wrap gap-3 mt-[15px] ml-[4px] pb-[30px];
}

.card {
  @apply rounded-[5px] w-[230px] h-[140px] cursor-pointer;
}

.manage-add-button-container {
  @apply bg-[#F5F5F5] flex justify-center items-center;
}

.manage-add-button-container img {
  @apply w-[45px];
}

.manager-info-card {
  @apply bg-[#F8F8F8] px-[22px] pt-[23px] pb-[21px];
}

.card-top {
  @apply flex justify-between items-center font-medium mb-[22px];
}

.card-top img {
  @apply w-[16px] h-[16px] cursor-pointer;
}

.manager-info-row {
  @apply flex items-center gap-3 mb-[8px];
}

.manager-info-row span {
  @apply text-[14px] max-w-[156px] truncate;
}

.manager-info-row img {
  @apply w-[16px] h-[16px];
}

/* 관리자 카드 클릭 시 뜨는 모달 스타일 */
.edit-modal-container {
  @apply flex flex-col px-[20px] py-[10px];
}

.manager-profile-image img {
  @apply w-[100px];
}

.manager-name {
  @apply flex items-center gap-2 mt-[18px] mb-[20px] px-[8px];
}

.manager-name input {
  @apply w-[60px] text-[18px] font-medium;
}

.manager-info-modal {
  @apply flex gap-3 mb-[15px] px-[8px] text-[14px];
}

.manager-info-modal P {
  @apply text-gray-dark;
}

.edit-modal-button-container {
  @apply mt-[40px] flex gap-3;
}

.edit-modal-button-container button,
.add-modal-button-container button {
  @apply rounded-[5px] text-center py-[8px] flex-1 text-[14px] font-medium;
}

.delete-button {
  @apply bg-gray-deep text-text hover:bg-[#c8c8c8];
}

.edit-modal-container input {
  @apply border-b border-gray-deep;
}

/* 관리자 추가 모달 스타일 */

.add-modal-container {
  @apply px-[30px] py-[20px] flex flex-col;
}

h3 {
  @apply text-[18px] font-medium mb-[3px];
}

.add-modal-container p {
  @apply text-[12px] text-gray-dark max-w-sm;
}

.input-field-container {
  @apply mt-[35px] flex flex-col gap-6;
}

.input-field-item {
  @apply flex flex-col gap-1;
}

label {
  @apply text-[14px];
}

.input-field-item span {
  @apply text-[#FF2222];
}

.add-modal-container input {
  @apply bg-gray-line px-[14px] py-[10px] text-[14px] rounded-[3px];
}

.add-modal-button-container {
  @apply flex gap-3 mt-[70px];
}

.add-modal-button-container button {
  @apply py-[10px];
}

.button-px {
  @apply px-0;
}

.loading-container {
  @apply flex justify-center items-center py-[100px] text-gray-dark;
}

.empty-state {
  @apply col-span-full flex justify-center items-center text-gray-dark w-full h-[200px];
}

.name-text {
  @apply text-[18px] font-medium;
}

.role-badge {
  @apply text-[14px] text-gray-dark;
}

.edit-modal-container .manager-info-modal p {
  @apply flex-1;
}

.manager-name-edit {
  @apply flex items-center gap-2 mt-[18px] mb-[25px] px-[8px];
}

.input-field-container-edit {
  @apply flex flex-col gap-5;
}

.disabled-input {
  @apply bg-gray-200 cursor-not-allowed text-gray-dark;
}

.edit-modal-button-container button:nth-child(2) {
  @apply flex-1;
}

.edit-modal-button-container button:nth-child(3) {
  @apply flex-1;
}
</style>
