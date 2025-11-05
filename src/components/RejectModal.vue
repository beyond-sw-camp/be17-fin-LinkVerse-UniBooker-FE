<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * Props 정의
 */
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
})

/**
 * Emits 정의
 */
const emit = defineEmits(['close', 'confirm'])

// ===== 상수 =====

/** 거절 사유 최대 글자 수 */
const MAX_LENGTH = 500

/** 거절 사유 최소 글자 수 */
const MIN_LENGTH = 10

// ===== 반응형 데이터 =====

/** 거절 사유 입력값 */
const reason = ref('')

/** 에러 메시지 */
const errorMessage = ref('')

// ===== Computed =====

/**
 * 남은 글자 수 계산
 */
const remainingChars = computed(() => MAX_LENGTH - reason.value.length)

/**
 * 유효성 검증 결과
 */
const isValid = computed(() => {
  const length = reason.value.trim().length
  return length >= MIN_LENGTH && length <= MAX_LENGTH
})

// ========== 메소드 ==========

/**
 * 거절 사유 유효성 검증
 */
const validateReason = () => {
  const trimmed = reason.value.trim()

  if (!trimmed) {
    errorMessage.value = '거절 사유를 입력해주세요.'
    return false
  }

  if (trimmed.length < MIN_LENGTH) {
    errorMessage.value = `거절 사유는 최소 ${MIN_LENGTH}자 이상 입력해야 합니다.`
    return false
  }

  if (trimmed.length > MAX_LENGTH) {
    errorMessage.value = `거절 사유는 최대 ${MAX_LENGTH}자를 초과할 수 없습니다.`
    return false
  }

  errorMessage.value = ''
  return true
}

/**
 * 확인 버튼 클릭 핸들러
 */
const handleConfirm = () => {
  if (!validateReason()) {
    return
  }

  emit('confirm', reason.value.trim())
}

/**
 * 모달 닫기 핸들러
 */
const handleClose = () => {
  emit('close')
  resetModal()
}

/**
 * 모달 초기화
 */
const resetModal = () => {
  reason.value = ''
  errorMessage.value = ''
}

/**
 * ESC 키 이벤트 핸들러
 */
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show) {
    handleClose()
  }
}

// ========== Watch ==========

/**
 * show props 감시
 */
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      resetModal()
    }
  },
)

// ========== Lifecycle ==========

/**
 * 컴포넌트 마운트 시
 */
onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

/**
 * 컴포넌트 언마운트 시
 */
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <!-- 모달 오버레이 -->
  <div v-if="show" class="modal-overlay" @click="handleClose">
    <!-- 모달 컨텐츠 -->
    <div class="modal-content" @click.stop>
      <!-- 헤더 -->
      <div class="modal-header">
        <h3 class="modal-title">기업 신청 거절</h3>
        <button @click="handleClose" class="close-button">
          <svg
            class="close-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- 본문 -->
      <div class="modal-body">
        <p class="info-text">
          <span class="company-name">{{ companyName }}</span
          >의 신청을 거절하시겠습니까?
        </p>

        <textarea
          v-model="reason"
          class="reason-textarea"
          placeholder="거절 사유를 입력해주세요 (최소 10자 이상)"
          :maxlength="MAX_LENGTH"
          rows="6"
        ></textarea>

        <div class="char-count">
          <span :class="{ 'text-red-500': remainingChars < 0 }">
            {{ reason.length }} / {{ MAX_LENGTH }}자
          </span>
        </div>

        <p class="notice-text">※ 거절 사유는 관리자에게 이메일로 전송됩니다.</p>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <!-- 푸터 -->
      <div class="modal-footer">
        <button @click="handleClose" class="cancel-button">취소</button>
        <button @click="handleConfirm" class="confirm-button">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

/* 모달 컨텐츠 */
.modal-content {
  @apply bg-white rounded-lg shadow-xl w-full max-w-md mx-4;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 헤더 */
.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-line;
}

.modal-title {
  @apply text-lg font-semibold text-gray-800;
}

.close-button {
  @apply p-1 hover:bg-gray-100 rounded transition-colors;
}

.close-icon {
  @apply w-5 h-5;
}

/* 본문 */
.modal-body {
  @apply px-6 py-4 space-y-3;
}

.info-text {
  @apply text-sm text-gray-700;
}

.company-name {
  @apply font-semibold text-primary;
}

.reason-textarea {
  @apply w-full px-4 py-3 rounded border border-gray-line
    focus:border-primary focus:ring-2 focus:ring-primary/20
    placeholder-gray-400 transition-all resize-none;
}

.char-count {
  @apply text-xs text-right text-gray-500;
}

.notice-text {
  @apply text-xs text-gray-400;
}

.error-message {
  @apply text-sm text-red-500 font-medium;
}

/* 푸터 */
.modal-footer {
  @apply flex justify-end gap-3 px-6 py-4 border-t border-gray-line;
}

.cancel-button {
  @apply px-6 py-2 rounded bg-gray-200 text-gray-700 font-medium
    hover:bg-gray-300 transition-colors;
}

.confirm-button {
  @apply px-6 py-2 rounded bg-red-500 text-white font-medium
    hover:bg-red-600 transition-colors;
}

.close-icon {
  @apply w-5 h-5 text-gray-600;
}
</style>
