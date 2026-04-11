<template>
  <header class="global-header sticky top-0 z-40">
    <!-- Modern Glass Background Plate -->
    <div
      class="absolute inset-0 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800 pointer-events-none transition-opacity duration-300"
      :style="{ opacity: stickyTitleOpacity }"
    ></div>

    <!-- Content -->
    <div
      class="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 w-full h-full"
    >
      <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0 h-8">
        <h2
          v-show="pageTitle"
          class="text-[1.1rem] font-bold tracking-tight text-zinc-800 dark:text-zinc-50 truncate flex items-center gap-1.5 origin-left"
          :style="{
            opacity: stickyTitleOpacity,
            transform: `translateY(${stickyTitleY}px)`,
            pointerEvents: stickyTitleOpacity > 0 ? 'auto' : 'none',
          }"
        >
          <template v-if="pageHighlight">
            <span v-if="titleBefore" class="opacity-60">{{ titleBefore }}</span>
            <span class="text-violet-500">{{ pageHighlight }}</span>
            <span v-if="titleAfter" class="opacity-60">{{ titleAfter }}</span>
          </template>
          <template v-else>
            {{ pageTitle }}
          </template>
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <SyncStatusIndicator />

        <div class="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

        <NButton quaternary circle size="small">
          <template #icon>
            <i class="i-lucide-bell text-lg"></i>
          </template>
        </NButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import SyncStatusIndicator from '@/shared/components/molecules/SyncStatusIndicator.vue'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const { pageTitle, pageHighlight, pageScrollY } = useViewHeader()

const stickyTitleOpacity = computed(() => {
  if (pageScrollY.value <= 40) return 0
  const opacity = (pageScrollY.value - 40) / 20
  return Math.max(0, Math.min(1, opacity))
})

const stickyTitleY = computed(() => {
  if (pageScrollY.value > 60) return 0
  const y = 5 - ((pageScrollY.value - 40) / 20) * 5
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
