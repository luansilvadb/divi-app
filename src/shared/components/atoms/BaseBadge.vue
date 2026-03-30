<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border transition-all duration-300',
      variantClasses[variant],
      customClasses
    ]"
    :style="customStyle"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BadgeVariant = 'subtle' | 'outline' | 'solid'

const props = withDefaults(defineProps<{
  label?: string
  variant?: BadgeVariant
  color?: string // Hex or CSS Variable
}>(), {
  variant: 'subtle'
})

const variantClasses: Record<BadgeVariant, string> = {
  subtle: '',
  outline: 'bg-transparent',
  solid: 'text-white border-transparent'
}

const isCssVar = computed(() => props.color?.startsWith('var('))

const customStyle = computed(() => {
  if (!props.color) return {}
  
  const colorValue = isCssVar.value ? props.color : props.color

  if (props.variant === 'solid') {
    return {
      backgroundColor: colorValue,
      borderColor: colorValue
    }
  }

  if (props.variant === 'outline') {
    return {
      color: colorValue,
      borderColor: colorValue
    }
  }

  // Default subtle
  return {
    backgroundColor: isCssVar.value ? `rgba(${props.color}, 0.1)` : `${props.color}15`,
    color: colorValue,
    borderColor: isCssVar.value ? `rgba(${props.color}, 0.2)` : `${props.color}30`
  }
})

// Special handling for CSS variables if they are just the color name in Tailwind
const customClasses = computed(() => {
  if (props.color || !props.variant) return ''
  
  // If no color provided, use default primary subtle
  return 'bg-primary-main/10 text-primary-main border-primary-main/20'
})
</script>
