<script setup>
const emit = defineEmits(['close'])

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  type: { // super / admin
    type: String,
    required: true,
  },
})

const goToNotificationPage = () => {
  let target = '/notification'

  switch (props.type) {
    case 'super':
      target = '/super/notification'
      break
    case 'admin':
      target = '/admin/notification'
      break
  }

  window.location.href = target
  emit('close')
}
</script>

<template>
  <div class="notification-dropdown-container">
    <div v-if="notifications.length > 0">
      <ul class="notification-dropdown-list">
        <li
          v-for="item in notifications"
          :key="item.id"
          class="notification-dropdown-item"
        >
          <p class="notification-message">{{ item.message }}</p>
          <span class="notification-time">{{ item.time }}</span>
        </li>
      </ul>
    </div>

    <div v-else class="notification-dropdown-empty">
      <p>새로운 알림이 없습니다.</p>
    </div>

    <div class="notification-dropdown-footer">
      <button @click="goToNotificationPage" class="notification-dropdown-button">
        전체 알림 보기
      </button>
    </div>
  </div>
</template>

<style scoped>
.notification-dropdown-container {
  @apply absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-md z-10;
}

.notification-dropdown-list {
  @apply max-h-[60vh] overflow-y-auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded;
  }
  &::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
}

.notification-dropdown-item {
  @apply px-3 py-2.5 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors;
}

.notification-message {
  @apply text-xs text-text truncate font-normal;
}

.notification-time {
  @apply text-xs text-gray-dark/40 mt-0.5 block font-normal;
}

.notification-dropdown-empty {
  @apply px-4 py-6 text-center text-gray-500 text-sm;
}

.notification-dropdown-footer {
  @apply border-t border-gray-100;
}

.notification-dropdown-button {
  @apply w-full text-center py-2 text-xs font-medium text-white bg-gray-dark hover:bg-gray-dark transition-colors cursor-pointer;
}

.super-notify-btn {
  @apply relative flex items-center justify-center w-8 h-8 bg-transparent border-none cursor-pointer;
}

.notify-icon {
  @apply w-5 h-5 object-contain;
}
</style>
