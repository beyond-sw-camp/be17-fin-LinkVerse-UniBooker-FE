<script setup>
import { ref, computed, watch } from 'vue'
import Dropdown from '@/components/Dropdown.vue'

const props = defineProps({
  interval: Number,
  modelValue: { type: Array, default: () => [] },
  excludedTimes: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalOpen = ref(false)
const editingIndex = ref(null)

// 입력 상태
const date = ref('')
const isHoliday = ref(false)
const startHour = ref('')
const startMinute = ref('')
const endHour = ref('')
const endMinute = ref('')
const selectedTimes = ref([])
const note = ref('')

// 시간 옵션
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

const modalTimes = ref([])

const updateModalTimes = () => {
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) {
    modalTimes.value = []
    return
  }

  const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
  const endMin = Number(endHour.value) * 60 + Number(endMinute.value)
  const times = []

  for (let t = startMin; t <= endMin; t += props.interval) {
    const h = Math.floor(t / 60)
    const m = t % 60
    times.push({ label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, value: t })
  }

  modalTimes.value = times
}

// 시·분 선택 시마다 갱신
watch([startHour, startMinute, endHour, endMinute], updateModalTimes)

// 선택 토글
const toggleSelectedTime = (timeLabel) => {
  const idx = selectedTimes.value.indexOf(timeLabel)

  if (idx >= 0) {
    selectedTimes.value.splice(idx, 1)
  } else {
    selectedTimes.value.push(timeLabel)
  }

  // 시간 순으로 정렬 (항상 start ~ end 순서 유지)
  selectedTimes.value.sort((a, b) => {
    const [ah, am] = a.split(':').map(Number)
    const [bh, bm] = b.split(':').map(Number)
    return ah * 60 + am - (bh * 60 + bm)
  })
}

// 모달 열기/닫기
const openModal = () => {
  // 휴무일이 아니면 선택 가능한 시간 초기화
  if (
    !isHoliday.value &&
    startHour.value &&
    startMinute.value &&
    endHour.value &&
    endMinute.value
  ) {
    const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
    const endMin = Number(endHour.value) * 60 + Number(endMinute.value)
    selectedTimes.value = []

    for (let t = startMin; t <= endMin; t += props.interval) {
      const h = Math.floor(t / 60)
      const m = t % 60
      const timeLabel = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

      // 제외 시간에 포함되지 않으면 선택된 상태로 추가
      const isExcluded = props.excludedTimes.some(
        (ex) => timeLabel >= ex.start && timeLabel < ex.end,
      )
      if (!isExcluded) selectedTimes.value.push(timeLabel)
    }
  }

  modalOpen.value = true
}

const closeModal = () => {
  resetForm()
  editingIndex.value = null
  modalOpen.value = false
  emit('close')
}

// 추가/수정
const addException = () => {
  if (!date.value) return alert('날짜를 선택해주세요.')

  if (!isHoliday.value) {
    if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value)
      return alert('시작시간과 종료시간을 입력해주세요.')
  }

  const newItems = []
  if (isHoliday.value) {
    newItems.push({
      date: date.value,
      note: note.value,
      isHoliday: true,
      selectedTimes: [],
    })
  } else {
    newItems.push({
      date: date.value,
      startTime: selectedTimes.value[0],
      endTime: selectedTimes.value[selectedTimes.value.length - 1],
      note: note.value,
      isHoliday: false,
      selectedTimes: [...selectedTimes.value],
    })
  }

  if (editingIndex.value !== null) {
    props.modelValue.splice(editingIndex.value, 1, ...newItems)
  } else {
    props.modelValue.push(...newItems)
  }

  emit('update:modelValue', [...props.modelValue])
  closeModal()
}

// 제외시간 선택 모달 열기 전에 체크
const checkBeforeOpenModal = () => {
  if (!date.value) {
    return alert('날짜를 선택해주세요.')
  }

  if (!isHoliday.value) {
    if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value) {
      return alert('시작시간과 종료시간을 입력해주세요.')
    }
  }

  openModal()
}

// 수정
const editException = (ex, idx) => {
  editingIndex.value = idx
  date.value = ex.date
  isHoliday.value = ex.isHoliday
  note.value = ex.note || ''

  if (!ex.isHoliday) {
    startHour.value = (ex.startTime || '').split(':')[0] || ''
    startMinute.value = (ex.startTime || '').split(':')[1] || ''
    endHour.value = (ex.endTime || '').split(':')[0] || ''
    endMinute.value = (ex.endTime || '').split(':')[1] || ''

    // 시간 목록 갱신 후 기존 선택값 복원
    updateModalTimes()

    // 기존 선택 상태 유지
    if (ex.selectedTimes?.length) {
      selectedTimes.value = [...ex.selectedTimes]
    } else {
      selectedTimes.value = modalTimes.value.map((t) => t.label)
    }
  } else {
    selectedTimes.value = []
  }

  modalOpen.value = true
}

// 삭제
const removeException = (idx) => {
  props.modelValue.splice(idx, 1)
  emit('update:modelValue', [...props.modelValue])
}

// 초기화
const resetForm = () => {
  date.value = ''
  isHoliday.value = false
  startHour.value = ''
  startMinute.value = ''
  endHour.value = ''
  endMinute.value = ''
  selectedTimes.value = []
  note.value = ''
}

const resetAll = () => {
  // 내부 상태 초기화
  date.value = ''
  isHoliday.value = false
  startHour.value = ''
  startMinute.value = ''
  endHour.value = ''
  endMinute.value = ''
  selectedTimes.value = []
  note.value = ''
  editingIndex.value = null
  modalOpen.value = false

  // v-model로 바인딩된 부모 값 초기화
  emit('update:modelValue', [])
}
defineExpose({ resetAll })
</script>

<template>
  <div>
    <div class="exception-date-and-time-container">
      <!-- 날짜 -->
      <div class="modal-input-section">
        <div class="date-setting-container">
          <input type="date" v-model="date" class="text-input" />
          <Input type="checkbox" v-model="isHoliday" label="휴무일" class="w-[100px]" />
        </div>
      </div>

      <!-- 시간 선택 영역: 휴무일이면 숨김 -->
      <div class="time-select-section">
        <div v-if="!isHoliday" class="flex gap-2 items-center">
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
          <span>~</span>
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

        <!-- 시간 추가 버튼 -->
        <button @click="checkBeforeOpenModal" class="exception-time-modal-open-button">+</button>
      </div>
    </div>
    <!-- 모달 -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
        <div class="modal-exclude-time-select">
          <h2>
            {{
              isHoliday
                ? '예외 사유/비고 입력'
                : editingIndex !== null
                  ? '예외 일정 수정'
                  : '예외 일정 추가'
            }}
          </h2>
          <p v-if="!isHoliday">제외할 시간을 선택해주세요.</p>
        </div>

        <!-- 시간 선택: 휴무일이 아니면만 -->
        <div v-if="!isHoliday" class="flex flex-wrap gap-2 mb-4">
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

        <!-- 사유/비고 입력 -->
        <div class="mt-[35px] mb-4">
          <label class="block mb-1 text-[14px]">사유 / 비고</label>
          <input
            type="text"
            v-model="note"
            class="modal-input-style w-full"
            placeholder="예: 휴게시간"
          />
        </div>

        <!-- 버튼 -->
        <div class="modal-exclud-time-button-container">
          <Button @click="closeModal" theme="gray" size="sm">취소</Button>
          <Button @click="addException" size="sm">
            {{ editingIndex !== null ? '수정 완료' : '추가' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 등록된 예외 일정 -->
    <div v-if="props.modelValue.length" class="space-y-2 mt-5">
      <div v-for="(ex, idx) in props.modelValue" :key="idx" class="list-item-card">
        <div>
          <p class="item-date-section">{{ ex.date }} <span v-if="ex.isHoliday">(휴무)</span></p>
          <p v-if="!ex.isHoliday" class="text-sm text-gray-600">
            {{ ex.startTime }} ~ {{ ex.endTime }}
          </p>
          <p v-if="ex.note" class="item-note">{{ ex.note }}</p>
        </div>
        <div class="list-item-button-container">
          <button @click="editException(ex, idx)" class="item-edit-button">수정</button>
          <button @click="removeException(idx)" class="item-delete-button">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exception-time-modal-open-button {
  @apply bg-blue-600 text-white w-[40px] h-[40px] rounded text-[30px] leading-tight;
}

.modal-input-section {
  @apply flex flex-col gap-1;
}

.date-setting-container {
  @apply flex gap-3 items-center text-[14px];
}

.text-input {
  @apply w-[200px] text-[14px] px-[12px] py-[8px] rounded-[3px] cursor-pointer;
}

.dropdown-style {
  @apply text-[14px] bg-gray-line;
}

.exception-date-and-time-container {
  @apply flex items-center;
}

.time-select-section {
  @apply flex gap-2 items-center;
}

.time-select-section > div {
  @apply flex gap-1;
}

.modal-exclude-time-select {
  @apply text-[14px] text-text mb-[25px];
}

.modal-exclude-time-select h2 {
  @apply font-bold text-[20px];
}

.modal-input-style {
  @apply rounded-[3px] bg-gray-line px-[12px] py-[8px] text-[14px];
}

.modal-exclud-time-button-container {
  @apply flex justify-between gap-2 mt-[40px];
}

.modal-exclud-time-button-container button {
  @apply flex-1 h-[40px] rounded-[3px];
}

.exception-date-and-time-container {
  @apply mt-[10px];
}

.list-item-button-container {
  @apply flex gap-3 text-[13px];
}

.item-delete-button {
  @apply text-red-600 hover:text-red-800;
}

.item-edit-button {
  @apply text-gray-dark;
}

.list-item-card {
  @apply bg-white rounded-[3px] px-[16px] py-[10px] flex justify-between;
}

.item-date-section {
  @apply font-medium text-[15px] flex gap-3;
}

.item-date-section span {
  @apply text-red-500 text-[14px];
}

.item-note {
  @apply text-[13px] text-gray-500 mt-1;
}
</style>
