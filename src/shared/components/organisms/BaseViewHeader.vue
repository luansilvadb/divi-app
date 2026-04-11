<template>
  <header ref="headerRef" class="view-header-wrapper mb-6 md:mb-10 relative flex flex-col md:block">
    <!-- Page title and subtitle -->
    <div
      class="title-section flex flex-col gap-2 md:gap-3 w-full md:w-auto mt-2 origin-left transition-none z-10"
      :style="{
        opacity: headerOpacity,
        transform: `scale(${headerScale})`,
        willChange: 'opacity, transform',
      }"
    >
      <h1
        class="page-title text-[1.6rem] xs:text-[1.8rem] md:text-[2.5rem] font-black tracking-tighter text-surface-800 dark:text-surface-50 m-0 leading-[1.1] md:leading-none whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <slot name="title">
          <div class="inline-flex items-center flex-wrap md:flex-nowrap gap-x-1.5">
            <template v-if="highlight">
              <span v-if="titleBefore" class="opacity-80">{{ titleBefore }}</span>
              <span class="text-primary">{{ highlight }}</span>
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
        class="page-subtitle text-[0.7rem] md:text-sm font-medium text-surface-600/60 dark:text-surface-200/60 m-0 max-w-2xl leading-relaxed"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- Action slot -->
    <div
      v-if="$slots.action"
      class="header-actions flex justify-start md:justify-end transition-transform duration-300 w-full md:w-auto mt-6 md:mt-0 md:absolute md:right-0 md:top-0 h-auto md:h-10"
    >
      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * BaseViewHeader Organism
 * Standard header for feature pages.
 */
import { computed, ref, watch, onMounted } from 'vue'
import { useIntersectionObserver, useScroll } from '@vueuse/core'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const props = defineProps<{
  title: string
  subtitle?: string
  highlight?: string
}>()

const headerRef = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const { setHeaderState, setInView, setScrollY } = useViewHeader()

onMounted(() => {
  scrollContainer.value = document.getElementById('main-scroll-container')
})

const { y: scrollY } = useScroll(scrollContainer)

watch(scrollY, (val) => {
  setScrollY(val)
})

const headerOpacity = computed(() => {
  if (scrollY.value <= 40) return 1
  const opacity = 1 - (scrollY.value - 40) / 20 // Fades entirely to 0 at 60px
  return Math.max(0, Math.min(1, opacity))
})

const headerScale = computed(() => {
  if (scrollY.value <= 40) return 1
  const scale = 1 - (scrollY.value - 40) / 250 // Shrinks very slightly for a subtle "sinking" depth effect
  return Math.max(0.85, scale)
})

watch(
  () => [props.title, props.highlight, props.subtitle],
  ([t, h, s]) => {
    setHeaderState(t as string, h as string, s as string)
  },
  { immediate: true },
)

onMounted(() => {
  // Use a -40px top margin to trigger "out of view" when it crosses under the global header line
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
