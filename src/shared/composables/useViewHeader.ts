import { ref, computed } from 'vue'

const pageTitle = ref('')
const pageHighlight = ref('')
const isHeaderVisible = ref(true)
const pageScrollY = ref(0) // Tracks exact scroll pixel for fluid connection

// SliverAppBar Constants
const EXPANDED_HEIGHT = 160
const COLLAPSED_HEIGHT = 64
const TRANSITION_DISTANCE = EXPANDED_HEIGHT - COLLAPSED_HEIGHT

export function useViewHeader() {
  const headerProgress = computed(() => {
    return Math.max(0, Math.min(1, pageScrollY.value / TRANSITION_DISTANCE))
  })

  const stretchScale = computed(() => {
    if (pageScrollY.value >= 0) return 1
    // 1.0 + (absolute pixels / 200) for a natural stretch feel
    return 1 + Math.abs(pageScrollY.value) / 250
  })

  return {
    pageTitle,
    pageHighlight,
    isHeaderVisible,
    pageScrollY,
    headerProgress,
    stretchScale,
    EXPANDED_HEIGHT,
    COLLAPSED_HEIGHT,

    setHeaderState(title: string, highlight?: string) {
      pageTitle.value = title
      pageHighlight.value = highlight || ''
    },

    setInView(isVisible: boolean) {
      isHeaderVisible.value = isVisible
    },

    setScrollY(y: number) {
      pageScrollY.value = y
    },
  }
}
