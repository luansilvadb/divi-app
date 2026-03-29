<template>
  <span
    class="divi-badge"
    :style="{ backgroundColor: color + '20', color: color, borderColor: color + '40' }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
}>(), {
  color: '#4f46e5'
})
</script>

<style scoped>
.divi-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  border-width: 1px;
}
</style>
