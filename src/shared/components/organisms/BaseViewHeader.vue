<template>
  <header
    ref="headerRef"
    class="view-header-wrapper relative flex flex-col md:block"
  >
    <!-- Action slot (pinned to top right) -->
    <div
      v-if="$slots.action"
      class="header-actions flex justify-start md:justify-end transition-transform duration-300 w-full md:w-auto md:absolute md:right-0 md:top-0 z-30"
    >
      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * BaseViewHeader Organism
 * Standard header for feature pages. Acts as a Sliver Spacer.
 */
import { ref, watch, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const props = defineProps<{
  title: string
  highlight?: string
}>()

const headerRef = ref<HTMLElement | null>(null)
const { setHeaderState, setInView } = useViewHeader()

watch(
  () => [props.title, props.highlight],
  ([t, h]) => {
    setHeaderState(t as string, h as string)
  },
  { immediate: true },
)

onMounted(() => {
  useIntersectionObserver(
    headerRef,
    (entries) => {
      const entry = entries[0]
      if (entry) {
        setInView(entry.isIntersecting)
      }
    },
    { threshold: 0, rootMargin: '-10px 0px 0px 0px' },
  )
})
</script>
