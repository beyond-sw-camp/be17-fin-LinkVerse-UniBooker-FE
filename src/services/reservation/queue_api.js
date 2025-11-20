import axiosInstance from '@/plugin/axiosInterceptor'

/** 대기열 진입 */
const joinQueue = async (resourceId) => {
  try {
    const response = await axiosInstance.post(`/api/queues/${resourceId}/join`)

    return response.data // token, position 반환
  } catch (error) {
    console.error('[Queue API] joinQueue error:', error)
    throw error
  }
}

/** 대기열 상태 조회 */
const getQueueStatus = async (resourceId, token) => {
  try {
    const response = await axiosInstance.get(`/api/queues/${resourceId}/status`, {
      params: { token },
    })

    return response.data // position, length, etaSeconds 반환
  } catch (error) {
    console.error('[Queue API] getQueueStatus error:', error)
    throw error
  }
}

/** 활성화(consume) */
const consumeQueueToken = async (resourceId, token) => {
  try {
    const response = await axiosInstance.post(`/api/queues/${resourceId}/tokens/${token}/consume`)
    return response.data
  } catch (error) {
    console.error('[Queue API] consumeQueueToken error:', error)
    throw error
  }
}

export default {
  joinQueue,
  getQueueStatus,
  consumeQueueToken,
}
