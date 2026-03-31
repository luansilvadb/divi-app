<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      class="modal-wrapper fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
    >
      <!-- Backdrop -->
      <div
        class="modal-backdrop fixed inset-0 bg-[#0e121b80] backdrop-blur-md transition-all duration-500"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Content Card -->
      <div class="modal-content relative w-full max-w-xl z-[160]">
        <slot />
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
  emit('closed')
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
.modal-wrapper {
  perspective: 1000px;
}
</style>
