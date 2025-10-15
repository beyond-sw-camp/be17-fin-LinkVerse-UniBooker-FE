<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: null },
  placeholder: { type: String, default: 'Select...' },
  width: { type: String, default: 'w-48' },
  bgColor: { type: String, default: 'white' } // white 또는 gray
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const selectedLabel = ref('')
const dropdownRef = ref(null) // 드롭다운 전체를 참조

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  selectedLabel.value = option.label
  isOpen.value = false
}

watch(
  () => props.modelValue,
  (newVal) => {
    const found = props.options.find((o) => o.value === newVal)
    selectedLabel.value = found ? found.label : ''
  },
  { immediate: true },
)

// 외부 클릭 감지
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="dropdown-container relative inline-block" :class="props.width">
    <!-- 버튼 -->
    <button
      class="dropdown-selected-container flex justify-between items-center w-full"
      :class="props.bgColor === 'white' ? 'bg-white' : 'bg-gray-line'"
      @click="toggleDropdown"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <span class="dropdown-direction">{{ isOpen ? '△' : '▽' }}</span>
    </button>

    <!-- 옵션 리스트 -->
    <ul v-if="isOpen" class="dropdown-list">
      <li
        v-for="option in options"
        :key="option.value"
        class="dropdown-option"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-container {
  @apply flex-row;
}

.dropdown-selected-container {
  @apply text-left px-2.5 py-2.5 w-full rounded placeholder-gray-400 outline-none border-b-2
         transition-all duration-200 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.dropdown-direction {
  @apply ml-2;
}

.dropdown-list {
  @apply absolute left-0 pb-1 overflow-y-auto max-h-[60vh] bg-white rounded-md shadow-md w-full z-10;

  /* 웹킷 스크롤바 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded;
  }

  &::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
}

.dropdown-option {
  @apply px-2.5 py-2.5 rounded hover:bg-gray-200 disabled:bg-gray-100 cursor-pointer;
}
</style>
