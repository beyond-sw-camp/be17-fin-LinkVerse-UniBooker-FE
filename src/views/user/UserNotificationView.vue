<script setup>
import { ref } from 'vue'
import UserHeader from '@/components/UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue'

/* 모달 상태 */
const detailOpen = ref(false)
const selectedNotification = ref(null)

/* 알림 데이터 */
const notifications = [
  { id: 1, room: '회의실1', title: '예약 마감', message: '회의실1 예약이 마감되었습니다.', time: '2025년 10월 1일 12:30', status: '안읽음' },
  { id: 2, room: '회의실2', title: '예약 마감', message: '회의실2 예약이 마감되었습니다.', time: '2025년 10월 2일 14:30', status: '읽음' },
  { id: 3, room: '회의실3', title: '예약 마감', message: '회의실3 예약이 마감되었습니다.', time: '2025년 10월 3일 10:00', status: '읽음' },
]

/* 모달 열기 */
function openDetailModal(item) {
  selectedNotification.value = item
  detailOpen.value = true
}
</script>

<template>
  <UserHeader />
  <div class="page-background">
    <div class="content-card">
      <h2 class="section-title mb-6">알림 이력</h2>

      <table class="notification-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>발생 시각</th>
            <th>확인 여부</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in notifications"
            :key="item.id"
            :class="{ unread: item.status === '안읽음' }"
          >
            <td>{{ index + 1 }}</td>
            <td>[{{ item.room }}] {{ item.title }}</td>
            <td>{{ item.message }}</td>
            <td>{{ item.time }}</td>
            <td class="text-center">
              <span v-if="item.status === '읽음'" class="text-gray-dark/70 text-sm font-medium">읽음</span>
              <span v-else class="text-primary/70">읽지 않음</span>
            </td>

            <td class="text-center">
              <img
                src="/assets/icons/ic-open-modal.png"
                alt="상세보기"
                class="w-4 h-4 mx-auto opacity-50 cursor-pointer transition-transform hover:scale-110 hover:opacity-100"
                @click="openDetailModal(item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 알림 상세 모달 -->
    <Modal :open="detailOpen" @close="detailOpen = false">
      <div class="edit-modal-container">
        <div class="notification-detail">
          <span>제목</span>
          <p>{{ selectedNotification?.title }}</p>
        </div>
        <div class="notification-detail">
          <span>내용</span>
          <p>{{ selectedNotification?.message }}</p>
        </div>
        <div class="notification-detail">
          <span>발생 시각</span>
          <p>{{ selectedNotification?.time }}</p>
        </div>
        <div class="edit-modal-button-container">
          <Button @click="detailOpen = false">확인</Button>
        </div>
      </div>
    </Modal>
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

/* 테이블 스타일 */
.notification-table {
  @apply w-full border-collapse text-[13px] mt-6 max-w-5xl mx-auto;
}
.notification-table thead tr {
  @apply bg-white text-gray-dark text-center border-b-2 border-gray-line;
}
.notification-table thead th {
  @apply py-3 px-4 font-medium text-[13px] align-middle; /* ✅ 컬럼명 아래 여백 확보 */
}
.notification-table tbody tr {
  @apply bg-white hover:bg-gray-line/40 transition;
}
.notification-table tbody tr.unread {
  @apply font-semibold bg-primary-bright/5;
}
.notification-table tbody td {
  @apply py-5 px-4 text-center text-gray-dark border-b border-gray-line align-middle;
}

/* 모달 */
.edit-modal-container {
  @apply flex flex-col gap-5 p-6;
}
.notification-detail {
  @apply flex flex-col gap-1;
}
.notification-detail span {
  @apply text-gray-dark/70 text-sm font-medium;
}
.notification-detail p {
  @apply text-gray-dark text-base;
}
.edit-modal-button-container {
  @apply flex justify-end mt-6;
}
</style>
