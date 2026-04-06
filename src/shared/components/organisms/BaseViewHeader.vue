<template>
  <header
    class="view-header flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-12 gap-6"
  >
    <!-- Page title and subtitle -->
    <div class="title-section flex flex-col gap-2 md:gap-3 w-full md:w-auto">
      <h1 class="page-title text-[1.8rem] xs:text-[2rem] md:text-5xl font-black tracking-tighter text-text-primary m-0 leading-tight md:leading-none whitespace-nowrap overflow-hidden text-ellipsis">
        <slot name="title">
          <div class="inline-flex items-center flex-wrap md:flex-nowrap gap-x-1.5">
            <template v-if="highlight">
              <span v-if="titleBefore" class="opacity-80">{{ titleBefore }}</span>
              <span class="text-primary-main">{{ highlight }}</span>
              <span v-if="titleAfter" class="opacity-80">{{ titleAfter }}</span>
            </template>
            <template v-else>
              {{ title }}
            </template>
          </div>
        </slot>
      </h1>
      <p
        v-if="subtitle"
        class="page-subtitle text-xs md:text-base font-medium text-text-secondary/60 m-0 max-w-2xl leading-relaxed"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- Action slot -->
    <div v-if="$slots.action" class="header-actions flex justify-end transition-transform duration-300 w-full md:w-auto">
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
