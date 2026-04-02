<template>
  <BottomSheet
    ref="bottomSheetRef"
    @closed="$emit('cancel')"
    teleport-to="body"
  >
    <div class="bg-surface-main dark:bg-surface-main p-8 text-center flex flex-col items-center">
      <!-- Icon/Warning -->
      <div
        class="w-16 h-16 rounded-full bg-error-main/10 flex items-center justify-center text-error-main mb-6 border border-error-main/20 shadow-inner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>

      <h3 class="text-xl font-black text-text-primary tracking-tight mb-2">
        {{ title || 'Tem certeza?' }}
      </h3>
      <p class="text-sm font-medium text-text-secondary leading-relaxed opacity-70 mb-8">
        {{
          message ||
          'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.'
        }}
      </p>

      <!-- Action Buttons -->
      <div class="w-full space-y-3 pb-8">
        <BaseButton
          variant="danger"
          class="w-full !py-4 font-black uppercase text-[0.7rem] tracking-[0.15em]"
          @click="$emit('confirm')"
        >
          {{ confirmText || 'Excluir' }}
        </BaseButton>
        <BaseButton
          variant="ghost"
          class="w-full !py-4 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100"
          @click="closeSheet"
        >
          {{ cancelText || 'Cancelar' }}
        </BaseButton>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
import BaseButton from '../atoms/BaseButton.vue'

const props = defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

const bottomSheetRef = ref<InstanceType<typeof BottomSheet>>()

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      bottomSheetRef.value?.open()
    } else {
      bottomSheetRef.value?.close()
    }
  }
)

function closeSheet() {
  bottomSheetRef.value?.close()
  emit('cancel')
}
</script>

<style>
:root {
  --vsbs-background: var(--color-surface-main, #1b2234);
  --vsbs-border-radius: 1.5rem;
  --vsbs-backdrop-bg: rgba(0, 0, 0, 0.6);
}
</style>
