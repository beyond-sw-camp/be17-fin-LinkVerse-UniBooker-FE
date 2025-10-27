<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  interval: Number,
  existingSlots: { type: Array, default: () => [] },
})

const days = ['월', '화', '수', '목', '금', '토', '일']
const dayOrder = ['월', '화', '수', '목', '금', '토', '일']

const selectedDays = ref([])
const modalOpen = ref(false)
const startHour = ref('')
const startMinute = ref('')
const endHour = ref('')
const endMinute = ref('')
const timeSlots = ref([])
const editingIndex = ref(null)
const selectedTimes = ref([])

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: String(i).padStart(2, '0'),
  value: String(i).padStart(2, '0'),
}))

const minuteOptions = computed(() =>
  props.interval === 60
    ? [{ label: '00', value: '00' }]
    : [
        { label: '00', value: '00' },
        { label: '30', value: '30' },
      ],
)

// 한글 ↔ 영문 요일 맵핑
const dayMap = { 월: 'MON', 화: 'TUE', 수: 'WED', 목: 'THU', 금: 'FRI', 토: 'SAT', 일: 'SUN' }
const dayMapReverse = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
}

// 선택된 시간 배열 생성
function generateSelectedTimes(start, end, interval) {
  const startMin = Number(start.split(':')[0]) * 60 + Number(start.split(':')[1])
  const endMin = Number(end.split(':')[0]) * 60 + Number(end.split(':')[1])
  const times = []
  for (let t = startMin; t < endMin; t += interval) {
    const h = Math.floor(t / 60)
    const m = t % 60
    times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return times
}

// slots 초기화 함수
const initializeSlots = (slots) => {
  if (!slots.length) return
  const grouped = {}
  slots.forEach((slot) => {
    const key = `${slot.startTime}~${slot.endTime}`
    const dayKor = dayMapReverse[slot.dayOfWeek] || slot.dayOfWeek
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(dayKor)
  })
  timeSlots.value = Object.entries(grouped).map(([key, daysArr]) => {
    const [start, end] = key.split('~')
    return {
      days: daysArr.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)),
      start,
      end,
      selectedTimes: generateSelectedTimes(start, end, props.interval),
    }
  })
}

// 초기 마운트 시
onMounted(() => {
  initializeSlots(props.existingSlots)
})

// props.existingSlots가 바뀌면 다시 반영
watch(
  () => props.existingSlots,
  (newSlots) => {
    initializeSlots(newSlots)
  },
  { deep: true },
)

const modalTimes = computed(() => {
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) return []
  const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
  const endMin = Number(endHour.value) * 60 + Number(endMinute.value)
  const times = []
  for (let t = startMin; t < endMin; t += props.interval) {
    const h = Math.floor(t / 60)
    const m = t % 60
    times.push({ label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, value: t })
  }
  return times
})

watch(modalTimes, (newTimes) => {
  if (newTimes.length && editingIndex.value === null) {
    selectedTimes.value = newTimes.map((t) => t.label)
  }
})

const toggleDay = (day) => {
  const idx = selectedDays.value.indexOf(day)
  if (idx >= 0) selectedDays.value.splice(idx, 1)
  else selectedDays.value.push(day)
}

const openModal = () => {
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) {
    alert('시작/종료 시간을 선택해주세요.')
    return
  }
  if (!selectedDays.value.length) {
    alert('요일을 선택해주세요.')
    return
  }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingIndex.value = null
}

const toggleSelectedTime = (timeLabel) => {
  const idx = selectedTimes.value.indexOf(timeLabel)
  if (idx >= 0) selectedTimes.value.splice(idx, 1)
  else selectedTimes.value.push(timeLabel)
}

const resetAll = () => {
  selectedDays.value = []
  startHour.value = ''
  startMinute.value = ''
  endHour.value = ''
  endMinute.value = ''
  selectedTimes.value = []
  timeSlots.value = []
  editingIndex.value = null
}

function toMinutes(hhmm) {
  const [h, m] = (hhmm || '00:00').split(':').map(Number)
  return h * 60 + m
}

function toHHMM(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// expose
defineExpose({
  resetAll,
  getTimeSlots: () => {
    const interval = Number(props.interval || 60)
    const result = []

    timeSlots.value.forEach((slot) => {
      // 포함된 시각 리스트(선택된 시간들)
      const includedArr = Array.isArray(slot.selectedTimes)
        ? [...slot.selectedTimes].sort()
        : []

      if (!includedArr.length) return

      const startTimesInMin = includedArr.map(toMinutes)

      // 연속된 구간을 묶는다
      let blockStart = startTimesInMin[0]
      let prev = startTimesInMin[0]

      for (let i = 1; i <= startTimesInMin.length; i++) {
        const cur = startTimesInMin[i]
        const isContiguous = cur === prev + interval

        // 블록 종료 시점
        if (!isContiguous) {
          result.push({
            days: slot.days.map((d) => dayMap[d] || d),
            startTime: toHHMM(blockStart),
            endTime: toHHMM(prev + interval), // ✅ 마지막 시작 + interval
          })

          // 새 블록 시작
          if (cur) {
            blockStart = cur
            prev = cur
          }
        } else {
          prev = cur
        }
      }
    })

    return result
  },
})

const addSlot = () => {
  if (!selectedTimes.value.length) {
    alert('시간을 하나 이상 선택하세요')
    return
  }

  // 숫자 기준으로 정렬
  selectedTimes.value.sort((a, b) => toMinutes(a) - toMinutes(b))

  const sortedDays = [...selectedDays.value].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
  )

  const lastTime = selectedTimes.value[selectedTimes.value.length - 1]
  const endTime = toHHMM(toMinutes(lastTime) + props.interval)

  const newSlot = {
    days: sortedDays,
    start: selectedTimes.value[0],
    end: endTime, 
    selectedTimes: [...selectedTimes.value],
  }

  if (editingIndex.value !== null) timeSlots.value[editingIndex.value] = newSlot
  else timeSlots.value.push(newSlot)

  selectedDays.value = []
  startHour.value = ''
  startMinute.value = ''
  endHour.value = ''
  endMinute.value = ''
  selectedTimes.value = []
  editingIndex.value = null
  closeModal()
}

const removeSlot = (idx) => {
  timeSlots.value.splice(idx, 1)
}

const editSlot = (slot, idx) => {
  editingIndex.value = idx
  selectedDays.value = [...slot.days]
  startHour.value = slot.start.split(':')[0]
  startMinute.value = slot.start.split(':')[1]
  endHour.value = slot.end.split(':')[0]
  endMinute.value = slot.end.split(':')[1]
  selectedTimes.value = [...slot.selectedTimes]
  modalOpen.value = true
}
</script>

<template>
  <div class="time-slot-modal-container">
    <div class="day-time-term-select-section">
      <!-- 요일 선택 -->
      <div class="day-select-container">
        <button
          v-for="day in days"
          :key="day"
          @click="toggleDay(day)"
          :class="[
            'day-button-style',
            selectedDays.includes(day) ? 'bg-primary text-white' : 'bg-gray-deep',
          ]"
        >
          {{ day }}
        </button>
      </div>

      <!-- 시간 선택 + 간격 + 모달 열기 -->
      <div class="time-select-section">
        <div>
          <Dropdown
            v-model="startHour"
            :options="hourOptions"
            placeholder="시"
            width="w-20"
            class="dropdown-style"
          />
          <Dropdown
            v-model="startMinute"
            :options="minuteOptions"
            placeholder="분"
            width="w-20"
            class="dropdown-style"
          />
        </div>
        <span>~</span>
        <div>
          <Dropdown
            v-model="endHour"
            :options="hourOptions"
            placeholder="시"
            width="w-20"
            class="dropdown-style"
          />
          <Dropdown
            v-model="endMinute"
            :options="minuteOptions"
            placeholder="분"
            width="w-20"
            class="dropdown-style"
          />
        </div>

        <button @click="openModal" class="day-and-time-add-button">+</button>
      </div>
    </div>

    <!-- 모달 -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
        <div class="modal-exclude-time-select">
          <h2>{{ editingIndex !== null ? '시간 수정' : '시간 선택' }}</h2>
          <p>제외할 시간을 선택해주세요.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="time in modalTimes"
            :key="time.label"
            @click="toggleSelectedTime(time.label)"
            :class="[
              'px-3 py-1 border rounded cursor-pointer',
              selectedTimes.includes(time.label) ? 'bg-blue-600 text-white' : 'bg-gray-200',
            ]"
          >
            {{ time.label }}
          </button>
        </div>

        <div class="modal-exclud-time-button-container">
          <Button @click="closeModal" theme="gray" size="sm">취소</Button>
          <Button @click="addSlot" size="sm">{{
            editingIndex !== null ? '수정 완료' : '추가'
          }}</Button>
        </div>
      </div>
    </div>

    <!-- 추가된 시간대 -->
    <div v-if="timeSlots.length" class="add-time-list-container">
      <div v-for="(slot, idx) in timeSlots" :key="idx" class="add-time-item">
        <span>{{ slot.days.join(', ') }} | {{ slot.start }} ~ {{ slot.end }}</span>
        <div class="add-time-item-button-container">
          <button @click="editSlot(slot, idx)" class="text-gray-dark">수정</button>
          <button @click="removeSlot(idx)" class="text-red-600 hover:text-red-800">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-slot-modal-container {
  @apply mt-[15px];
}

.day-select-container {
  @apply flex gap-1;
}

.day-button-style {
  @apply w-[38px] h-[38px] rounded-[50px];
}

.day-time-term-select-section {
  @apply flex items-center gap-5;
}

.dropdown-style {
  @apply text-[14px];
}

.time-select-section {
  @apply flex gap-2 items-center;
}

.time-select-section > div {
  @apply flex gap-1;
}

.day-and-time-add-button {
  @apply bg-blue-600 text-white w-[40px] h-[40px] rounded text-[30px] leading-tight;
}

.modal-exclude-time-select h2 {
  @apply font-bold text-[20px];
}

.modal-exclude-time-select {
  @apply text-[14px] text-text mb-[25px];
}

.modal-exclud-time-button-container {
  @apply flex justify-between gap-2 mt-[40px];
}

.modal-exclud-time-button-container button {
  @apply flex-1 h-[40px] rounded-[3px];
}

.add-time-list-container {
  @apply mt-[25px] text-[14px] flex flex-col gap-2;
}

.add-time-item {
  @apply bg-white flex justify-between items-center py-[10px] px-[16px] rounded-[3px];
}

.add-time-item-button-container {
  @apply text-[13px] flex gap-3;
}

.add-time-item-button-container button {
  @apply cursor-pointer;
}
</style>
