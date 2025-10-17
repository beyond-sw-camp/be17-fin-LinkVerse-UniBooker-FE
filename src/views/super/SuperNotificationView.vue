<script setup>
import SuperLayout from '@/components/SuperLayout.vue'
import NotificationTable from '@/components/NotificationTable.vue'
import { ref } from 'vue'

/* 알림 데이터 */
const notifications = ref([
  { id: 1, room: '회의실1', title: '예약 마감', message: '회의실1 예약이 마감되었습니다.', time: '2025년 10월 1일 12:30', status: '안읽음' },
  { id: 2, room: '회의실2', title: '예약 마감', message: '회의실2 예약이 마감되었습니다.', time: '2025년 10월 2일 14:30', status: '읽음' },
  { id: 3, room: '회의실3', title: '예약 마감', message: '회의실3 예약이 마감되었습니다.', time: '2025년 10월 3일 10:00', status: '읽음' },
])
</script>

<template>
  <SuperLayout>
    <NotificationTable :notifications="notifications">
      <template #title>
        <h2 class="title">알림 이력</h2>
      </template>
    </NotificationTable>
  </SuperLayout>
</template>

<style scoped>
:deep(.notification-table thead tr) {
  @apply bg-white text-gray-dark text-center border-b-2 border-gray-deep;
}

:deep(.notification-table thead th) {
  @apply py-3 px-3 font-medium text-[13px] align-middle;
}

:deep(.notification-table tbody tr.unread) {
  @apply font-semibold bg-white/40;
}

:deep(.notification-table tbody td) {
  @apply py-4 px-3 text-center text-gray-dark border-b border-gray-deep align-middle text-[13px];
}
</style>