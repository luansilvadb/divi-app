<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      >
        <transition
          enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
          enter-from-class="transform scale-95 opacity-0 translate-y-4"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
        >
          <div
            v-if="show"
            class="w-full max-w-sm bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
          >
            <!-- Simple Header -->
            <div class="p-8 text-center">
              <div
                class="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mx-auto mb-6"
              >
                <i class="pi pi-trash text-2xl"></i>
              </div>

              <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-2">
                Excluir Orçamento?
              </h3>
              <p class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed px-2">
                Tem certeza que deseja remover este planejamento? Esta ação não pode ser desfeita.
              </p>
            </div>

            <!-- Crisp Action Buttons -->
            <div class="px-8 pb-8 flex flex-col gap-2">
              <BaseButton variant="danger" @click="$emit('confirm')" class="w-full !py-3.5">
                Confirmar Exclusão
              </BaseButton>
              <BaseButton variant="ghost" @click="$emit('cancel')" class="w-full !py-3.5">
                Cancelar
              </BaseButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from '../atoms/BaseButton.vue'

defineProps<{
  show: boolean
}>()

defineEmits(['confirm', 'cancel'])
</script>
