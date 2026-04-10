<template>
  <template v-if="isMobile">
    <Drawer
      :visible="show"
      @update:visible="handleClose"
      position="bottom"
      :modal="true"
      :dismissableMask="true"
      :closable="false"
      class="!w-full !h-auto border-t border-surface-200/10 rounded-t-[2rem] overflow-hidden !bg-surface-0 dark:!bg-surface-800"
      :ptOptions="{ mergeProps: true }"
      :pt="{
        root: { style: drawerStyle },
        mask: { class: '!z-[200]' },
        header: { class: '!p-0' },
        content: { class: '!p-0 overflow-y-auto !bg-surface-0 dark:!bg-surface-800' },
        pcCloseButton: { root: { class: '!hidden' } },
        closeButton: { class: '!hidden' }
      }"
    >
      <template #header>
        <div 
          class="relative w-full overflow-hidden border-b border-surface-200 dark:border-surface-800/10 bg-surface-0 dark:bg-surface-800 touch-pan-y"
          @touchstart="onTouchStartHeader"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Premium Strategic Overlay -->
          <div class="absolute inset-0 bg-primary/[0.04] pointer-events-none"></div>

          <div class="flex flex-col w-full relative z-10 px-6 py-5">
            <!-- Strategic Drag Handle -->
            <div class="w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full mb-4 mx-auto opacity-40"></div>

            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <h2 class="text-xl font-black text-surface-800 dark:text-surface-50 tracking-tight leading-none mb-1">
                  {{ transaction ? 'Editar Lançamento' : 'Novo Lançamento' }}
                </h2>
                <p class="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-surface-600 dark:text-surface-200 opacity-60">
                  REGISTRO FINANCEIRO
                </p>
              </div>

              <!-- More Integrated/Subtle Custom Close Button -->
              <BaseButton
                variant="ghost"
                @click="$emit('close')"
                :pt="{
                  root: {
                    class: 'w-10 h-10 !rounded-full !p-0 text-surface-600 dark:text-surface-200 hover:text-surface-800 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800/10 transition-all active:scale-95'
                  }
                }"
              >
                <i class="pi pi-times text-xl"></i>
              </BaseButton>
            </div>
          </div>
        </div>
      </template>

      <div 
        ref="scrollContainer"
        class="h-full max-h-[85vh] overflow-y-auto pb-safe bg-surface-0 dark:bg-surface-800 overscroll-none"
        @touchstart="onTouchStartContent"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <TransactionFormContent :initial-data="transaction" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </Drawer>
  </template>

  <template v-else>
    <Dialog
      :visible="show"
      @update:visible="handleClose"
      :modal="true"
      :dismissableMask="true"
      :closable="false"
      class="w-full max-w-xl border border-surface-200/10 overflow-hidden"
      :ptOptions="{ mergeProps: true }"
      :pt="{
        mask: { class: '!z-[50]' },
        header: { class: '!p-0' },
        content: { class: '!p-0' }
      }"
    >
      <template #header>
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none transition-opacity"></div>
        <div class="flex items-center justify-between w-full relative z-10 bg-primary/10 p-5 sm:p-7 border-b border-light/5 dark:border-surface-800/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner border border-primary/20 shrink-0">
              <i class="pi pi-plus text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-black text-surface-800 dark:text-surface-50 tracking-tight leading-tight">
                {{ transaction ? 'Editar Transação' : 'Nova Transação' }}
              </h2>
              <p class="text-[0.65rem] mt-1 font-black uppercase tracking-[0.2em] text-surface-600 dark:text-surface-200 opacity-40">
                Adicione um novo lançamento manual
              </p>
            </div>
          </div>
          <BaseButton
            variant="ghost"
            @click="$emit('close')"
            :pt="{ root: { class: 'w-10 h-10 !rounded-xl !p-0 bg-surface-50 dark:bg-surface-800/10 flex items-center justify-center text-surface-600 dark:text-surface-200 hover:text-surface-800 dark:hover:text-surface-50 hover:bg-surface-100 dark:hover:bg-surface-700/10 border border-surface-200 dark:border-surface-800/10 group shrink-0' } }"
          >
            <i class="pi pi-times text-lg"></i>
          </BaseButton>
        </div>
      </template>

      <div class="h-full pb-safe bg-surface-0 dark:bg-surface-800 bg-surface-800">
        <TransactionFormContent :initial-data="transaction" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </Dialog>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import BaseButton from '../atoms/BaseButton.vue'
import TransactionFormContent from './TransactionFormContent.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'

defineProps<{
  show: boolean
  transaction?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])

const isMobile = useIsMobile()

// --- Pull-to-Dismiss Touch Logic ---
const swipeOffset = ref(0)
const isDragging = ref(false)
const isSnappingBack = ref(false)

const drawerStyle = computed(() => {
  if (isDragging.value || isSnappingBack.value) {
    return {
      transform: `translateY(${swipeOffset.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }
  return undefined
})

let startY = 0
const scrollContainer = ref<HTMLElement | null>(null)

function onTouchStartHeader(e: TouchEvent) {
  startY = e.touches[0].clientY
  isDragging.value = true
  isSnappingBack.value = false
  swipeOffset.value = 0
}

function onTouchStartContent(e: TouchEvent) {
  // Only allow dragging the sheet down if the scroll container is at the absolute top.
  // Otherwise, let the user scroll the form normally.
  if (scrollContainer.value && scrollContainer.value.scrollTop > 0) {
    isDragging.value = false
    return
  }
  startY = e.touches[0].clientY
  isDragging.value = true
  isSnappingBack.value = false
  swipeOffset.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const currentY = e.touches[0].clientY
  const delta = currentY - startY
  if (delta > 0) {
    swipeOffset.value = delta
  } else {
    swipeOffset.value = 0
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (swipeOffset.value > 100) {
    handleClose(false)
    setTimeout(() => { swipeOffset.value = 0 }, 400)
  } else {
    swipeOffset.value = 0
    isSnappingBack.value = true
    setTimeout(() => { isSnappingBack.value = false }, 300)
  }
}
// -----------------------------------

function handleClose(value: boolean) {
  if (!value) {
    emit('close')
  }
}

function handleSaved() {
  emit('saved')
  emit('close')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>


