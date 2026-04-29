<template>
  <header
    class="global-header sticky top-0 z-40 w-full overflow-hidden"
    :style="headerRootStyle"
  >
    <!-- 1. Backdrop (Increased Opacity for Legibility) -->
    <div
      class="header-backdrop absolute inset-0 pointer-events-none transition-opacity duration-200"
      :style="headerBackdropStyle"
    >
      <!-- Semi-transparent Bottom Divider -->
      <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--surface-separator)] opacity-60"></div>
    </div>

    <!-- 2. Content Layer -->
    <div class="header-content relative z-10 w-full h-full px-6 flex flex-col justify-end pb-4">

        <!-- Actions -->
        <div class="header-actions absolute top-0 right-6 h-16 flex items-center gap-2 md:gap-4 z-30">
          <SyncStatusIndicator />

          <div class="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 opacity-20"></div>

          <button class="relative flex items-center justify-center w-8 h-8 rounded-full border border-separator bg-surface-primary/80 backdrop-blur-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all duration-150 active:scale-95 group">
            <i class="i-lucide-bell text-[0.9rem]"></i>
            <!-- Premium Notification Indicator -->
            <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
        </div>

      <!-- 3. High-Legibility Title -->
      <div class="title-wrapper w-full flex justify-center items-center relative overflow-visible h-14">
        <h2
          v-if="pageTitle"
          class="page-title text-zinc-950 dark:text-zinc-50 whitespace-nowrap select-none"
          :style="titleStyle"
        >
          <template v-if="pageHighlight">
        <span class="opacity-30 font-bold">{{ titleBefore }}</span>
            <span class="font-black px-1.5" :style="{ color: 'var(--color-primary)' }">{{ pageHighlight }}</span>
            <span class="opacity-30 font-bold">{{ titleAfter }}</span>
          </template>
          <template v-else>
            {{ pageTitle }}
          </template>
        </h2>
      </div>


    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SyncStatusIndicator from '@/shared/components/molecules/SyncStatusIndicator.vue'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const {
  pageTitle,
  pageHighlight,
  pageScrollY,
  headerProgress,
  stretchScale,
  EXPANDED_HEIGHT,
  COLLAPSED_HEIGHT
} = useViewHeader()

// --- Clean Performance Math ---

const currentHeight = computed(() => {
  const scroll = pageScrollY.value
  if (scroll <= 0) return EXPANDED_HEIGHT + Math.abs(scroll) * 0.5
  return Math.max(COLLAPSED_HEIGHT, EXPANDED_HEIGHT - scroll)
})

const headerRootStyle = computed(() => ({
  height: `${currentHeight.value}px`,
}))

const headerBackdropStyle = computed(() => {
  const p = headerProgress.value
  return {
    opacity: p,
    backdropFilter: `blur(${Math.min(12, p * 12)}px)`,
    // Seamless linear interpolation for premium glass feel
    backgroundColor: `rgba(242, 242, 247, ${0.4 + (p * 0.58)})`, 
    boxShadow: p > 0.9 ? '0 1px 0 var(--surface-separator)' : 'none',
    '--header-p': p
  }
})

const titleStyle = computed(() => {
  const p = headerProgress.value
  const s = stretchScale.value

  // LEGILE SCALE LOGIC:
  // Base font is 2.25rem (~36px).
  // We scale down to 0.6 at p=1, which is ~21.6px.
  // This is the "sweet spot" for a toolbar title.
  const baseScale = 1.0 - (p * 0.4)
  const scale = s > 1 ? s : baseScale

  // Vertical translation to perfectly hit the center of 64px bar
  const translateY = p * 14

  // Relax letter spacing as it gets smaller to avoid glyph collision
  const letterSpacing = p > 0.8 ? '-0.01em' : '-0.04em'

  return {
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
    transformOrigin: 'center bottom',
    // Maintain a strong weight for the small title
    fontWeight: p > 0.9 ? '800' : '900',
    fontSize: '2.25rem',
    letterSpacing,
    opacity: 1,
  }
})


// --- Logic ---

const titleParts = computed(() => {
  if (!pageHighlight.value) return { before: pageTitle.value, after: '' }
  const index = pageTitle.value.indexOf(pageHighlight.value)
  if (index === -1) return { before: pageTitle.value, after: '' }
  return {
    before: pageTitle.value.substring(0, index),
    after: pageTitle.value.substring(index + pageHighlight.value.length)
  }
})

const titleBefore = computed(() => titleParts.value.before)
const titleAfter = computed(() => titleParts.value.after)
</script>

<style scoped>
.global-header {
  will-change: height;
}

.page-title {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  text-rendering: optimizeLegibility;
  will-change: transform;
}

:global(.dark) .header-backdrop {
  background-color: rgba(0, 0, 0, calc(0.4 + var(--header-p, 0) * 0.58)) !important;
  box-shadow: 0 1px 0 rgba(84, 84, 88, calc(var(--header-p, 0) * 0.65)) !important;
}
</style>
