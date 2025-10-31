<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import serviceApi from '@/services/service/service_api'
import reservationApi from '@/services/reservation/reservation_api'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const serviceId = route.params.serviceId

// ---- 상태
const loading = ref(true)
const service = ref(null) // 서비스 정보
const capacity = computed(() => Number(service.value?.capacity ?? 0))
const rows = ref(10)
const cols = ref(12)

const allReservations = ref([]) // 이 서비스의 모든 예약
const selectedDate = ref(null) // 'YYYY-MM-DD'
const selectedHour = ref(null) // 0~23 정수
const selectedMinute = ref(0)

const isModalOpen = ref(false)
const selectedSeat = ref(null)
const hoverSeat = ref(null)
const seatRefs = reactive({}) // 예약 리스트 스크롤 동기화용

// ---- 유틸
const pad2 = (n) => String(n).padStart(2, '0')
const dateToStr = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const hhmmToMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const overlaps = (slotStartMin, slotEndMin, resStartMin, resEndMin) =>
  slotStartMin < resEndMin && slotEndMin > resStartMin

// ---- 데이터 적재
const loadService = async () => {
  const detail = await serviceApi.getServiceInfo(serviceId)
  service.value = detail
  rows.value = detail.row
  cols.value = detail.col
}

const loadReservations = async () => {
  console.log('serviceId:', serviceId)
  const res = await reservationApi.getServiceReservations(serviceId)
  // 표준화: 날짜/시간/좌표 필드 매핑
  allReservations.value = res.map((r) => {
    const start = new Date(r.startDate)
    const end = new Date(r.endDate)
    return {
      id: r.id,
      userName: r.userName,
      reservationDate: r.startDate.split('T')[0], // 'YYYY-MM-DD'
      startTime: `${pad2(start.getHours())}:${pad2(start.getMinutes())}`, // 'HH:MM'
      endTime: `${pad2(end.getHours())}:${pad2(end.getMinutes())}`,
      row: Number(r.row ?? 0),
      col: Number(r.col ?? 0),
      status: r.status ?? 'CONFIRMED',
    }
  })

  // 초기 선택: 첫 예약의 날짜/시간
  if (allReservations.value.length) {
    selectedDate.value = selectedDate.value || allReservations.value[0].reservationDate
    selectedHour.value =
      selectedHour.value ?? Number(allReservations.value[0].startTime.split(':')[0])
  } else {
    const today = new Date()
    selectedDate.value = selectedDate.value || dateToStr(today)
    selectedHour.value = selectedHour.value ?? new Date().getHours()
  }

  // 좌석판 크기가 서비스에 없으면, 예약 데이터에서 추정
  if (!service.value?.row || !service.value?.col) {
    const maxRow = Math.max(0, ...allReservations.value.map((x) => x.row || 0))
    const maxCol = Math.max(0, ...allReservations.value.map((x) => x.col || 0))
    if (maxRow > 0) rows.value = maxRow
    if (maxCol > 0) cols.value = maxCol
  }
}

// ---- “선택된 시간대(=selectedDate + selectedHour~+60분)”의 예약만 필터링
const reservationsAtSelectedSlot = computed(() => {
  const slotStartMin = selectedHour.value * 60 + (selectedMinute.value || 0)
  const slotEndMin = slotStartMin + 60
  return allReservations.value.filter((r) => {
    if (r.reservationDate !== selectedDate.value) return false
    if (r.status && r.status !== 'CONFIRMED') return false
    const resStartMin = hhmmToMin(r.startTime)
    const resEndMin = hhmmToMin(r.endTime)
    return overlaps(slotStartMin, slotEndMin, resStartMin, resEndMin)
  })
})

// ---- 같은 리소스(=동일 serviceId)의 “다른 시간대 요약 카드들” (같은 날짜 기준)
const slotSummariesForSidebar = computed(() => {
  // 같은 날짜 내의 슬롯 요약: 시간(HH)을 키로 그룹핑
  const summaries = new Map()
  const sameDateReservations = allReservations.value.filter(
    (r) => r.reservationDate === selectedDate.value && (!r.status || r.status === 'CONFIRMED'),
  )
  for (const r of sameDateReservations) {
    const hour = Number(r.startTime.split(':')[0])
    if (!summaries.has(hour)) {
      summaries.set(hour, { hour, count: 0 })
    }
    summaries.get(hour).count++
  }

  // 시간순 정렬, 현재 선택된 시간은 맨 위로
  const arr = Array.from(summaries.values()).sort((a, b) => a.hour - b.hour)
  arr.sort((a, b) => (a.hour === selectedHour.value ? -1 : b.hour === selectedHour.value ? 1 : 0))
  return arr.map((x) => ({
    ...x,
    capacity: capacity.value,
    label: `${pad2(x.hour)}:00 ~ ${pad2((x.hour + 1) % 24)}:00`,
    isActive: x.hour === selectedHour.value,
  }))
})

// ---- 날짜 선택 (간단 input[type="date"])
const tempDate = ref('')
const openDate = () => {
  tempDate.value = selectedDate.value || dateToStr(new Date())
}
const applyDate = () => {
  if (!tempDate.value) return
  selectedDate.value = tempDate.value
}

// ---- 슬롯 전환
const selectHour = (hour) => {
  selectedHour.value = hour
  // 스크롤 동기화 UX: 첫 행으로 스크롤
  const first = reservationsAtSelectedSlot.value[0]
  if (first) {
    // 예약 리스트의 첫 DOM에 스크롤 하려면 ref 바인딩 해놨던 걸 이용
    const seatKey = `${first.id}-row`
    if (seatRefs[seatKey]) {
      seatRefs[seatKey].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// ---- 좌석판(선택 슬롯 기준)
const seats = computed(() => {
  // 선택 슬롯의 예약만 반영해서 좌석 상태 생성
  const grid = Array.from({ length: rows.value }, (_, r) =>
    Array.from({ length: cols.value }, (_, c) => {
      const reservedSeat = reservationsAtSelectedSlot.value.find(
        (x) => x.row === r + 1 && x.col === c + 1,
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
  return grid
})

// ---- 좌석 상호작용
const onSeatHoverBoard = (seat) => {
  hoverSeat.value = seat
  if (seat.reservationInfo) {
    const seatKey = `${seat.reservationInfo.id}-row`
    if (seatRefs[seatKey]) {
      seatRefs[seatKey].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
const onSeatHoverList = (seat) => {
  hoverSeat.value = seat
}
const openSeatDetail = (seat) => {
  if (!seat.reservationInfo) return
  selectedSeat.value = seat
  isModalOpen.value = true
}
const closeModal = () => (isModalOpen.value = false)
const cancelReservation = () => {
  // 실제 취소 API 연동은 여기서
}

// ---- 라이프사이클
onMounted(async () => {
  await loadService()
  await loadReservations()
  loading.value = false
})

// 날짜가 바뀌면 시간대 리스트도 함께 갱신되므로, 선택된 시간이 비어있을 경우 보정
watch(selectedDate, () => {
  if (selectedHour.value == null && slotSummariesForSidebar.value.length) {
    selectedHour.value = slotSummariesForSidebar.value[0].hour
  }
})
</script>

<template>
  <AdminLayout>
    <div v-if="!loading">
      <!-- 헤더 영역 -->
      <div>
        <h1 class="text-xl font-semibold">
          {{ service.name }}
        </h1>
      </div>

      <!-- 본문: 좌측(좌석판+예약리스트) / 우측(다른 시간대 요약) -->
      <div class="flex gap-4">
        <!-- 좌측 -->
        <div class="components-white-container flex-1 flex flex-col gap-4">
          <!-- 좌석판 -->
          <div class="seat-board">
            <h2 class="title">좌석</h2>

            <!-- 좌석 범례 -->
            <div class="legend">
              <div class="legend-seat empty"></div>
              <span class="legend-text">예약 가능</span>
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
                  :data-tip="`좌석 ${seat.row}-${seat.col}${
                    seat.reservationInfo
                      ? ' · 예약자 ' + seat.reservationInfo.userName
                      : ' · 예약 없음'
                  }`"
                  @mouseenter="onSeatHoverBoard(seat)"
                  @mouseleave="hoverSeat = null"
                  @click="openSeatDetail(seat)"
                />
              </div>
            </div>
          </div>

          <!-- 예약 리스트 (선택 시간대) -->
          <div class="reservation-list">
            <h2 class="title text-lg font-semibold mb-2">예약 리스트</h2>
            <div class="components-super-table-container max-h-64 overflow-y-auto border rounded">
              <table class="components-super-table w-full text-sm">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="text-left px-3 py-2">예약 번호</th>
                    <th class="text-left px-3 py-2">예약자</th>
                    <th class="text-left px-3 py-2">좌석</th>
                    <th class="text-left px-3 py-2">예약 시간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="seat in seats.flat().filter((s) => s?.reservationInfo)"
                    :key="seat.id"
                    :ref="(el) => (seatRefs[`${seat.reservationInfo.id}-row`] = el)"
                    @mouseenter="onSeatHoverList(seat)"
                    @mouseleave="hoverSeat = null"
                    @click="openSeatDetail(seat)"
                    :class="[hoverSeat?.id === seat.id ? 'bg-blue-50' : '', 'border-t']"
                  >
                    <td class="px-3 py-2">{{ seat.reservationInfo.id }}</td>
                    <td class="px-3 py-2">{{ seat.reservationInfo.userName }}</td>
                    <td class="px-3 py-2">좌석 {{ seat.row }}-{{ seat.col }}</td>
                    <td class="px-3 py-2">
                      {{ selectedDate }}
                      {{ seat.reservationInfo.startTime }} ~ {{ seat.reservationInfo.endTime }}
                    </td>
                  </tr>

                  <tr v-if="seats.flat().every((s) => !s.reservationInfo)">
                    <td colspan="4" class="px-3 py-6 text-center text-gray-500">
                      선택된 시간대에 예약이 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 우측: 같은 리소스의 다른 시간대 요약 -->
        <div class="w-80">
          <div class="components-white-container">
            <div class="flex items-center mb-3">
              <input
                type="date"
                :value="selectedDate"
                @focus="openDate"
                @input="(e) => (tempDate = e.target.value)"
                @change="applyDate"
                class="border rounded px-2 py-1"
              />
            </div>

            <div
              v-for="slot in slotSummariesForSidebar"
              :key="slot.hour"
              :class="[
                'p-3 mb-2 rounded border cursor-pointer transition',
                slot.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectHour(slot.hour)"
            >
              <div class="font-medium">{{ slot.label }}</div>
              <div class="text-sm text-gray-600">{{ slot.count }} / {{ slot.capacity }} 예약됨</div>
            </div>

            <div v-if="!slotSummariesForSidebar.length" class="text-sm text-gray-500">
              선택된 날짜에 예약이 없습니다.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center text-gray-500">loading...</div>

    <!-- 예약 상세 모달 -->
    <Modal :open="isModalOpen" @click.self="closeModal">
      <h2 class="modal-title text-lg font-semibold mb-3">예약 상세 정보</h2>
      <div v-if="selectedSeat?.reservationInfo" class="modal-content space-y-1 text-sm">
        <p><strong>예약 번호:</strong> {{ selectedSeat.reservationInfo.id }}</p>
        <p><strong>예약자:</strong> {{ selectedSeat.reservationInfo.userName }}</p>
        <p><strong>좌석:</strong> {{ selectedSeat.row }} - {{ selectedSeat.col }}</p>
        <p>
          <strong>일시:</strong> {{ selectedDate }} {{ selectedSeat.reservationInfo.startTime }} ~
          {{ selectedSeat.reservationInfo.endTime }}
        </p>
      </div>
      <div class="modal-footer mt-4 flex justify-end gap-2">
        <Button :theme="'gray'" @click="cancelReservation">예약 취소</Button>
        <Button @click="closeModal">닫기</Button>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
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

/* 말풍선 */
.seat::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%; /* 좌석 위쪽에 붙이기 */
  left: 50%;
  transform: translate(-50%, -8px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: #374151;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
  z-index: 10;
}

.seat:hover::after,
.seat:hover::before {
  opacity: 1;
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
