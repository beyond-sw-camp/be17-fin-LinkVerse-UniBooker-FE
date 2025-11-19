// websocket.js
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

import { useNotificationStore } from '@/stores/notificationStore'

let stompClient = null

// ✅ WebSocket 연결 (쿠키 자동 포함)
export function connectWebSocket() {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      console.log('⚠️ 이미 WebSocket이 연결되어 있습니다.')
      return resolve()
    }

    console.log('🛰️ WebSocket 연결 시도 중...')

    // ✅ 환경변수에서 WebSocket URL 가져오기
    const wsUrl = import.meta.env.VITE_WS_URL || '/ws'

    console.log('🔗 WebSocket URL:', wsUrl)

    const socket = new SockJS(wsUrl, null, {
      withCredentials: true,
    })

    stompClient = Stomp.over(socket)

    stompClient.connect(
      {},
      (frame) => {
        console.log('✅ WebSocket 연결 성공:', frame)

        stompClient.subscribe('/user/queue/notifications', (message) => {
          console.log('🔔 알림 도착:', message)

          const store = useNotificationStore() 
          store.notify()
        })

        resolve()
      },
      (error) => {
        console.error('❌ WebSocket 연결 실패:', error)
        reject(error)
      },
    )
  })
}

// ✅ 연결 해제
export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('🔌 WebSocket 연결 해제됨')
      stompClient = null
    })
  } else {
    console.log('⚠️ 연결된 WebSocket이 없습니다.')
  }
}

// ✅ 브라우저 닫힐 때 자동 종료
window.addEventListener('beforeunload', () => {
  disconnectWebSocket()
})