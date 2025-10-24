<script setup>
import { ref, computed, watch } from 'vue'
import Dropdown from '@/components/Dropdown.vue'

const props = defineProps({
  interval: Number, 
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

const modalTimes = computed(() => {
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) return []
  const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
  const endMin = Number(endHour.value) * 60 + Number(endMinute.value)
  const times = []
  for (let t = startMin; t <= endMin; t += Number(props.interval)) {
    const h = Math.floor(t / 60)
    const m = t % 60
    times.push({ label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, value: t })
  }
  return times
})


// 새로 추가할 때만 기본 전체 선택
watch(modalTimes, (newTimes) => {
  if (newTimes.length > 0 && editingIndex.value === null) {
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
  if (selectedDays.value.length === 0) {
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
defineExpose({ resetAll })


const addSlot = () => {
  if (selectedTimes.value.length === 0) {
    alert('시간을 하나 이상 선택하세요.')
    return
  }

  selectedTimes.value.sort()
  const sortedDays = [...selectedDays.value].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
  )

  const newSlot = {
    days: sortedDays,
    start: selectedTimes.value[0],
    end: selectedTimes.value[selectedTimes.value.length - 1],
    selectedTimes: [...selectedTimes.value], // ✅ 선택 상태 저장
  }

  if (editingIndex.value !== null) {
    timeSlots.value[editingIndex.value] = newSlot
  } else {
    timeSlots.value.push(newSlot)
  }

  // 리셋
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

// 수정 기능 — 선택 상태 그대로 복원
const editSlot = (slot, idx) => {
  editingIndex.value = idx // watch보다 먼저 설정

  selectedDays.value = [...slot.days]
  startHour.value = slot.start.split(':')[0]
  startMinute.value = slot.start.split(':')[1]
  endHour.value = slot.end.split(':')[0]
  endMinute.value = slot.end.split(':')[1]

  // 저장된 선택 상태 복원
  if (slot.selectedTimes && slot.selectedTimes.length) {
    selectedTimes.value = [...slot.selectedTimes]
  } else {
    selectedTimes.value = modalTimes.value.map((t) => t.label)
  }

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
          <Button @click="addSlot" size="sm">{{ editingIndex !== null ? '수정 완료' : '추가' }}</Button>
        </div>
      </div>
    </div>

    <!-- 추가된 시간대 -->
    <div v-if="timeSlots.length" class="add-time-list-container">
      <div
        v-for="(slot, idx) in timeSlots"
        :key="idx"
        class="add-time-item"
      >
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
  @apply bg-white flex justify-between items-center py-[10px] px-[16px] rounded-[3px]
}

.add-time-item-button-container {
  @apply text-[13px] flex gap-3
}

.add-time-item-button-container button {
  @apply cursor-pointer
}
</style>
