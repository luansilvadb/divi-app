<template>
  <header class="global-header sticky top-0 z-40">
    <!-- Synced Glass Background Plate -->
    <div 
      class="absolute inset-0 bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200/50 dark:border-surface-800 pointer-events-none transition-none"
      :style="{ opacity: stickyTitleOpacity }"
    ></div>

    <!-- Content -->
    <div class="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 w-full h-full">
      <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0 h-8">
        <h2
          v-show="pageTitle"
          class="text-[1.1rem] font-black tracking-tight text-surface-800 dark:text-surface-50 truncate flex items-center gap-1.5 origin-left"
          :style="{ opacity: stickyTitleOpacity, transform: `translateY(${stickyTitleY}px)`, pointerEvents: stickyTitleOpacity > 0 ? 'auto' : 'none' }"
        >
          <template v-if="pageHighlight">
            <span v-if="titleBefore" class="opacity-80">{{ titleBefore }}</span>
            <span class="text-primary">{{ pageHighlight }}</span>
            <span v-if="titleAfter" class="opacity-80">{{ titleAfter }}</span>
          </template>
          <template v-else>
            {{ pageTitle }}
          </template>
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <SyncStatusIndicator />

        <!-- Placeholder for other global actions like notifications -->
        <div class="h-8 w-[1px] bg-surface-50 dark:bg-surface-800/10 mx-1"></div>

        <button
          class="flex items-center justify-center w-9 h-9 rounded-xl bg-white/50 dark:bg-surface-800/10 border border-surface-200 dark:border-surface-800/10 text-surface-600 dark:text-surface-200 hover:text-surface-800 dark:text-surface-50 transition-colors"
        >
          <i class="pi pi-bell text-[1.1rem]"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SyncStatusIndicator from '@/shared/components/molecules/SyncStatusIndicator.vue'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const { pageTitle, pageHighlight, pageScrollY } = useViewHeader()

const stickyTitleOpacity = computed(() => {
  if (pageScrollY.value <= 60) return 0
  const opacity = (pageScrollY.value - 60) / 20 // Reaches 1 at 80
  return Math.max(0, Math.min(1, opacity))
})

const stickyTitleY = computed(() => {
  if (pageScrollY.value > 80) return 0
  const y = 5 - ((pageScrollY.value - 60) / 20) * 5
  return Math.max(0, y)
})

const titleBefore = computed(() => {
  if (!pageHighlight.value) return pageTitle.value
  const index = pageTitle.value.indexOf(pageHighlight.value)
  if (index === -1) return pageTitle.value
  return pageTitle.value.substring(0, index).trim()
})

const titleAfter = computed(() => {
  if (!pageHighlight.value) return ''
  const index = pageTitle.value.indexOf(pageHighlight.value)
  if (index === -1) return ''
  return pageTitle.value.substring(index + pageHighlight.value.length).trim()
})
</script>

<style scoped>
.global-header {
  min-height: 56px;
}

@media (min-width: 768px) {
  .global-header {
    min-height: 64px;
  }
}
</style>

