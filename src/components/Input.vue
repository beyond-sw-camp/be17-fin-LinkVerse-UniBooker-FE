<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text' // 'text' 또는 'checkbox'
  },
  label: String, // checkbox일 때 라벨
  placeholder: String
})

const inputClasses = computed(() => {
  if (props.type === 'checkbox') {
    return 'components-checkbox-base'
  }
  return 'input-base'
})
</script>

<template>
  <div>
    <template v-if="type === 'checkbox'">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" :class="inputClasses" />
        {{ label }}
      </label>
    </template>
    <template v-else>
      <input :class="inputClasses" :placeholder="placeholder" />
    </template>
  </div>
</template>

<style scoped>
/* 일반 input 스타일 */
.input-base {
  @apply
    px-2.5 py-2.5 rounded 
    placeholder-gray-400
    outline-none border-b-2
    transition-all duration-200
    focus:border-[#00008C]
    disabled:bg-gray-100 disabled:cursor-not-allowed;
}

/* 체크박스 기본 스타일 */
.components-checkbox-base {
  @apply appearance-none w-5 h-5 rounded-sm shadow-sm bg-white border border-gray-300 cursor-pointer transition-all duration-200;
  position: relative;
}

/* 체크 상태일 때 */
.components-checkbox-base:checked {
  border-color: #00008C;
  box-shadow: 0 0 3px rgba(0, 0, 140, 0.5);
}

/* 체크 마크 */
.components-checkbox-base:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border-right: 2px solid #00008C;
  border-bottom: 2px solid #00008C;
  transform: rotate(45deg);
}
</style>