<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex flex-col justify-end"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 transition-opacity duration-300"
          :class="backdropOpacityClass"
          @click="close"
          aria-hidden="true"
        ></div>

        <!-- Sheet -->
        <div
          ref="sheetRef"
          class="relative w-full max-h-[90vh] bg-surface-main rounded-t-[1.5rem] shadow-2xl flex flex-col pointer-events-auto transform-gpu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bottom-sheet-title"
          :style="sheetStyle"
        >
          <!-- Drag Handle Area (Header) -->
          <div
            class="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @mousedown="onMouseDown"
          >
            <div class="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20"></div>
          </div>

          <!-- Content slot (Scrollable) -->
          <div class="flex-1 overflow-y-auto overscroll-contain">
             <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { spring } from 'motion'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}>()

const isOpen = ref(false)
const sheetRef = ref<HTMLElement | null>(null)

// Physics State
type SheetState = 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING' | 'DRAGGING'
const currentState = ref<SheetState>('CLOSED')

const position = ref(0) // 0 is fully open, 100 is fully closed (percentage or pixels? Let's use pixels for motion generator)
const sheetHeight = ref(0)

const FIXED_TIME_STEP = 1000 / 60 // 16.666ms

let animationFrameId = 0
let lastTime = 0
let accumulator = 0
let springGenerator: ReturnType<typeof spring> | null = null
let currentVelocity = 0

// Drag state
const isDragging = ref(false)
const startY = ref(0)
const startPosition = ref(0)
const lastDragY = ref(0)
const lastDragTime = ref(0)

const sheetStyle = computed(() => {
  return {
    transform: `translate3d(0, ${position.value}px, 0)`,
  }
})

const backdropOpacityClass = computed(() => {
  if (currentState.value === 'OPENING' || currentState.value === 'OPEN' || currentState.value === 'DRAGGING') {
    return 'opacity-100'
  }
  return 'opacity-0'
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    open()
  } else {
    close()
  }
})

onMounted(() => {
  window.addEventListener('resize', measureSheet)
  if (props.modelValue) {
    open()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', measureSheet)
  cancelAnimationFrame(animationFrameId)
})

function measureSheet() {
  if (sheetRef.value) {
    sheetHeight.value = sheetRef.value.offsetHeight
  } else {
    sheetHeight.value = window.innerHeight * 0.9 // fallback
  }
}

async function open() {
  if (currentState.value === 'OPEN' || currentState.value === 'OPENING') return

  isOpen.value = true
  currentState.value = 'OPENING'

  await nextTick()
  measureSheet()

  if (position.value === 0) {
      position.value = sheetHeight.value
  }

  startSpringAnimation(0, currentVelocity)
}

function close() {
  if (currentState.value === 'CLOSED' || currentState.value === 'CLOSING') return

  currentState.value = 'CLOSING'
  emit('update:modelValue', false)

  measureSheet()
  startSpringAnimation(sheetHeight.value, currentVelocity)
}

function startSpringAnimation(targetPosition: number, initialVelocity: number = 0) {
  cancelAnimationFrame(animationFrameId)

  // Motion's spring needs keyframes [from, to]
  springGenerator = spring({
    keyframes: [position.value, targetPosition],
    stiffness: 400,
    damping: 30,
    mass: 1,
    velocity: initialVelocity
  })

  lastTime = performance.now()
  accumulator = 0

  animationFrameId = requestAnimationFrame(physicsLoop)
}

function physicsLoop(time: number) {
  if (currentState.value === 'DRAGGING') return

  const deltaTime = time - lastTime
  lastTime = time

  // Cap deltaTime to avoid death spiral if tab is inactive
  if (deltaTime > 100) {
      accumulator += FIXED_TIME_STEP
  } else {
      accumulator += deltaTime
  }

  let isDone = false

  while (accumulator >= FIXED_TIME_STEP) {
    // Advance physics by exactly FIXED_TIME_STEP
    if (!springGenerator) return;
        const result = springGenerator.next(FIXED_TIME_STEP)
    position.value = result.value

    // Calculate instantaneous velocity roughly
    if (accumulator === FIXED_TIME_STEP) {
       // We only care about the final velocity if we interrupt it, but the generator maintains its own state.
    }

    if (result.done) {
      isDone = true
      break
    }

    accumulator -= FIXED_TIME_STEP
  }

  if (isDone) {
    if (currentState.value === 'CLOSING') {
      currentState.value = 'CLOSED'
      isOpen.value = false
      emit('closed')
      position.value = sheetHeight.value
    } else if (currentState.value === 'OPENING') {
      currentState.value = 'OPEN'
      position.value = 0
    }
    currentVelocity = 0
  } else {
    animationFrameId = requestAnimationFrame(physicsLoop)
  }
}

// --- Drag Gestures ---

function handleDragStart(y: number) {
  if (currentState.value === 'CLOSED') return

  cancelAnimationFrame(animationFrameId)
  currentState.value = 'DRAGGING'
  isDragging.value = true

  startY.value = y
  startPosition.value = position.value
  lastDragY.value = y
  lastDragTime.value = performance.now()
  currentVelocity = 0
}

function handleDragMove(y: number) {
  if (!isDragging.value) return

  const deltaY = y - startY.value
  let newPosition = startPosition.value + deltaY

  // Resistance when dragging up past 0
  if (newPosition < 0) {
    newPosition = newPosition * 0.2 // Rubber band effect
  }

  position.value = newPosition

  // Calculate velocity
  const now = performance.now()
  const timeDelta = now - lastDragTime.value
  if (timeDelta > 0) {
    // pixels per second = (pixels / ms) * 1000
    currentVelocity = ((y - lastDragY.value) / timeDelta) * 1000
  }

  lastDragY.value = y
  lastDragTime.value = now
}

function handleDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  measureSheet()

  const threshold = sheetHeight.value * 0.3

  // If dragged down past threshold OR fast downward velocity
  if (position.value > threshold || currentVelocity > 500) {
    close()
  } else {
    // Snap back up
    currentState.value = 'OPENING'
    startSpringAnimation(0, currentVelocity)
  }
}

// Touch Event Handlers
function onTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    handleDragStart(e.touches[0]?.clientY || 0)
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    handleDragMove(e.touches[0]?.clientY || 0)
  }
}

function onTouchEnd() {
  handleDragEnd()
}

// Mouse Event Handlers for desktop testing
function onMouseDown(e: MouseEvent) {
  handleDragStart(e.clientY)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  handleDragMove(e.clientY)
}

function onMouseUp() {
  handleDragEnd()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

</script>

<style scoped>
/* Basic entrance/exit transition for the entire component wrapping */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}
</style>
