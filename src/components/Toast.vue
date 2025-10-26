<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
  duration: {
    type: Number,
    default: 3000, // 3초
  },
})

const emit = defineEmits(['close'])

const visible = ref(false)

// show props 변경 감지
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      visible.value = true

      // duration 후 자동 닫기
      setTimeout(() => {
        visible.value = false
        emit('close')
      }, props.duration)
    } else {
      visible.value = false
    }
  },
)

// 타입별 스타일 클래스
const typeClasses = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info',
}

// 타입별 아이콘
const typeIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['toast', typeClasses[type]]">
      <span class="toast-icon">{{ typeIcons[type] }}</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
/* Toast 기본 스타일 */
.toast {
  @apply fixed top-20 left-1/2 transform -translate-x-1/2;
  @apply flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg;
  @apply text-white font-medium z-50;
  @apply min-w-[300px] max-w-[500px];
}

/* 타입별 배경색 */
.toast-success {
  @apply bg-green-500;
}

.toast-error {
  @apply bg-red-500;
}

.toast-warning {
  @apply bg-yellow-500;
}

.toast-info {
  @apply bg-blue-500;
}

/* 아이콘 */
.toast-icon {
  @apply text-2xl font-bold;
}

/* 메시지 */
.toast-message {
  @apply flex-1 text-sm;
}

/* 페이드 애니메이션 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
