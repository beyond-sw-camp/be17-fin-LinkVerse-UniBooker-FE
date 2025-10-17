<script setup>
import NotificationTable from '@/components/NotificationTable.vue' // 공통 컴포넌트 import
import { ref } from 'vue'

/* 알림 데이터 */
const notifications = ref([
  { id: 1, room: '회의실1', title: '예약 마감', message: '회의실1 예약이 마감되었습니다.', time: '2025년 10월 1일 12:30', status: '안읽음' },
  { id: 2, room: '회의실2', title: '예약 마감', message: '회의실2 예약이 마감되었습니다.', time: '2025년 10월 2일 14:30', status: '읽음' },
  { id: 3, room: '회의실3', title: '예약 마감', message: '회의실3 예약이 마감되었습니다.', time: '2025년 10월 3일 10:00', status: '읽음' },
])
</script>

<template>
  <UserHeader />
  <div class="page-background">
    <div class="content-card">
      <NotificationTable :notifications="notifications">
        <template #title>
          <h2 class="section-title mb-6">알림 이력</h2>
        </template>
      </NotificationTable>
    </div>
  </div>
  <UserFooter />
</template>

<style scoped>
/* 기본 레이아웃 */
.page-background {
  @apply min-h-screen bg-white py-10 px-4 font-mont-noto;
}
.content-card {
  @apply max-w-6xl mx-auto bg-white rounded-xl shadow p-7;
}
.section-title {
  @apply text-xl font-semibold text-text;
}

/* 이 페이지 고유의 테이블 스타일 */
:deep(.notification-table thead tr) {
  @apply bg-white text-gray-dark text-center border-b-2 border-gray-line;
}
:deep(.notification-table thead th) {
  @apply py-3 px-4 font-medium text-[13px] align-middle;
}
:deep(.notification-table tbody tr) {
  @apply bg-white hover:bg-gray-line/40 transition;
}
:deep(.notification-table tbody tr.unread) {
  @apply font-semibold bg-primary-bright/5;
}
:deep(.notification-table tbody td) {
  @apply py-5 px-4 text-center text-gray-dark border-b border-gray-line align-middle;
}
</style>