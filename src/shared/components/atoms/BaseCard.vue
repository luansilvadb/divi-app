<template>
  <div class="divi-card" :class="{ 'clickable': clickable }">
    <div v-if="$slots.header" class="divi-card-header">
      <slot name="header" />
    </div>
    <div class="divi-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="divi-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clickable?: boolean
}>()
</script>

<style scoped>
.divi-card {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.clickable:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.divi-card-header {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-weight: 600;
}
.divi-card-body {
  padding: 1rem;
}
.divi-card-footer {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
}
</style>
