import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // 알림 도착 여부
  const hasNotification = ref(false)

  // 알림 도착 시 true로 설정
  function notify() {
    hasNotification.value = true
  }

  // 드롭다운 열면 false로 초기화
  function reset() {
    hasNotification.value = false
  }

  return { hasNotification, notify, reset }
})
