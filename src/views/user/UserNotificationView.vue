<script setup>
import NotificationTable from '@/components/NotificationTable.vue' // 공통 컴포넌트 import
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
  <UserHeader />
  <div class="page-background">
    <div class="content-card">
      <NotificationTable :notifications="notifications">
        <template #title class="notify-container">
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

.content-card {
  @apply min-h-[570px]
}
</style>