<script setup>
const props = defineProps({
  theme: { default: 'primary' },
  size: { default: 'md' }, 
})

// 크기별 공통 클래스
const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-6 py-2 text-base', 
  lg: 'px-12 py-2.5 text-lg',
}

// 테마별 클래스
const themeClasses = {
  primary: 'text-white bg-primary hover:bg-primary-hover',
  light: 'text-primary bg-white border border-primary hover:bg-gray-deep/50',
  gray: 'text-text bg-gray-deep hover:bg-[#c8c8c8]',
}

// 최종 클래스 조합
const baseClasses = 'rounded-md font-medium transition-colors duration-200'
</script>

<template>
  <button :class="[baseClasses, sizeClasses[size], themeClasses[theme]]">
    <slot>버튼</slot>
  </button>
</template>
