<template>
  <NButton
    :type="naiveType"
    :ghost="variant === 'outline' || variant === 'ghost'"
    :quaternary="variant === 'ghost'"
    :disabled="disabled || loading"
    :loading="loading"
    v-bind="$attrs"
    class="!font-bold !rounded-xl transition-all duration-modern ease-modern active:scale-95"
    :class="[
      { '!px-6 !py-2.5': size === 'medium' },
      { '!px-4 !py-1.5': size === 'small' },
      { 'glass-button': variant === 'secondary' }
    ]"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <slot />
  </NButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-tinted'
type ButtonSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
)

const naiveType = computed(() => {
  if (props.variant === 'danger' || props.variant === 'danger-tinted') return 'error'
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'secondary') return 'info'
  return 'default'
})
</script>

<style scoped>
.glass-button {
  background: rgba(var(--color-zinc-500-rgb), 0.1);
  backdrop-filter: blur(8px);
}
</style>
