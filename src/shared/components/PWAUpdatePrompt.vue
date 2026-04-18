<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'
import { NButton, useMessage } from 'naive-ui'

const message = useMessage()

const {
  offlineReady,
  needRefresh,
  updateServiceWorker
} = useRegisterSW({
  onRegistered(r) {
    console.log('[PWA] Service Worker registered')
  },
  onRegisterError(error) {
    console.error('[PWA] Service Worker registration error', error)
  }
})

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}

// Opcional: Mostrar uma mensagem silenciosa quando estiver pronto para offline
watch(offlineReady, (ready) => {
  if (ready) {
    message.success('App pronto para uso offline', {
      duration: 3000
    })
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="needRefresh"
      class="fixed bottom-4 right-4 z-9999 max-w-sm border-1 border-solid border-[#F59E0B] bg-[#020617] p-4 shadow-2xl"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 pt-1">
          <div class="i-lucide-cloud-download text-2xl text-[#F59E0B]"></div>
        </div>
        <div class="flex-grow">
          <h3 class="m-0 font-mono text-sm font-bold uppercase tracking-wider text-[#F59E0B]">
            ATUALIZAÇÃO TÉCNICA
          </h3>
          <p class="mt-1 font-mono text-xs leading-relaxed text-slate-300">
            Uma nova versão do motor Divi está disponível. Reinicie para aplicar as melhorias de resiliência.
          </p>
          <div class="mt-4 flex gap-3">
            <n-button
              size="small"
              type="warning"
              ghost
              class="font-mono! text-xs!"
              @click="updateServiceWorker()"
            >
              EXECUTAR UPDATE
            </n-button>
            <n-button
              size="small"
              quaternary
              class="font-mono! text-xs! text-slate-400!"
              @click="close"
            >
              IGNORAR
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Forçar estilo brutalista no botão do Naive UI */
:deep(.n-button) {
  border-radius: 0;
}
</style>
