<template>
  <Teleport to="body">
    <Transition name="sheet" :duration="400" @after-leave="$emit('closed')">
      <div
        v-if="show"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden sm:hidden"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[#0e121b80] backdrop-blur-md backdrop-bg transition-opacity duration-300"
          aria-hidden="true"
          @click="handleClose"
        ></div>

        <!-- Content -->
        <div
          class="relative w-full bg-surface-main rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] bottom-sheet-content transition-transform duration-300"
          :style="computedStyle"
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

// Touch drag state
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

const computedStyle = computed(() => {
  const offset = currentY.value - startY.value > 0 ? currentY.value - startY.value : 0

  if (!isDragging.value && offset === 0) {
    return {
      transform: '',
      // Let CSS handle the transition when returning to 0 or mounting
    }
  }

  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: 'transform'
  }
})

function onTouchStart(e: TouchEvent) {
  // Only start drag if we are at the top of the scrollable content
  const target = e.target as HTMLElement
  const scrollableParent = target.closest('.overflow-y-auto')

  if (scrollableParent && scrollableParent.scrollTop > 0) {
    return
  }

  const touch = e.touches[0]
  if (!touch) return

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
  }

  currentY.value = y
}

function onTouchEnd() {
  if (!isDragging.value) return

  isDragging.value = false
  const offset = currentY.value - startY.value

  // If dragged down more than 100px, close it
  if (offset > 100) {
    handleClose()
  } else {
    // Spring back
    startY.value = 0
    currentY.value = 0
  }
}

function handleClose() {
  emit('update:show', false)
  // Ensure drag offsets are reset so next time it opens cleanly
  setTimeout(() => {
    startY.value = 0
    currentY.value = 0
  }, 300)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
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
  perspective: 1000px;
}

/* Base Transition using Vue's specific transition classes */
/* Target internal components natively so they animate in sync */

.sheet-enter-active .backdrop-bg,
.sheet-leave-active .backdrop-bg {
  transition: opacity 0.3s ease;
}

.sheet-enter-from .backdrop-bg,
.sheet-leave-to .backdrop-bg {
  opacity: 0;
}

.sheet-enter-active .bottom-sheet-content {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-leave-active .bottom-sheet-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-enter-from .bottom-sheet-content,
.sheet-leave-to .bottom-sheet-content {
  transform: translate3d(0, 100%, 0);
}
</style>
