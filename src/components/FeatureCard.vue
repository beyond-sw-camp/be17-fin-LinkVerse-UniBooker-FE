<script setup>
defineProps({
  title: String,
  bgColor: {
    type: String,
    default: 'bg-[#B8D4FF]',
  },
})
</script>

<template>
  <div :class="[bgColor, 'feature-card']">
    <h3 class="feature-title">{{ title }}</h3>
    <div class="feature-icon">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  @apply rounded-3xl p-8 flex flex-col items-start justify-between h-80 p-6
         hover:scale-105 transition-all duration-300 cursor-pointer shadow-md;
}

.feature-icon {
  @apply text-6xl ml-12;
}

.feature-title {
  @apply text-xl font-bold text-text;
}
</style>
