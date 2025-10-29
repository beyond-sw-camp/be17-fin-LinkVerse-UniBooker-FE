<script setup>
import NotificationTable from '@/components/NotificationTable.vue'
import { ref, onMounted } from 'vue'
import notifyApi from '@/services/notification/notification_api'

/* 알림 데이터 */
const notifications = ref([])

onMounted(async () => {
  try {
    notifications.value = await notifyApi.getNotifyList(0, 10)
  } catch (error) {
    console.error('알림 목록 요청 실패:', error)
  }
})
</script>

<template>
  <span class="components-page-title">알림 이력</span>
  <div class="components-white-container">
    <div class="components-super-table-container">
      <!-- theme="super" prop으로 테이블 테마 전달 -->
      <NotificationTable :notifications="notifications" theme="super" />
    </div>
  </div>
</template>

<style scoped>
/* hover 효과 (읽음/안읽음 모두 동일하게 적용) */
:deep(.notification-table tbody tr:hover td) {
  @apply bg-gray-100;
}

/* 안 읽은 행 강조 (hover와 함께 자연스럽게 반응하도록) */
:deep(.notification-table tbody tr.unread td) {
  @apply font-medium bg-gray-50 transition-colors;
}
:deep(.notification-table tbody tr.unread:hover td) {
  @apply bg-gray-100;
}

.components-super-table-container {
  @apply min-h-[520px] flex items-center justify-center
}
</style>
