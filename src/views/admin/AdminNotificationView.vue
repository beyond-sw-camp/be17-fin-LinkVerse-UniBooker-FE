<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
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
  <AdminLayout>
    <div class="content-card">
        <NotificationTable :notifications="notifications">
          <template #title>
            <div class="components-page-title">
              <span>알림 이력</span>
            </div>
          </template>
        </NotificationTable>
    </div>
  </AdminLayout>
</template>

<style scoped>
.content-card {
  @apply max-w-6xl mx-auto bg-white rounded-xl shadow p-7 mt-7;
}

:deep(.notification-table thead tr) {
  @apply bg-white text-gray-dark text-center border-b-2 border-gray-deep;
}
:deep(.notification-table thead th) {
  @apply py-3 px-3 font-medium text-[13px] align-middle;
}
:deep(.notification-table thead th:first-child) {
  @apply rounded-tl-lg;
}
:deep(.notification-table thead th:last-child) {
  @apply rounded-tr-lg;
}
:deep(.notification-table tbody tr.unread) {
  @apply font-semibold bg-primary-bright/5;
}
:deep(.notification-table tbody td) {
  @apply py-4 px-3 text-center text-gray-dark border-b border-gray-deep align-middle text-[13px];
}
:deep(.notification-table tbody tr:last-child td) {
  @apply border-b-0;
}
:deep(.notification-table tbody td img) {
  @apply w-3.5 h-3.5 opacity-60 cursor-pointer transition-transform hover:scale-110 hover:opacity-100;
}
</style>