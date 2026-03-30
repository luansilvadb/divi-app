<template>
  <header class="view-header flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
    <!-- Page title and subtitle -->
    <div class="title-section flex flex-col gap-2">
      <h1 class="page-title text-4xl font-black tracking-tight text-text-primary m-0 leading-none">
        <slot name="title">
          <template v-if="highlight">
            <span v-if="titleBefore" class="opacity-80">{{ titleBefore }}</span>
            <span class="text-primary-main ml-1">{{ highlight }}</span>
            <span v-if="titleAfter" class="opacity-80 ml-1">{{ titleAfter }}</span>
          </template>
          <template v-else>
            {{ title }}
          </template>
        </slot>
      </h1>
      <p v-if="subtitle" class="page-subtitle text-base font-medium text-text-secondary m-0 max-w-2xl">
        {{ subtitle }}
      </p>
    </div>
    
    <!-- Action slot -->
    <div v-if="$slots.action" class="header-actions flex gap-3 transition-transform duration-300">
      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * BaseViewHeader Organism
 * Standard header for feature pages.
 */
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  highlight?: string
}>()

const titleBefore = computed(() => {
  if (!props.highlight) return props.title
  const index = props.title.indexOf(props.highlight)
  if (index === -1) return props.title
  return props.title.substring(0, index).trim()
})

const titleAfter = computed(() => {
  if (!props.highlight) return ''
  const index = props.title.indexOf(props.highlight)
  if (index === -1) return ''
  return props.title.substring(index + props.highlight.length).trim()
})
</script>
