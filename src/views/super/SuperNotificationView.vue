<script setup>
import NotificationTable from '@/components/NotificationTable.vue'
import { ref } from 'vue'

/* 알림 데이터 */
const notifications = ref([
  {
    id: 1,
    room: '회의실1',
    title: '예약 마감',
    message: '회의실1 예약이 마감되었습니다.',
    time: '2025년 10월 1일 12:30',
    status: '안읽음',
  },
  {
    id: 2,
    room: '회의실2',
    title: '예약 마감',
    message: '회의실2 예약이 마감되었습니다.',
    time: '2025년 10월 2일 14:30',
    status: '읽음',
  },
  {
    id: 3,
    room: '회의실3',
    title: '예약 마감',
    message: '회의실3 예약이 마감되었습니다.',
    time: '2025년 10월 3일 10:00',
    status: '읽음',
  },
])
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
</style>