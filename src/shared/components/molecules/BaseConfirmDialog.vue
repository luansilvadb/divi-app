<template>
  <template v-if="isMobile">
    <NDrawer
      :show="show"
      @update:show="handleClose"
      placement="bottom"
      :height="'auto'"
      class="!rounded-t-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950 overflow-hidden"
    >
      <div class="p-8 text-center flex flex-col items-center">
        <div class="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mb-8 opacity-50 shrink-0"></div>

        <div class="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-inner">
          <i class="i-lucide-trash-2 text-3xl"></i>
        </div>

        <h3 class="text-xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight mb-2">
          {{ title || 'Tem certeza?' }}
        </h3>
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 px-4">
          {{ message || 'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.' }}
        </p>

        <div class="w-full space-y-3 pb-safe">
          <NButton
            type="error"
            class="w-full !h-14 !rounded-2xl font-black uppercase text-xs tracking-widest !bg-red-500 !text-white shadow-xl shadow-red-500/30"
            @click="$emit('confirm')"
          >
            {{ confirmText || 'Excluir' }}
          </NButton>
          <NButton
            quaternary
            class="w-full !h-12 !rounded-2xl font-bold uppercase text-[10px] tracking-widest text-zinc-400"
            @click="$emit('cancel')"
          >
            {{ cancelText || 'Cancelar' }}
          </NButton>
        </div>
      </div>
    </NDrawer>
  </template>

  <template v-else>
    <NModal
      :show="show"
      @update:show="handleClose"
      preset="card"
      class="!max-w-[400px] !rounded-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
      :header-style="{ display: 'none' }"
      :content-style="{ padding: '0' }"
    >
      <div class="p-10 text-center flex flex-col items-center">
        <div class="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-inner relative">
          <div class="absolute inset-0 bg-red-500 blur-2xl opacity-10 animate-pulse"></div>
          <i class="i-lucide-trash-2 text-4xl relative z-10"></i>
        </div>

        <h3 class="text-2xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight mb-3">
          {{ title || 'Tem certeza?' }}
        </h3>
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 px-2">
          {{ message || 'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.' }}
        </p>

        <div class="grid grid-cols-2 gap-4 w-full">
          <NButton
            quaternary
            class="!h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300"
            @click="$emit('cancel')"
          >
            {{ cancelText || 'Cancelar' }}
          </NButton>
          <NButton
            type="error"
            class="!h-12 !rounded-xl font-black uppercase text-xs tracking-widest !bg-red-500 hover:!bg-red-600 !text-white shadow-lg shadow-red-500/20 transition-all duration-300"
            @click="$emit('confirm')"
          >
            {{ confirmText || 'Excluir' }}
          </NButton>
        </div>
      </div>
    </NModal>
  </template>
</template>

<script setup lang="ts">
import { NModal, NDrawer, NButton } from 'naive-ui'
import { useIsMobile } from '@/shared/composables/useIsMobile'

defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])
const isMobile = useIsMobile()

function handleClose(val: boolean) {
  if (!val) emit('cancel')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1.5rem);
}
</style>
