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
      <!-- Solid Bottom Border -->
      <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-300 dark:bg-zinc-800"></div>
    </div>

    <!-- 2. Content Layer -->
    <div class="header-content relative z-10 w-full h-full px-6 flex flex-col justify-end pb-4">
      
        <!-- Actions -->
        <div class="header-actions absolute top-0 right-6 h-16 flex items-center gap-2 md:gap-4 z-30">
          <SyncStatusIndicator class="scale-90" />
          
          <div class="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 opacity-20"></div>
  
          <!-- 1. Toolbar Action Button (Visible ONLY when collapsed) -->
          <NButton 
            v-if="!isDashboardPage"
            type="primary" 
            secondary
            circle 
            size="medium"
            class="!bg-violet-500/10 !text-violet-600 dark:!text-violet-400 hover:!bg-violet-500 hover:!text-white transition-all duration-300 shadow-sm"
            :style="collapsedButtonStyle"
            @click="handlePrimaryAction"
          >
            <template #icon>
              <i class="i-lucide-plus text-xl font-bold"></i>
            </template>
          </NButton>
  
          <button class="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
            <i class="i-lucide-bell text-lg"></i>
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
            <span class="text-violet-700 dark:text-violet-400 font-black px-1.5">{{ pageHighlight }}</span>
            <span class="opacity-30 font-bold">{{ titleAfter }}</span>
          </template>
          <template v-else>
            {{ pageTitle }}
          </template>
        </h2>
      </div>

      <!-- 4. Expanded Normal Button (Far Right on Desktop) -->
      <div 
        class="expanded-button-container absolute bottom-4 right-6 hidden md:flex z-30"
        :style="expandedButtonStyle"
      >
        <NButton
          v-if="pageTitle && !isDashboardPage"
          type="primary"
          size="large"
          round
          class="!bg-violet-500 hover:!bg-violet-600 shadow-lg shadow-violet-500/20 px-8 transition-colors duration-300"
          @click="handlePrimaryAction"
        >
          <template #icon>
            <i class="i-lucide-plus font-bold"></i>
          </template>
          {{ primaryActionLabel }}
        </NButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NButton } from 'naive-ui'
import SyncStatusIndicator from '@/shared/components/molecules/SyncStatusIndicator.vue'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const route = useRoute()
const {
  pageTitle,
  pageHighlight,
  pageScrollY,
  headerProgress,
  stretchScale,
  EXPANDED_HEIGHT,
  COLLAPSED_HEIGHT
} = useViewHeader()

const emit = defineEmits<{
  (e: 'new-transaction'): void
  (e: 'new-budget'): void
}>()

// --- Dynamic Button Logic ---

const isBudgetsPage = computed(() => route.name === 'budgets')
const isDashboardPage = computed(() => route.name === 'dashboard')

const primaryActionLabel = computed(() => 
  isBudgetsPage.value ? 'Novo Orçamento' : 'Nova Transação'
)

const handlePrimaryAction = () => {
  if (isBudgetsPage.value) {
    emit('new-budget')
  } else {
    emit('new-transaction')
  }
}

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
    // Very high opacity to ensure the small title has a clean background
    backgroundColor: p > 0.8 ? 'rgba(252, 252, 252, 0.98)' : 'rgba(252, 252, 252, 0.4)',
    boxShadow: p > 0.9 ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
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

// --- Button Dynamic Styles ---

const collapsedButtonStyle = computed(() => {
  const p = headerProgress.value
  // Button appears only at the final stage of collapse (0.7 -> 1)
  const opacity = Math.max(0, (p - 0.7) / 0.3)
  const scale = 0.5 + (opacity * 0.5)
  return {
    opacity,
    transform: `scale(${scale})`,
    pointerEvents: (opacity > 0 ? 'auto' : 'none') as any
  }
})

const expandedButtonStyle = computed(() => {
  const p = headerProgress.value
  // Button disappears quickly (0 -> 0.4)
  const opacity = Math.max(0, 1 - (p / 0.4))
  const scale = 0.8 + (opacity * 0.2)
  return {
    opacity,
    transform: `scale(${scale})`,
    pointerEvents: (opacity > 0 ? 'auto' : 'none') as any
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
  background-color: rgba(9, 9, 11, 0.98) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
}
</style>
