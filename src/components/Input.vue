<script setup>
const baseClasses = `
  px-2.5 py-2.5 rounded font-mont
  placeholder-gray-400
  outline-none border-b-2
  transition-all duration-200
  focus:border-[#00008C]
  disabled:bg-gray-100 disabled:cursor-not-allowed
`
</script>

<template>
  <!-- <input :class="[baseClasses]"/> -->
  <input class="input-base"/>
</template>
