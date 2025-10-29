<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import serviceApi from '@/services/service/service_api'
import reservationApi from '@/services/reservation/reservation_api'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rows = ref(10)
const cols = ref(12)
const serviceGroupId = route.params.serviceGroupId

// 서비스 목록
const services = reactive([])
// 서비스별 예약 목록 저장
const serviceReservationsMap = reactive({})
// 선택된 서비스
const selectedService = ref(null)
// 좌석판 저장
const seatsMap = reactive({})
// 선택/호버 좌석
const selectedSeat = ref(null)
const hoverSeat = ref(null)
// 모달 상태
const isModalOpen = ref(false)
// 예약 리스트 참조
const seatRefs = reactive({})

// 서비스 불러오기
const getServices = async () => {
  const response = await serviceApi.getServices(serviceGroupId)
  services.splice(0, services.length, ...response)
  if (services.length) selectedService.value = services[0]
}

// 서비스별 예약 불러오기
const getReservations = async (serviceId) => {
  // 이미 예약이 있으면 업데이트만
  if (!serviceReservationsMap[serviceId]) {
    const response = await reservationApi.getServiceReservations(serviceId)
    serviceReservationsMap[serviceId] = response.map((r) => ({
      id: r.id,
      name: r.userName,
      date: r.startDate,
      time: new Date(r.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      row: r.row || 0,
      col: r.col || 0,
    }))
  }
  // 좌석판 갱신
  seatsMap[serviceId] = generateSeats(serviceId)
}

// 좌석 데이터 생성
const generateSeats = (serviceId) =>
  Array.from({ length: rows.value }, (_, r) =>
    Array.from({ length: cols.value }, (_, c) => {
      const reservedSeat = serviceReservationsMap[serviceId]?.find(
        (res) => res.row === r + 1 && res.col === c + 1,
      )
      return {
        id: serviceId * 10000 + r * cols.value + c,
        row: r + 1,
        col: c + 1,
        reserved: !!reservedSeat,
        reservationInfo: reservedSeat || null,
      }
    }),
  )

// 좌석판 계산
const seats = computed(() => seatsMap[selectedService.value?.id] || [])

// 좌석 클릭
const openSeatDetail = (seat) => {
  if (!seat.reservationInfo) return
  selectedSeat.value = seat
  isModalOpen.value = true
}

// 예약 취소
const cancelReservation = () => {
  isModalOpen.value = false
}

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false
}

// 좌석판 호버
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
  if (seat.reservationInfo && seatRefs[seat.id]) {
    seatRefs[seat.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 예약 리스트 호버
const onSeatHoverList = (seat) => {
  hoverSeat.value = seat
}

// 선택 서비스 변경 시 예약과 좌석판 갱신
watch(selectedService, async (newService) => {
  if (!newService) return

  rows.value = newService.row || 10
  cols.value = newService.col || 12

  await getReservations(newService.id)
  seatsMap[newService.id] = generateSeats(newService.id)
})

// 초기 마운트
onMounted(async () => {
  await getServices()
  if (selectedService.value) {
    rows.value = selectedService.value.row || 10
    cols.value = selectedService.value.col || 12
    await getReservations(selectedService.value.id)
  }
})
</script>

<template>
  <AdminLayout>
    <div class="container">
      <!-- 좌석판 + 예약 리스트 -->
      <div class="components-white-container flex-1 flex flex-col gap-4">
        <!-- 좌석판 -->
        <div class="seat-board">
          <h2 class="title">좌석</h2>
          <!-- 좌석 범례 -->
          <div class="legend">
            <div class="legend-seat empty"></div>
            <span class="legend-text">예약 가능한 좌석</span>
            <div class="legend-seat reserved"></div>
            <span class="legend-text">예약 완료</span>
          </div>
          <div class="seat-grid">
            <div v-for="row in seats" :key="row[0].row" class="seat-row">
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="[
                  'seat',
                  seat.reserved ? 'reserved' : 'empty',
                  hoverSeat?.id === seat.id ? 'hovered' : '',
                ]"
                @mouseenter="onSeatHoverBoard(seat)"
                @mouseleave="hoverSeat = null"
                @click="openSeatDetail(seat)"
              ></div>
            </div>
          </div>

          <!-- 툴팁 -->
          <div
            v-if="hoverSeat"
            class="seat-tooltip"
            :style="{
              top: `calc(${(hoverSeat.row - 1) * 1.5}rem - 8px)`,
              left: `${(hoverSeat.col - 1) * 1.5}rem`,
            }"
          >
            <p>좌석: {{ hoverSeat.row }}-{{ hoverSeat.col }}</p>
            <p v-if="hoverSeat.reservationInfo">예약 번호: {{ hoverSeat.reservationInfo.id }}</p>
            <p v-else class="no-reservation">예약 없음</p>
          </div>
        </div>

        <!-- 예약 리스트 -->
        <div class="reservation-list">
          <h2 class="title">예약 리스트</h2>
          <div class="components-super-table-container max-h-64 overflow-y-auto">
            <table class="components-super-table">
              <thead>
                <tr>
                  <th>예약 번호</th>
                  <th>예약자</th>
                  <th>좌석</th>
                  <th>예약 일자</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="seat in seats.flat().filter((s) => s?.reservationInfo)"
                  :key="seat.id"
                  :ref="(el) => (seatRefs[seat.id] = el)"
                  @mouseenter="onSeatHoverList(seat)"
                  @mouseleave="hoverSeat = null"
                  @click="openSeatDetail(seat)"
                  :class="hoverSeat?.id === seat.id ? 'row-hover' : ''"
                >
                  <td>{{ seat.reservationInfo.id }}</td>
                  <td>{{ seat.reservationInfo.name }}</td>
                  <td>좌석 {{ seat.row }}-{{ seat.col }}</td>
                  <td>{{ seat.reservationInfo.date }} {{ seat.reservationInfo.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 공연/서비스 선택 카드 -->
      <div class="service-cards">
        <div
          v-for="service in services"
          :key="service.id"
          @click="selectedService = service"
          :class="['service-card', selectedService?.id === service.id ? 'selected' : '']"
        >
          <h3 class="service-title">{{ service.name }}</h3>
          <p v-if="service.startDate" class="service-date">
            {{ service.startDate }} - {{ service.endDate }}
          </p>
          <p class="service-time">{{ service.time }}</p>
          <p class="service-seat-info">
            <span class="material-icons seat-icon">event_seat</span>
            {{ serviceReservationsMap[service.id]?.length || 0 }} / {{ service.capacity }}
          </p>
        </div>
      </div>
    </div>

    <!-- 예약 상세 모달 -->
    <Modal :open="isModalOpen" @click.self="closeModal">
      <h2 class="modal-title">예약 상세 정보</h2>
      <div v-if="selectedSeat?.reservationInfo" class="modal-content">
        <p><strong>예약 번호:</strong> {{ selectedSeat.reservationInfo.id }}</p>
        <p><strong>예약자:</strong> {{ selectedSeat.reservationInfo.name }}</p>
        <p><strong>좌석:</strong> {{ selectedSeat.row }} - {{ selectedSeat.col }}</p>
        <p><strong>공연:</strong> {{ selectedService.name }}</p>
        <p><strong>일시:</strong> {{ selectedService.date }} {{ selectedService.time }}</p>
      </div>
      <div class="modal-footer">
        <Button :theme="'gray'" @click="cancelReservation">예약 취소</Button>
        <Button @click="closeModal"> 닫기 </Button>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
.container {
  @apply flex gap-6;
}

.seat-board {
  @apply relative p-4 overflow-visible;
}

.title {
  @apply font-semibold mb-2;
}

.legend {
  @apply flex gap-4 mb-2 items-center;
}

.legend-seat {
  @apply w-4 h-4 rounded-sm border;
}

.legend-seat.empty {
  @apply bg-primary;
}

.legend-seat.reserved {
  @apply bg-gray-200;
}

.legend-text {
  @apply text-sm text-gray-700;
}

.seat-grid {
  @apply inline-block;
  width: calc(12 * 1.5rem + 11px);
}

.seat-row {
  @apply flex gap-1 mb-1;
}

.seat {
  @apply w-6 h-6 rounded-sm cursor-pointer border relative transition;
}

.seat.empty {
  @apply bg-primary;
}

.seat.reserved {
  @apply bg-gray-200;
}

.seat.hovered {
  @apply ring-2 ring-yellow-400;
}

.seat-tooltip {
  @apply absolute p-2 bg-gray-50 border rounded text-sm text-gray-700 shadow z-10 whitespace-nowrap pointer-events-none;
}

.no-reservation {
  @apply text-gray-400;
}

.reservation-list {
  @apply rounded p-4 text-sm text-gray-700;
}

.row-hover {
  @apply bg-gray-100;
}

.service-cards {
  @apply flex flex-col gap-4 w-64;
}

.service-card {
  @apply border rounded-md bg-white p-4 shadow-sm cursor-pointer transition-all mb-0 hover:shadow-md hover:border-blue-400;
}

.service-card.selected {
  @apply border-blue-500 bg-blue-50 shadow-md;
}

.service-title {
  @apply font-semibold;
}

.service-date,
.service-time {
  @apply text-gray-500 text-sm;
}

.service-seat-info {
  @apply text-gray-700 text-sm flex items-center gap-1;
}

.seat-icon {
  @apply text-sm;
}

.modal-title {
  @apply text-lg font-semibold mb-4;
}

.modal-content {
  @apply space-y-2;
}

.modal-footer {
  @apply mt-6 gap-3 flex justify-end;
}
</style>
