<template>
  <NCard
    v-bind="$attrs"
    class="cockpit-card overflow-hidden transition-all duration-modern ease-modern"
    :class="{
      'cursor-pointer hover:brightness-[1.1] active:scale-[0.99]': clickable,
      'border-red-500/50 animate-pulse': error,
      'h-full flex flex-col': hFull,
    }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && $emit('click')"
  >
    <template v-if="$slots.header" #header>
      <div class="font-bold text-lg tracking-tight">
        <slot name="header" />
      </div>
    </template>

    <template v-if="$slots.headerExtra" #header-extra>
      <slot name="headerExtra" />
    </template>

    <!-- Error State -->
    <div
      v-if="error"
      class="p-8 flex flex-col items-center justify-center text-center gap-4 animate-fade-in"
    >
      <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <i class="i-lucide-alert-circle text-2xl"></i>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-red-500 font-bold">Erro ao carregar dados</h3>
        <p class="text-zinc-600 dark:text-zinc-400 text-sm max-w-[200px]">
          {{ errorMsg || 'Não foi possível carregar as informações agora.' }}
        </p>
      </div>
      <NButton
        v-if="retryable"
        type="error"
        size="small"
        @click.stop="$emit('retry')"
        class="mt-2 font-bold"
      >
        Tentar novamente
      </NButton>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="p-6 flex flex-col gap-4 animate-fade-in">
      <div class="flex items-center gap-4">
        <NSkeleton circle size="medium" />
        <div class="flex flex-col gap-2 flex-1">
          <NSkeleton text width="40%" />
          <NSkeleton text width="70%" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isEmpty"
      class="p-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in"
    >
      <div class="opacity-50 mb-2">
        <slot name="empty-icon">
          <i class="i-lucide-search-x text-4xl"></i>
        </slot>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-zinc-800 dark:text-zinc-50 font-bold text-lg">
          {{ emptyTitle || 'Sem dados' }}
        </h3>
        <p class="text-zinc-600 dark:text-zinc-400 text-sm max-w-[250px] leading-relaxed">
          {{ emptySubtitle || 'Não há informações disponíveis para exibir neste momento.' }}
        </p>
      </div>
      <slot name="empty-action" />
    </div>

    <!-- Default content -->
    <div
      v-else
      class="text-zinc-800 dark:text-zinc-50"
      :class="{ 'h-full flex flex-col': hFull, '!p-0': padding === 'none' }"
    >
      <slot />
    </div>

    <template v-if="$slots.footer" #footer>
      <div class="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
        <slot name="footer" />
      </div>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NSkeleton, NButton } from 'naive-ui'

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
