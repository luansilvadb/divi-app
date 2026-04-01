<template>
  <Teleport to="body">
    <Transition name="sheet" @after-leave="onAfterLeave" @enter="onEnter">
      <div
        v-if="show"
        role="dialog"
        aria-modal="true"
        class="sheet-wrapper fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden"
      >
        <!-- Backdrop -->
        <div
          class="sheet-backdrop absolute inset-0 bg-[#0e121b80] backdrop-blur-md cursor-pointer"
          aria-hidden="true"
          @click="handleClose"
        ></div>

        <!-- Content Card -->
        <div
          ref="sheetRef"
          class="sheet-content relative w-full bg-surface-main rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-black/5 dark:border-white/5 flex flex-col max-h-[90vh]"
          :style="sheetStyle"

        >
          <!-- Drag Handle -->
          <div class="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onTouchEnd">
            <div class="w-12 h-1.5 rounded-full bg-text-disabled/30"></div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 pb-8 touch-pan-y">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { animate } from 'motion'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const translateY = ref(0)
const lastY = ref(0)
const lastTime = ref(0)
const velocity = ref(0)

const sheetStyle = computed(() => {
  return {
    transform: `translate3d(0, ${translateY.value}px, 0)`,
    transition: isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)'
  }
})

// Prevent background scroll
watch(() => props.show, (newVal) => {
  if (typeof window !== 'undefined') {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = ''
  }
})

function handleClose() {
  emit('update:show', false)
}

function onAfterLeave() {
  emit('closed')
  translateY.value = 0 // Reset for next open
}

function onEnter() {
  translateY.value = 0
}

function onTouchStart(e: TouchEvent) {
  if (!e.touches.length) return
  isDragging.value = true
  startY.value = e.touches[0]?.clientY ?? 0
  currentY.value = startY.value
  lastY.value = startY.value
  lastTime.value = Date.now()
  velocity.value = 0

  // Pause any running motion animations if needed, though Vue transition handles open/close
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value || !e.touches.length) return

  const y = e.touches[0]?.clientY ?? 0
  const deltaY = y - startY.value

  // Calculate velocity
  const now = Date.now()
  const timeDelta = now - lastTime.value
  if (timeDelta > 0) {
    velocity.value = (y - lastY.value) / timeDelta
  }
  lastY.value = y
  lastTime.value = now

  if (deltaY > 0) {
    // Dragging down
    translateY.value = deltaY
  } else {
    // Dragging up (resistance)
    translateY.value = deltaY * 0.2 // 20% resistance
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  const sheetHeight = sheetRef.value?.clientHeight || window.innerHeight
  const threshold = sheetHeight * 0.3 // 30% height

  // If dragged past threshold OR flicked down fast
  if (translateY.value > threshold || velocity.value > 0.5) {
    // Dismiss
    if (sheetRef.value) {
      animate(
        sheetRef.value,
        { transform: `translate3d(0, ${sheetHeight}px, 0)` } as Record<string, unknown>,
        { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
      ).then(() => {
        handleClose()
      })
    } else {
      handleClose()
    }
  } else {
    // Snap back
    if (sheetRef.value) {
      animate(
        sheetRef.value,
        { transform: 'translate3d(0, 0px, 0)' } as Record<string, unknown>,
        { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
      ).then(() => {
        translateY.value = 0
      })
    } else {
      translateY.value = 0
    }
  }
}
</script>

<style scoped>
/* Transition orchestrating both backdrop and sheet */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-active .sheet-backdrop,
.sheet-leave-active .sheet-backdrop {
  transition: opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-active .sheet-content,
.sheet-leave-active .sheet-content {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet-backdrop,
.sheet-leave-to .sheet-backdrop {
  opacity: 0;
}

.sheet-enter-from .sheet-content,
.sheet-leave-to .sheet-content {
  transform: translate3d(0, 100%, 0);
}
</style>
