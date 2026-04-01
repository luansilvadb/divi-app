<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden sm:hidden"
    >
      <!-- Backdrop -->
      <div
        ref="backdropRef"
        class="absolute inset-0 bg-[#0e121b80] backdrop-blur-md opacity-0"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Content -->
      <div
        ref="sheetRef"
        class="relative w-full bg-surface-main rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] bottom-sheet-content translate-y-full"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- Drag Handle Indicator -->
        <div
          class="w-full flex justify-center pt-4 pb-3 shrink-0 cursor-grab active:cursor-grabbing focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main/50 rounded-t-3xl"
          role="button"
          aria-label="Fechar"
          tabindex="0"
          @click="handleClose"
          @keydown.enter="handleClose"
          @keydown.space.prevent="handleClose"
        >
          <div class="w-12 h-1.5 rounded-full bg-white/20 transition-colors hover:bg-white/40 active:bg-white/60 pointer-events-none"></div>
        </div>

        <!-- Slot Content -->
        <div class="overflow-y-auto overflow-x-hidden flex-1 pb-safe overscroll-contain px-1">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { animate, spring } from 'motion'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

const isVisible = ref(props.show)
const backdropRef = ref<HTMLElement | null>(null)
const sheetRef = ref<HTMLElement | null>(null)

// Animation configs
const springConfig = { stiffness: 400, damping: 30, mass: 1 }

watch(() => props.show, async (newVal) => {
  if (newVal) {
    isVisible.value = true
    await nextTick()

    // Animate in
    if (backdropRef.value) {
      animate(backdropRef.value, { opacity: [0, 1] }, { duration: 0.3 })
    }

    if (sheetRef.value) {
      animate(
        sheetRef.value,
        { y: ['100%', '0%'] },
        { type: 'spring', ...springConfig }
      )
    }
  } else {
    // Animate out
    const animations = []

    if (backdropRef.value) {
      animations.push(
        animate(backdropRef.value, { opacity: 0 }, { duration: 0.3 })
      )
    }

    if (sheetRef.value) {
      // Use offset state if dragging
      const currentY = parseFloat(sheetRef.value.style.transform.replace(/[^0-9.]/g, '')) || 0
      const startPos = currentY ? `${currentY}px` : '0%'

      animations.push(
        animate(
          sheetRef.value,
          { y: [startPos, '100%'] },
          { type: 'spring', stiffness: 300, damping: 35 }
        )
      )
    }

    // Wait for all to finish
    await Promise.all(animations)
    isVisible.value = false
    emit('closed')
  }
})

// Touch drag state
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
let activeDragAnimation: any = null

function onTouchStart(e: TouchEvent) {
  // Only start drag if we are at the top of the scrollable content
  const target = e.target as HTMLElement
  const scrollableParent = target.closest('.overflow-y-auto')

  if (scrollableParent && scrollableParent.scrollTop > 0) {
    return
  }

  const touch = e.touches[0]
  if (!touch) return

  // Cancel any ongoing spring animation
  if (activeDragAnimation) {
    activeDragAnimation.stop()
  }

  startY.value = touch.clientY
  currentY.value = touch.clientY
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return

  const touch = e.touches[0]
  if (!touch) return

  const y = touch.clientY
  const offset = y - startY.value

  if (offset > 0) {
    const target = e.target as HTMLElement
    if (target.closest('.cursor-grab')) {
       e.preventDefault()
    }

    // Set direct transform for 0 latency drag
    if (sheetRef.value) {
      sheetRef.value.style.transform = `translateY(${offset}px)`
    }
  }

  currentY.value = y
}

function onTouchEnd() {
  if (!isDragging.value) return

  isDragging.value = false
  const offset = currentY.value - startY.value

  if (!sheetRef.value) return

  // If dragged down more than 100px, close it
  if (offset > 100) {
    handleClose()
  } else {
    // Spring back to 0
    activeDragAnimation = animate(
      sheetRef.value,
      { y: [`${offset}px`, '0px'] },
      { type: 'spring', ...springConfig }
    )

    activeDragAnimation.then(() => {
      if (sheetRef.value) {
        sheetRef.value.style.transform = ''
      }
    }).catch(() => {})
  }
}

function handleClose() {
  emit('update:show', false)
  // Animation handles the rest via watch
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown)
  if (props.show) {
    isVisible.value = true
    await nextTick()
    if (backdropRef.value) animate(backdropRef.value, { opacity: 1 }, { duration: 0 })
    if (sheetRef.value) animate(sheetRef.value, { y: '0%' }, { duration: 0 })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
.bottom-sheet-content {
  backface-visibility: hidden;
  will-change: transform;
}
</style>
