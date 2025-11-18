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

    const socket = new SockJS('https://www.unibooker.kro.kr/ws', null, {
      withCredentials: true, // ✅ 쿠키 자동 전송
    })

    stompClient = Stomp.over(socket)
    // stompClient.debug = null // 콘솔 디버그 끄기 (원하면 주석처리)

    stompClient.connect(
      {},
      (frame) => {
        console.log('✅ WebSocket 연결 성공:', frame)

        // 알림 구독
        stompClient.subscribe('/user/queue/notifications', (message) => {
          // const data = JSON.parse(message.body)
          console.log('🔔 알림 도착:', message)

          // Pinia store 사용
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
