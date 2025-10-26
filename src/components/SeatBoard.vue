<script setup>
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

// 예약 리스트 트랙킹용 refs
const seatRefs = reactive({})

// 좌석판에서 호버 -> 스크롤 포함
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
  if (seat.reservationInfo && seatRefs[seat.id]) {
    seatRefs[seat.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <div class="p-6 flex flex-col sm:flex-row gap-8">

    <!-- 좌석판 -->
    <div class="seat-board flex-1">
      <h2 class="title">좌석</h2>

      <!-- 좌석 범례 -->
      <div class="legend">
        <div class="legend-seat empty"></div>
        <span class="legend-text">빈 좌석</span>
        <div class="legend-seat reserved"></div>
        <span class="legend-text">예약 완료</span>
      </div>

      <!-- 실제 좌석 -->
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

    <!-- 오른쪽 가격 정보 -->
    <div class="seat-info-box w-56 border-l pl-6">
      <h3 class="title">좌석등급 / 잔여석</h3>
      <div class="flex flex-col gap-3 text-sm">
        <div class="flex justify-between">
          <span>전석</span>
          <span>44,000원</span>
        </div>
        <div class="flex justify-between text-gray-500 text-xs">
          <span>총 좌석 {{ rows * cols }}</span>
          <span>남은 좌석 {{ seats.flat().filter(s => !s.reserved).length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  @apply font-semibold mb-2;
}

.seat-board {
  @apply relative p-4 overflow-visible;
  flex: 1;
}

.seat-info-box {
  @apply bg-white text-gray-800;
  min-width: 12rem;
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

.table-container {
  @apply components-super-table-container max-h-64 overflow-y-auto;
}
</style>