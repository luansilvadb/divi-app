<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-wrapper fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
    >
      <!-- Backdrop -->
      <div
        class="modal-backdrop fixed inset-0 bg-[#0e121b80] backdrop-blur-md transition-all duration-500"
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
defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

function handleClose() {
  emit('update:show', false)
  emit('closed')
}
</script>

<style scoped>
.modal-wrapper {
  perspective: 1000px;
}
</style>
