<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text', // 'text' | 'checkbox' | 'radio'
  },
  label: String, // 체크박스·라디오 옆에 표시할 글자
  placeholder: { type: String, default: '' }, // input일 때 placeholder
  name: String, // 라디오 그룹 지정용 (같은 name = 같은 그룹)
  value: [String, Number, Boolean], // 라디오 버튼 값
  modelValue: [String, Number, Boolean], // v-model용
  disabled: Boolean,
})

const emit = defineEmits(['update:modelValue'])

// 어떤 타입인지에 따라 다른 CSS 클래스 적용 (text, checkbox, radio)
const inputClasses = computed(() => {
  if (props.type === 'checkbox') return 'components-checkbox-base'
  if (props.type === 'radio') return 'components-radio-base'
  return 'input-base'
})

const onChange = (e) => {
  if (props.type === 'checkbox') {
    emit('update:modelValue', e.target.checked)
  } else if (props.type === 'radio') {
    emit('update:modelValue', props.value)
  } else {
    emit('update:modelValue', e.target.value)
  }
}
</script>

<template>
  <div>
    <!-- 체크박스 -->
    <template v-if="props.type === 'checkbox'">
      <label class="components-label">
        <input
          type="checkbox"
          :class="inputClasses"
          :checked="!!modelValue"
          :disabled="disabled"
          @change="onChange"
        />
        <span>{{ label }}</span>
      </label>
    </template>

    <!-- 라디오 -->
    <template v-else-if="props.type === 'radio'">
      <label class="components-label">
        <input
          type="radio"
          :name="name"
          :class="inputClasses"
          :checked="modelValue === value"
          :value="value"
          :disabled="disabled"
          @change="onChange"
        />
        <span>{{ label }}</span>
      </label>
    </template>

    <!-- 텍스트 input -->
    <template v-else>
      <input
        :type="props.type"
        :class="inputClasses"
        :placeholder="props.placeholder"
        :disabled="disabled"
        :value="modelValue != null ? modelValue : ''"
        @input="onChange"
      />
    </template>
  </div>
</template>

<style scoped>
/* 공통 label */
.components-label {
  @apply flex items-center gap-2 cursor-pointer select-none;
}

/* 텍스트 input */
.input-base {
  @apply px-2.5 py-2.5 rounded placeholder-gray-400 outline-none border-b-2 transition-all duration-200 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed;
}

/* 체크박스 */
.components-checkbox-base {
  @apply appearance-none w-5 h-5 rounded-sm shadow-sm bg-white border border-gray-300 cursor-pointer transition-all duration-200 relative;
}
.components-checkbox-base:checked {
  @apply border-primary bg-primary;
  box-shadow: 0 0 3px rgba(0, 0, 140, 0.5);
}
.components-checkbox-base:checked::after {
  content: '';
  @apply absolute w-[5px] h-[10px] border-r-2 border-b-2 border-white rotate-45 top-[2px] left-[6px];
}

/* 라디오 버튼 */
.components-radio-base {
  @apply appearance-none w-5 h-5 rounded-full bg-white border border-gray-300 cursor-pointer transition-all duration-200 relative;
}
.components-radio-base:checked {
  @apply border-primary;
  box-shadow: 0 0 3px rgba(0, 0, 140, 0.5);
}
.components-radio-base:checked::after {
  content: '';
  @apply absolute w-[9px] h-[9px] rounded-full bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
}
</style>
