<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden sm:hidden"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[#0e121b80] backdrop-blur-md"
          aria-hidden="true"
          @click="handleClose"
        ></div>

        <!-- Content -->
        <Transition name="slide-up" @after-leave="onAfterLeave">
          <div
            v-if="isVisible"
            class="relative w-full bg-surface-main rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] bottom-sheet-content"
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
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

// Internal visibility to handle exit animation
const isVisible = ref(props.show)

watch(() => props.show, (newVal) => {
  if (newVal) {
    isVisible.value = true
  } else {
    // Let the transition handle the exit, then set isVisible false
    isVisible.value = false
  }
})

// Touch drag state
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

const computedStyle = computed(() => {
  const offset = currentY.value - startY.value > 0 ? currentY.value - startY.value : 0

  if (!isDragging.value && offset === 0) {
    return {
      transform: '',
      transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
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

  // If user tries to scroll down inside content but we are dragging the sheet down
  if (offset > 0) {
    // Don't prevent default on the whole sheet, just the drag movement
    // The browser will natively handle the scroll if it's not prevented,
    // but we only trigger drag if scrollTop === 0, so dragging down is safe.
    // If the target is the drag handle, we can prevent default.
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
  // Start closing animation
  emit('update:show', false)
  // reset positions
  startY.value = 0
  currentY.value = 0
}

function onAfterLeave() {
  emit('closed')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (props.show) isVisible.value = true
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>
