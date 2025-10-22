<script setup>
import { ref, computed } from 'vue'
import Dropdown from '@/components/Dropdown.vue'

const days = ['월', '화', '수', '목', '금', '토', '일']
const selectedDays = ref([])

// 간격, 모달 상태
const interval = ref(60)
const modalOpen = ref(false)

// 외부에서 선택한 시작/종료 시간
const startHour = ref('')
const startMinute = ref('')
const endHour = ref('')
const endMinute = ref('')

// 저장된 시간 슬롯
const timeSlots = ref([])

// Dropdown 옵션
const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: String(i).padStart(2, '0'),
  value: String(i).padStart(2, '0'),
}))

const minuteOptions = computed(() =>
  interval.value === 60
    ? [{ label: '00', value: '00' }]
    : [
        { label: '00', value: '00' },
        { label: '30', value: '30' },
      ],
)

const intervalOptions = [
  { label: '1시간', value: 60 },
  { label: '30분', value: 30 },
]

// 선택 모달 내 버튼 리스트
const modalTimes = computed(() => {
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) return []
  const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
  const endMin = Number(endHour.value) * 60 + Number(endMinute.value)
  const times = []
  for (let t = startMin; t < endMin; t += Number(interval.value)) {
    const h = Math.floor(t / 60)
    const m = t % 60
    times.push({ label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, value: t })
  }
  return times
})

// 모달에서 선택한 시간
const selectedTimes = ref([])

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
  selectedTimes.value = []
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
}

const toggleSelectedTime = (timeLabel) => {
  const idx = selectedTimes.value.indexOf(timeLabel)
  if (idx >= 0) selectedTimes.value.splice(idx, 1)
  else selectedTimes.value.push(timeLabel)
}

const addSlot = () => {
  if (selectedTimes.value.length === 0) {
    alert('시간을 하나 이상 선택하세요.')
    return
  }
  selectedTimes.value.sort()
  timeSlots.value.push({
    days: [...selectedDays.value],
    start: selectedTimes.value[0],
    end: selectedTimes.value[selectedTimes.value.length - 1],
  })
  closeModal()
}

const removeSlot = (idx) => {
  timeSlots.value.splice(idx, 1)
}
</script>

<template>
  <div class="time-slot-moal-container">
    <div class="day-time-term-select-section">
      <!-- 요일 선택 -->
      <div class="day-select-container">
        <button
          v-for="day in days"
          :key="day"
          @click="toggleDay(day)"
          :class="[
            'day-button-style',
            selectedDays.includes(day) ? 'bg-primary text-white' : 'bg-gray-100',
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
        <Dropdown
          v-model="interval"
          :options="intervalOptions"
          width="w-24"
          placeholder="간격"
          class="dropdown-style"
        />

        <button @click="openModal" class="bg-blue-600 text-white px-3 py-1 rounded">+</button>
      </div>
    </div>

    <!-- 모달 -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">시간 선택</h2>

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

        <div class="flex justify-end space-x-2 mt-4">
          <button @click="closeModal" class="px-3 py-1 border rounded">취소</button>
          <button @click="addSlot" class="px-3 py-1 bg-blue-600 text-white rounded">추가</button>
        </div>
      </div>
    </div>

    <!-- 추가된 시간대 -->
    <div v-if="timeSlots.length" class="mt-4 space-y-2">
      <div
        v-for="(slot, idx) in timeSlots"
        :key="idx"
        class="flex justify-between items-center border rounded px-3 py-2"
      >
        <span>{{ slot.days.join(', ') }} | {{ slot.start }} ~ {{ slot.end }}</span>
        <button @click="removeSlot(idx)" class="text-red-600 hover:text-red-800">삭제</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  @apply flex gap-1
}
</style>
