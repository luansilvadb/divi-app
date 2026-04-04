<template>
  <Dialog
    :visible="show"
    @update:visible="handleClose"
    modal
    dismissableMask
    :closable="false"
    :showHeader="false"
    class="!bg-transparent !border-none !shadow-none w-full max-w-xl p-4 sm:p-6"
    :pt="{
        root: { class: 'modal-wrapper flex items-center justify-center overflow-y-auto overflow-x-hidden' },
        mask: { class: 'modal-backdrop bg-[#0e121b80] backdrop-blur-md transition-all duration-500' },
        content: { class: 'modal-content relative w-full z-[160] !p-0 !bg-transparent' }
    }"
  >
    <slot />
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'closed'])

function handleClose(value: boolean) {
  emit('update:show', value)
  if (!value) {
    emit('closed')
  }
}
</script>

<style>
.p-dialog-mask {
  z-index: 150 !important;
}
.p-dialog {
  z-index: 160 !important;
}
</style>
