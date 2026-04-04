<template>
  <component
    :is="isMobile ? BaseConfirmBottomSheet : BaseConfirmModal"
    :show="show"
    :title="title"
    :message="message"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BaseConfirmModal from './BaseConfirmModal.vue'
import BaseConfirmBottomSheet from './BaseConfirmBottomSheet.vue'

defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits(['confirm', 'cancel'])

const isMobile = useIsMobile()
</script>
