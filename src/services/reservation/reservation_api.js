import axiosInstance from '@/plugin/axiosInterceptor'

const getServiceReservations = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/reservation/list/${serviceId}`)
    return response.data.data.list
  } catch (error) {
    console.log('예약 목록 조회 실패:', error)
  }
}

const getServiceReservationDetail = async (reservationId) => {
  try {
    const response = await axiosInstance.get(`/api/reservation/detail/${reservationId}`)
    return response.data.data
  } catch (error) {
    console.log('예약 상세 조회 실패:', error)
  }
}

const getDailyReservationCounts = async (groupId, date, slotMinutes = 60) => {
  try {
    const response = await axiosInstance.get('/api/resource-schedules/confirmed-counts/day', {
      params: { groupId, date, slotMinutes },
    })
    return response.data.data
  } catch (error) {
    console.log('일별 예약 개수 조회 실패:', error)
  }
}

const getWeeklyyReservationCounts = async (groupId, startDate, slotMinutes = 60) => {
  try {
    const response = await axiosInstance.get('/api/resource-schedules/confirmed-counts/week', {
      params: { groupId, startDate, slotMinutes },
    })
    return response.data.data
  } catch (error) {
    console.log('예약 상세 조회 실패:', error)
  }
}

const getMonthlyReservationCounts = async (groupId, year, month) => {
  try {
    const response = await axiosInstance.get('/api/resource-schedules/confirmed-counts/month', {
      params: { groupId, year, month },
    })
    return response.data.data
  } catch (error) {
    console.log('예약 상세 조회 실패:', error)
  }
}

export default {
  getServiceReservations,
  getServiceReservationDetail,
  getDailyReservationCounts,
  getWeeklyyReservationCounts,
  getMonthlyReservationCounts,
}
