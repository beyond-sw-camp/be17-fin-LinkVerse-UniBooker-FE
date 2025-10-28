<script setup>
import { ref } from 'vue'
import notifyApi from '@/services/notification/notification_api'

const props = defineProps({
  notifications: { type: Array, required: true },
  // 플랫폼 관리자페이지 테이블 스타일 테마로 선택 
  theme: { type: String, default: 'default' }
})

const detailOpen = ref(false)
const selectedNotification = ref(null)

function openDetailModal(item) {
  selectedNotification.value = item
  detailOpen.value = true
}

const markAsReadAndClose = async (notificationId) => {
  try {
    await notifyApi.notifyRead(notificationId)
    detailOpen.value = false
    // 페이지 새로고침
    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <slot name="title" />

    <table
      :class="[
        'notification-table',
        theme === 'super' ? 'components-super-table' : ''
      ]"
    >
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
          :class="{ unread: item.isRead === false }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.message }}</td>
          <td>{{ item.createdAt }}</td>
          <td class="text-center">
            <span v-if="item.isRead === true" class="text-gray-dark/70 text-sm font-medium">읽음</span>
            <span v-else class="text-primary">읽지 않음</span>
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

    <Modal :open="detailOpen" @close="detailOpen = false">
      <div class="edit-modal-container">
        <h2 class="notification-header">알림 상세</h2>
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
          <p>{{ selectedNotification?.createdAt }}</p>
        </div>
        <div class="edit-modal-button-container">
          <Button @click="markAsReadAndClose(selectedNotification?.id)">확인</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.edit-modal-container {
  @apply flex flex-col gap-5 p-2;
}
.notification-detail {
  @apply flex flex-col gap-1;
}
.notification-detail span {
  @apply text-gray-dark/70 text-sm;
}
.notification-detail p {
  @apply text-gray-dark font-medium text-[15px];
}
.edit-modal-button-container {
  @apply flex justify-end mt-2;
}
.notification-table {
  @apply w-full border-collapse text-[13px] mt-6 max-w-5xl mx-auto;
}
.notification-table.components-super-table {
  @apply table-auto text-sm m-0 max-w-none;
}

.notification-header {
  @apply font-medium text-[18px]
}

td {
  @apply !font-normal
}
</style>