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
  <div class="notification-dropdown-container relative">
    <div class="notification-tail" />

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
      <p>No new notifications</p>
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
  @apply absolute top-[110%] right-0 mt-2 w-60 bg-white rounded-md shadow-md z-50 border border-gray-100;
  animation: dropdown-appear 0.2s ease-out;
}

.notification-tail {
  @apply absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.notification-dropdown-list {
  @apply max-h-[60vh] overflow-y-auto;
}
.notification-dropdown-list::-webkit-scrollbar {
  width: 8px;
}
.notification-dropdown-list::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}
.notification-dropdown-list::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

.notification-dropdown-item {
  @apply px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors;
}

.notification-message {
  @apply text-xs text-gray-800 truncate font-normal;
}

.notification-time {
  @apply text-[11px] text-gray-400 mt-0.5 block font-normal;
}

.notification-dropdown-empty {
  @apply px-4 py-6 text-center text-gray-500 text-sm;
}

.notification-dropdown-footer {
  @apply border-t border-gray-100;
}

.notification-dropdown-button {
  @apply w-full text-center py-2 text-xs font-medium text-white bg-gray-dark hover:bg-gray-700 transition-colors cursor-pointer;
}
</style>
