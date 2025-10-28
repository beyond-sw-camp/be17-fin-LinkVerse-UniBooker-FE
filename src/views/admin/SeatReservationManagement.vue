<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import { ref, reactive, computed } from 'vue'

const rows = 10
const cols = 12

// 예시 공연/서비스
const services = reactive([
  { id: 1, name: '공연 A', date: '2025-10-30', time: '19:00', reserved: 20, total: 40 },
  { id: 2, name: '공연 B', date: '2025-11-05', time: '18:00', reserved: 15, total: 40 },
])
const selectedService = ref(services[0])

const hoverSeat = ref(null)
const selectedSeat = ref(null)
const isModalOpen = ref(false)

const seatsMap = reactive({})

// 좌석 데이터 생성 (더미 포함)
const generateSeats = (serviceId) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const reserved = Math.random() < 0.3
      const service = services.find((s) => s.id === serviceId)
      return {
        id: serviceId * 10000 + r * cols + c,
        row: r + 1,
        col: c + 1,
        reserved,
        reservationInfo: reserved
          ? {
              id: 1000 + r * cols + c,
              name: `유저 ${r * cols + c + 1}`,
              date: service.date,
              time: service.time,
            }
          : null,
      }
    }),
  )

services.forEach((s) => {
  seatsMap[s.id] = generateSeats(s.id)
})

const seats = computed(() => seatsMap[selectedService.value.id])

// 좌석 클릭 시 모달 오픈픈
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

// 예약 리스트 트랙킹용 refs
const seatRefs = reactive({})

// 좌석판에서 호버 -> 스크롤 포함
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
  if (seat.reservationInfo && seatRefs[seat.id]) {
    seatRefs[seat.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 리스트에서 호버 -> 스크롤 X
const onSeatHoverList = (seat) => {
  hoverSeat.value = seat
}
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
            <span class="legend-text">빈 좌석</span>
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
          <p class="service-date">{{ service.date }}</p>
          <p class="service-time">{{ service.time }}</p>
          <p class="service-seat-info">
            <span class="material-icons seat-icon">event_seat</span>
            {{ service.reserved }} / {{ service.total }}
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
