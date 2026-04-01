<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden sm:hidden"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-[#0e121b80] backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
        @click="handleClose"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 300 } }"
        :leave="{ opacity: 0, transition: { duration: 200 } }"
      ></div>

      <!-- Content -->
      <div
        class="relative w-full bg-surface-main rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
        v-motion
        :initial="{ y: '100%' }"
        :enter="{ y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }"
        :leave="{ y: '100%', transition: { duration: 250, ease: 'easeIn' } }"
      >
        <!-- Drag Handle Indicator -->
        <div class="w-full flex justify-center pt-3 pb-2 shrink-0" @click="handleClose">
          <div class="w-12 h-1.5 rounded-full bg-white/20"></div>
        </div>

        <!-- Slot Content -->
        <div class="overflow-y-auto overflow-x-hidden flex-1 pb-safe">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

function handleClose() {
  emit('update:show', false)
  // Allow animation to finish before emitting closed
  setTimeout(() => {
    emit('closed')
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
</style>
