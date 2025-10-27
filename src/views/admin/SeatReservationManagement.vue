=<script setup>
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

// 좌석 데이터 생성
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

// 좌석 클릭 시 모달 오픈
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

// 좌석판에서 호버
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
  if (seat.reservationInfo && seatRefs[seat.id]) {
    seatRefs[seat.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 리스트에서 호버
const onSeatHoverList = (seat) => {
  hoverSeat.value = seat
}
</script>

<template>
  <AdminLayout>
    <div class="RS_container">
      <!-- 좌석판 + 예약 리스트 -->
      <div class="RS_seatWrapper">
        <!-- 좌석판 -->
        <div class="RS_seatBoard">
          <h2 class="RS_title">좌석</h2>

          <!-- 좌석 범례 -->
          <div class="RS_legend">
            <div class="RS_legendSeat RS_empty"></div>
            <span class="RS_legendText">빈 좌석</span>
            <div class="RS_legendSeat RS_reserved"></div>
            <span class="RS_legendText">예약 완료</span>
          </div>

          <div class="RS_seatGrid">
            <div v-for="row in seats" :key="row[0].row" class="RS_seatRow">
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="[
                  'RS_seat',
                  seat.reserved ? 'RS_reserved' : 'RS_empty',
                  hoverSeat?.id === seat.id ? 'RS_hovered' : '',
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
            class="RS_seatTooltip"
            :style="{
              top: `calc(${(hoverSeat.row - 1) * 1.5}rem - 8px)`,
              left: `${(hoverSeat.col - 1) * 1.5}rem`,
            }"
          >
            <p>좌석: {{ hoverSeat.row }}-{{ hoverSeat.col }}</p>
            <p v-if="hoverSeat.reservationInfo">예약 번호: {{ hoverSeat.reservationInfo.id }}</p>
            <p v-else class="RS_noReservation">예약 없음</p>
          </div>
        </div>

        <!-- 예약 리스트 -->
        <div class="RS_reservationList">
          <h2 class="RS_title">예약 리스트</h2>
          <div class="components-super-table-container RS_tableContainer">
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
                  :class="hoverSeat?.id === seat.id ? 'RS_rowHover' : ''"
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

      <!-- 공연/서비스 카드 -->
      <div class="RS_serviceCards">
        <div
          v-for="service in services"
          :key="service.id"
          @click="selectedService = service"
          :class="['RS_serviceCard', selectedService?.id === service.id ? 'RS_selected' : '']"
        >
          <h3 class="RS_serviceTitle">{{ service.name }}</h3>
          <p class="RS_serviceDate">{{ service.date }}</p>
          <p class="RS_serviceTime">{{ service.time }}</p>
          <p class="RS_serviceSeatInfo">
            <span class="material-icons RS_seatIcon">좌석</span>
            {{ service.reserved }} / {{ service.total }}
          </p>
        </div>
      </div>
    </div>

    <!-- 예약 상세 모달 -->
    <Modal :open="isModalOpen" @click.self="closeModal">
      <h2 class="RS_modalTitle">예약 상세 정보</h2>
      <div v-if="selectedSeat?.reservationInfo" class="RS_modalContent">
        <p><strong>예약 번호:</strong> {{ selectedSeat.reservationInfo.id }}</p>
        <p><strong>예약자:</strong> {{ selectedSeat.reservationInfo.name }}</p>
        <p><strong>좌석:</strong> {{ selectedSeat.row }} - {{ selectedSeat.col }}</p>
        <p><strong>공연:</strong> {{ selectedService.name }}</p>
        <p><strong>일시:</strong> {{ selectedService.date }} {{ selectedService.time }}</p>
      </div>
      <div class="RS_modalFooter">
        <Button :theme="'gray'" @click="cancelReservation">예약 취소</Button>
        <Button @click="closeModal"> 닫기 </Button>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style>
.RS_container {
  @apply flex gap-6;
}

.RS_seatWrapper {
  @apply components-white-container flex-1 flex flex-col gap-4;
}

.RS_seatBoard {
  @apply relative p-4 overflow-visible;
}

.RS_title {
  @apply font-semibold mb-2;
}

.RS_legend {
  @apply flex gap-4 mb-2 items-center;
}

.RS_legendSeat {
  @apply w-4 h-4 rounded-sm border;
}

.RS_legendSeat.RS_empty {
  @apply bg-primary;
}

.RS_legendSeat.RS_reserved {
  @apply bg-gray-200;
}

.RS_legendText {
  @apply text-sm text-gray-700;
}

.RS_seatGrid {
  @apply inline-block;
  width: calc(12 * 1.5rem + 11px);
}

.RS_seatRow {
  @apply flex gap-1 mb-1;
}

.RS_seat {
  @apply w-6 h-6 rounded-sm cursor-pointer border relative transition;
}

.RS_seat.RS_empty {
  @apply bg-primary;
}

.RS_seat.RS_reserved {
  @apply bg-gray-200;
}

.RS_seat.RS_hovered {
  @apply ring-2 ring-yellow-400;
}

.RS_seatTooltip {
  @apply absolute p-2 bg-gray-50 border rounded text-sm text-gray-700 shadow z-10 whitespace-nowrap pointer-events-none;
}

.RS_noReservation {
  @apply text-gray-400;
}

.RS_reservationList {
  @apply rounded p-4 text-sm text-gray-700;
}

.RS_tableContainer {
  @apply components-super-table-container max-h-64 overflow-y-auto;
}

.RS_rowHover {
  @apply bg-gray-100;
}

.RS_serviceCards {
  @apply flex flex-col gap-4 w-64;
}

.RS_serviceCard {
  @apply border cursor-pointer transition components-white-container mb-0;
}

.RS_serviceCard.RS_selected {
  @apply border-blue-500 bg-blue-50;
}

.RS_serviceTitle {
  @apply font-semibold;
}

.RS_serviceDate,
.RS_serviceTime {
  @apply text-gray-500 text-sm;
}

.RS_serviceSeatInfo {
  @apply text-gray-700 text-sm flex items-center gap-1;
}

.RS_seatIcon {
  @apply text-sm;
}

.RS_modalTitle {
  @apply text-lg font-semibold mb-4;
}

.RS_modalContent {
  @apply space-y-2;
}

.RS_modalFooter {
  @apply mt-6 gap-3 flex justify-end;
}
</style>
