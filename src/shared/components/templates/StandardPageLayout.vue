<template>
  <div class="standard-page-layout min-h-screen bg-bg-main p-6 md:p-10 lg:p-14">
    <!-- View Header -->
    <BaseViewHeader
      :title="title"
      :subtitle="subtitle"
      :highlight="highlight"
    >
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
}>()
</script>

<style scoped>
.standard-page-layout {
  /* Ensure smooth transitions between views */
  will-change: transform, opacity;
}
</style>
