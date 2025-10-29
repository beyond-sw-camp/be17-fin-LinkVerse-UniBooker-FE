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

export default {
  getServiceReservations,
  getServiceReservationDetail,
}
