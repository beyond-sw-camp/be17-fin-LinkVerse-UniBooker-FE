import axios from '@/plugin/axiosInterceptor'

const getNotifyList = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`api/notify?page=${page}&size=${size}`)
    return response.data.data.content
  } catch (error) {
    console.log('알림 목록 조회 실패:', error)
    return []
  }
}
export default {
  getNotifyList,
}