<template>
  <div class="standard-page-layout min-h-screen bg-bg-main p-6 md:p-10 lg:p-14">
    <!-- View Header -->
    <div v-if="loading" class="absolute top-0 left-0 w-full h-[3px] z-50 overflow-hidden bg-primary-main/10">
      <div class="h-full bg-primary-main animate-progress-glow"></div>
    </div>

    <BaseViewHeader :title="title" :subtitle="subtitle" :highlight="highlight">
      <template #title v-if="$slots.title">
        <slot name="title" />
      </template>
      <template #action v-if="$slots.action">
        <slot name="action" />
      </template>
    </BaseViewHeader>

    <!-- Content -->
    <main class="page-content animate-in fade-in slide-in-from-bottom-4 duration-700">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * StandardPageLayout Template
 * Provides a consistent structure for all feature pages.
 */
import BaseViewHeader from '../organisms/BaseViewHeader.vue'

defineProps<{
  title: string
  subtitle?: string
  highlight?: string
  loading?: boolean
}>()
</script>

<style scoped>
.standard-page-layout {
  /* Ensure smooth transitions between views */
  will-change: transform, opacity;
  position: relative;
}

@keyframes progress-glow {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-progress-glow {
  animation: progress-glow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  width: 100%;
}
</style>
