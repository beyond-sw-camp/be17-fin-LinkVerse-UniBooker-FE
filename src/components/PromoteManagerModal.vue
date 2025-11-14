<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  open: Boolean,
  admin: Object, // 현재 관리자
  managers: Array, // 매니저 목록
  loading: Boolean,
})

const emit = defineEmits(['close', 'promote'])

// ===== 선택된 매니저 =====
const selectedManagerId = ref(null)

/**
 * ACTIVE 상태의 매니저만 필터링
 */
const activeManagers = computed(() => {
  return props.managers.filter((m) => m.status === 'ACTIVE')
})

/**
 * 선택 가능한 매니저가 있는지 확인
 */
const hasActiveManagers = computed(() => {
  return activeManagers.value.length > 0
})

/**
 * 선택된 매니저 정보
 */
const selectedManager = computed(() => {
  return activeManagers.value.find((m) => m.userId === selectedManagerId.value)
})

/**
 * 권한 이양 확인
 */
const handlePromote = () => {
  if (!selectedManagerId.value) {
    alert('매니저를 선택해주세요.')
    return
  }

  const confirmMessage =
    `권한을 이양하시겠습니까?\n\n` +
    `${props.admin.name}: ADMIN → MANAGER\n` +
    `${selectedManager.value.name}: MANAGER → ADMIN`

  if (!confirm(confirmMessage)) {
    return
  }

  emit('promote', selectedManagerId.value)
}

/**
 * 모달 닫기 시 선택 초기화
 */
const handleClose = () => {
  selectedManagerId.value = null
  emit('close')
}

/**
 * 역할 뱃지 CSS 클래스 반환
 */
const getRoleBadgeClass = (role) => {
  return role === 'ADMIN'
    ? 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium'
    : 'px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium'
}

/**
 * 역할 텍스트 변환
 */
const getRoleText = (role) => {
  return role === 'ADMIN' ? '관리자' : '매니저'
}
</script>

<template>
  <Modal :open="open" @close="handleClose">
    <div class="modal-container">
      <!-- 헤더 -->
      <div class="modal-header">
        <h3>권한 이양</h3>
      </div>

      <!-- 매니저 없을 때 -->
      <div v-if="!hasActiveManagers" class="empty-message">
        <p>활성 상태의 매니저가 없습니다.</p>
        <p class="text-sm text-gray-500 mt-2">
          권한 이양을 하려면 먼저 매니저 계정을 생성해주세요.
        </p>
      </div>

      <!-- 매니저 목록 -->
      <div v-else class="manager-list">
        <!-- 현재 관리자 (선택 불가) -->
        <div class="manager-item disabled">
          <div class="radio-wrapper">
            <input type="radio" disabled class="radio-input" />
          </div>
          <div class="manager-info">
            <div class="manager-name-row">
              <span class="manager-name">{{ admin.name }}</span>
              <span :class="getRoleBadgeClass('ADMIN')">
                {{ getRoleText('ADMIN') }}
              </span>
            </div>
            <span class="manager-email">{{ admin.email }}</span>
          </div>
        </div>

        <!-- 매니저 목록 (선택 가능) -->
        <div
          v-for="manager in activeManagers"
          :key="manager.userId"
          class="manager-item"
          @click="selectedManagerId = manager.userId"
        >
          <div class="radio-wrapper">
            <input
              type="radio"
              :value="manager.userId"
              v-model="selectedManagerId"
              class="radio-input"
            />
          </div>
          <div class="manager-info">
            <div class="manager-name-row">
              <span class="manager-name">{{ manager.name }}</span>
              <span :class="getRoleBadgeClass('MANAGER')">
                {{ getRoleText('MANAGER') }}
              </span>
            </div>
            <span class="manager-email">{{ manager.email }}</span>
          </div>
        </div>
      </div>

      <!-- 버튼 영역 -->
      <div class="modal-button-container">
        <Button theme="gray" size="sm" @click="handleClose" :disabled="loading"> 취소 </Button>
        <Button size="sm" @click="handlePromote" :disabled="!selectedManagerId || loading">
          {{ loading ? '처리 중...' : '확인' }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.modal-container {
  @apply p-6 flex flex-col min-w-[500px] max-h-[600px];
}

.modal-header {
  @apply mb-6;
}

.modal-header h3 {
  @apply text-lg font-semibold text-gray-800;
}

.empty-message {
  @apply text-center py-12 text-gray-500;
}

.manager-list {
  @apply space-y-3 mb-6 max-h-[400px] overflow-y-auto;
}

.manager-item {
  @apply flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer
    hover:border-primary hover:bg-gray-50 transition-all;
}

.manager-item.disabled {
  @apply cursor-not-allowed bg-gray-50 hover:border-gray-200 hover:bg-gray-50;
}

.radio-wrapper {
  @apply flex-shrink-0;
}

.radio-input {
  @apply w-4 h-4 cursor-pointer;
}

.manager-item.disabled .radio-input {
  @apply cursor-not-allowed;
}

.manager-info {
  @apply flex-1 min-w-0;
}

.manager-name-row {
  @apply flex items-center gap-2 mb-1;
}

.manager-name {
  @apply font-medium text-gray-800;
}

.manager-email {
  @apply text-sm text-gray-500;
}

.modal-button-container {
  @apply flex gap-2 mt-4;
}

.modal-button-container button {
  @apply flex-1;
}
</style>
