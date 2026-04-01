<template>
  <BottomSheet
    v-model="internalShow"
    @closed="$emit('close')"
    class="bottom-sheet-container"
    teleport-to="body"
  >
    <!-- Header Area (Premium Split) -->
    <div class="bg-primary-main/10 p-5 border-b border-black/5 dark:border-white/5 relative bg-surface-main dark:bg-surface-main text-text-primary rounded-t-[1.5rem]">
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none rounded-t-[1.5rem]"
      ></div>
      <div class="flex items-center justify-between relative z-10">
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-black text-text-primary tracking-tight leading-tight">
              Nova Transação
            </h2>
          </div>
        </div>
        <button
          @click="closeSheet"
          class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="group-hover:rotate-90 transition-transform duration-300"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Body Area -->
    <div class="bg-surface-main dark:bg-surface-main text-text-primary h-full">
      <TransactionFormContent @close="closeSheet" @saved="handleSaved" />
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
import TransactionFormContent from './TransactionFormContent.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'saved'])

const internalShow = computed({
  get: () => props.show,
  set: (val) => {
    if (!val) emit('close')
  }
})

function closeSheet() {
  internalShow.value = false
}

function handleSaved() {
  emit('saved')
  closeSheet()
}
</script>

<style>
/* Global override for this bottom sheet to ensure dark mode text color and higher z-index */
:root {
  --vsbs-background: var(--color-surface-main, #1b2234);
  --vsbs-border-radius: 1.5rem;
  --vsbs-backdrop-bg: rgba(0, 0, 0, 0.6);
  --vsbs-padding-x: 0;
  --vsbs-shadow-color: rgba(0, 0, 0, 0.5);
}

[data-vsbs-sheet] {
  z-index: 9999 !important;
}

[data-vsbs-backdrop] {
  z-index: 9998 !important;
}
</style>
