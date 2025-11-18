import axios from '@/plugin/axiosInterceptor'

// 알림 목록 조회
const getNotifyList = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`/api/notify?page=${page}&size=${size}`)
    return response.data.data.content
  } catch (error) {
    console.log('알림 목록 조회 실패:', error)
    return []
  }
}


// 알림 읽음 처리
const notifyRead = async (notificationId) => {
  try {
    const response = await axios.get(`/api/notify/read/${notificationId}`)
    return response.data.data
  } catch (error) {
    console.log('알림 목록 조회 실패:', error)
    return []
  }
}


export default {
  getNotifyList,
  notifyRead,
}