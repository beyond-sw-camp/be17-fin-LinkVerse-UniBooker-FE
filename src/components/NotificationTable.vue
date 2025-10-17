<script setup>
import { ref } from 'vue'

defineProps({
  notifications: {
    type: Array,
    required: true,
  },
})

const detailOpen = ref(false)
const selectedNotification = ref(null)

function openDetailModal(item) {
  selectedNotification.value = item
  detailOpen.value = true
}
</script>

<template>
  <div>
    <slot name="title" />

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
</template>

<style scoped>
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
.notification-table {
  @apply w-full border-collapse text-[13px] mt-6 max-w-5xl mx-auto;
}
</style>