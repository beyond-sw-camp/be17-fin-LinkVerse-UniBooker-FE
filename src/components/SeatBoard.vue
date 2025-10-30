<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({ service: Object, selectedTime: String, resourceReservations: Array })
const emits = defineEmits(['selectSeat'])

const route = useRoute()

// 행, 열 정보
const rows = props.service.row
const cols = props.service.col

// 좌석 데이터
const seats = ref([])

// 선택한 좌석
const selectedSeat = ref(null)

// 호버된 좌석
const hoverSeat = ref(null)

// 🌟 현재 선택한 시간대에 해당하는 예약 정보만 필터링
const currentTimeReservations = computed(() => {
  if (!props.selectedTime || !props.resourceReservations) return []
  return props.resourceReservations.filter((r) =>
    r.startDate.slice(11, 16) === props.selectedTime
  )
})

// 좌석 데이터 생성
const generateSeats = () => {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {

      // 선택된 시간과 일치하는 예약만 필터링
      const reservedSeat = currentTimeReservations.value.find((item) =>
        item.row === r + 1 && item.col === c + 1
      )

      return {
        id: route.params.itemId * 10000 + r * cols + c, // 좌석 id
        row: r + 1,
        col: c + 1,
        reserved: !!reservedSeat,           // 예약 여부
        reservationInfo: reservedSeat       // 예약된 경우의 예약 상세 정보
          ? {
            id: reservedSeat.id,            // 예약 번호
            name: reservedSeat.userName,    // 좌석을 예약한 사용자 
            date: reservedSeat.startDate,   // 예약 날짜
            time: reservedSeat.endDate,     // 예약 시간
          }
          : null,
      }
    }),
  )
}
  
// 좌석 호버시 처리
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
}

// 좌석 선택 시 부모 컴포넌트에 값 전달
const sendParentSeatInfo = (seat) => {
  selectedSeat.value = seat // 선택한 좌석 저장
  emits('selectSeat', seat)
}

// 화면 로드시 실행
onMounted(() => {
  seats.value = generateSeats() // 좌석 생성

  console.log('🌟props 값 확인 : ', props.selectedTime, props.resourceReservations)
})

// 선택된 시간이 바뀔때마다 좌석 재생성
watch([() => props.selectedTime, () => props.resourceReservations], () => {
  seats.value = generateSeats()
})
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
              selectedSeat?.id === seat.id ? 'selected' : '',
            ]"
            @mouseenter="onSeatHoverBoard(seat)"
            @mouseleave="hoverSeat = null"
            @click="sendParentSeatInfo(seat)"
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
        <p>좌석 ID : {{ hoverSeat.id }}</p>
        <p>좌석: {{ hoverSeat.row }}-{{ hoverSeat.col }}</p>
        <p v-if="hoverSeat.reservationInfo">예약 번호: {{ hoverSeat.reservationInfo.id }}</p>
        <p v-else class="no-reservation">예약 없음</p>
      </div>
    </div>

    <!-- 오른쪽 가격 정보 -->
    <div class="seat-info-box w-56 border-l pl-6">
      <h3 class="title">잔여석</h3>
      <div class="flex flex-col gap-3 text-sm">
        <div class="flex justify-between text-gray-500 text-xs">
          <span>총 좌석 {{ rows * cols }}</span>
          <span>남은 좌석 {{ rows*cols - currentTimeReservations.length || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span>선택한 좌석</span>
          <span>{{ selectedSeat ? selectedSeat.row + '행 ' + selectedSeat.col + '열' : '없음'  }}</span>
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
  @apply bg-gray-200 cursor-not-allowed;
}

.seat.hovered {
  @apply ring-2 ring-yellow-400;
}

.seat-tooltip {
  @apply absolute p-2 bg-gray-50 border rounded text-sm text-gray-700 shadow z-10 whitespace-nowrap pointer-events-none;
}

.seat.selected {
  @apply ring-2 ring-yellow-400;
}

.no-reservation {
  @apply text-gray-400;
}
</style>