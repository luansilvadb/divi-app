<template>
  <button
    :class="[
      'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="mr-2">...</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

const props = defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
}>()

const variant = props.variant || 'primary'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500'
}
</script>
