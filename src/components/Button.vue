<script setup>
const props = defineProps({
  theme: { default: 'primary' }
})

// 모든 버튼에 공통으로 적용될 기본 클래스
const baseClasses = 'px-12 py-2.5 rounded'

// 테마별로 달라지는 부분만 정의
const themeClasses = {
  primary: 'text-white bg-[#00008C] hover:bg-[#000057]',
  light: 'text-[#00008C] bg-white border border-[#00008C] hover:bg-[#DDDDDD]'
}
</script>

<template>
  <button :class="[baseClasses, themeClasses[theme]]">
    <slot>버튼</slot>
  </button>
</template>


