<template>
  <BaseModal :show="show" @update:show="$emit('close')">
    <BaseCard
      class="w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative"
      padding="none"
    >
      <!-- Header Area (Premium Split) -->
      <div class="bg-primary-main/10 p-7 border-b border-white/5 relative">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
              <h2 class="text-2xl font-black text-text-primary tracking-tight leading-tight">
                Nova Transação
              </h2>
              <p
                class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40"
              >
                Adicione um novo lançamento manual
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all border border-white/5 group"
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
              class="group-hover:rotate-90 transition-transform duration-300"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body Area -->
      <TransactionFormContent @close="$emit('close')" @saved="$emit('saved')" />
    </BaseCard>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/shared/components/molecules/BaseModal.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import TransactionFormContent from './TransactionFormContent.vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close', 'saved'])
</script>
