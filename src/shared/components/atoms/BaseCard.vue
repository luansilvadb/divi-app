<template>
  <Card

    v-bind="$attrs"
    class="glass-card overflow-hidden transition-all duration-300"
    :class="{
      'cursor-pointer hover-glow active:scale-[0.98]': clickable,
      'border-error-main/50 animate-pulse-error': error,
      'h-full flex flex-col': hFull,
    }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && $emit('click')"
    @keydown.enter="clickable && $emit('click')"
    @keydown.space.prevent="clickable && $emit('click')"

  >
    <template #header v-if="$slots.header">
      <div
        class="px-6 py-4 border-b border-black/5 dark:border-white/5 font-bold text-text-primary text-lg tracking-tight flex items-center justify-between"
      >
        <slot name="header" />
      </div>
    </template>

    <template #content>
      <!-- Error State -->
      <div
        v-if="error"
        class="p-8 flex flex-col items-center justify-center text-center gap-4 animate-fade-in"
      >
        <div
          class="w-12 h-12 rounded-full bg-error-main/10 flex items-center justify-center text-error-main"
        >
          <i class="pi pi-exclamation-circle text-2xl"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-error-main font-bold">Erro ao carregar dados</h3>
          <p class="text-text-secondary text-sm max-w-[200px]">
            {{ errorMsg || 'Não foi possível carregar as informações agora.' }}
          </p>
        </div>
        <button
          v-if="retryable"
          @click.stop="$emit('retry')"
          class="mt-2 px-4 py-2 bg-error-main text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="p-6 flex flex-col gap-4 animate-fade-in">
        <div class="flex items-center gap-4">
          <BaseSkeleton width="40px" height="40px" rounded />
          <div class="flex flex-col gap-2 flex-1">
            <BaseSkeleton width="40%" height="12px" />
            <BaseSkeleton width="70%" height="20px" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="isEmpty"
        class="p-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in"
      >
        <BaseIconBox :color="emptyColor" size="lg" class="opacity-50 mb-2">
          <slot name="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
            </svg>
          </slot>
        </BaseIconBox>
        <div class="flex flex-col gap-1">
          <h3 class="text-text-primary font-bold text-lg">{{ emptyTitle || 'Sem dados' }}</h3>
          <p class="text-text-secondary text-sm max-w-[250px] leading-relaxed">
            {{ emptySubtitle || 'Não há informações disponíveis para exibir neste momento.' }}
          </p>
        </div>
        <slot name="empty-action" />
      </div>

      <!-- Default content -->
      <div
        v-else
        class="p-6 text-text-primary"
        :class="{ 'h-full flex flex-col': hFull, '!p-0': padding === 'none' }"
      >
        <slot />
      </div>
    </template>

    <template #footer v-if="$slots.footer">
      <div
        class="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 text-text-secondary text-sm font-medium"
      >
        <slot name="footer" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import BaseIconBox from './BaseIconBox.vue'
import BaseSkeleton from './BaseSkeleton.vue'

defineProps<{
  clickable?: boolean
  error?: boolean
  errorMsg?: string
  retryable?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  emptyTitle?: string
  emptySubtitle?: string
  emptyColor?: string
  hFull?: boolean
  padding?: 'none' | 'default'
}>()

defineEmits(['click', 'retry'])
</script>
