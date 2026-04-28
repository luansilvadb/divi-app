<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated'
  padding?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'medium'
})
</script>

<template>
  <div :class="['apple-card', `apple-card--${variant}`, `apple-card--${padding}`]">
    <slot />
  </div>
</template>

<style scoped>
.apple-card {
  background-color: #ffffff;
  border-radius: 18px;
  transition: all 0.2s ease;
  width: 100%;
}

/* Variant: Default */
.apple-card--default {
  background-color: #ffffff;
}

/* Variant: Elevated */
.apple-card--elevated {
  background-color: #f5f5f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Padding: Small */
.apple-card--small {
  padding: 12px;
}

/* Padding: Medium */
.apple-card--medium {
  padding: 20px;
}

/* Padding: Large */
.apple-card--large {
  padding: 24px;
}

/* Hover effect for interactive cards */
.apple-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
