import { ref } from 'vue'

const pageTitle = ref('')
const pageHighlight = ref('')
const pageSubtitle = ref('')
const isHeaderVisible = ref(true)
const pageScrollY = ref(0) // Tracks exact scroll pixel for fluid connection

export function useViewHeader() {
  return {
    pageTitle,
    pageHighlight,
    pageSubtitle,
    isHeaderVisible,
    pageScrollY,
    
    setHeaderState(title: string, highlight?: string, subtitle?: string) {
      pageTitle.value = title
      pageHighlight.value = highlight || ''
      pageSubtitle.value = subtitle || ''
    },
    
    setInView(isVisible: boolean) {
      isHeaderVisible.value = isVisible
    },

    setScrollY(y: number) {
      pageScrollY.value = y
    }
  }
}
