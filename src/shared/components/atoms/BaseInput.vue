<template>
  <div class="mb-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium mb-1 text-zinc-800 dark:text-zinc-50"
      >{{ label }}</label
    >

    <NInputNumber
      v-if="type === 'number'"
      :id="id"
      :value="numericValue"
      @update:value="handleUpdateNumber"
      :placeholder="placeholder"
      :status="error ? 'error' : undefined"
      v-bind="$attrs"
    >
      <template v-if="icon" #prefix>
        <i :class="icon" class="text-zinc-400"></i>
      </template>
    </NInputNumber>

    <NInput
      v-else
      :id="id"
      :type="type === 'password' ? 'password' : 'text'"
      :value="textValue"
      @update:value="handleUpdateText"
      :placeholder="placeholder"
      :status="error ? 'error' : undefined"
      v-bind="$attrs"
      show-password-on="mousedown"
    >
      <template v-if="icon" #prefix>
        <i :class="icon" class="text-zinc-400"></i>
      </template>
    </NInput>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput, NInputNumber } from 'naive-ui'

const props = defineProps<{
  id: string
  label?: string
  modelValue: string | number | null | undefined
  type?: string
  placeholder?: string
  error?: string
  icon?: string
}>()

const emit = defineEmits(['update:modelValue'])

const numericValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '')
    return null
  return Number(props.modelValue)
})

const textValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null
  return String(props.modelValue)
})

function handleUpdateNumber(val: number | null) {
  emit('update:modelValue', val)
}

function handleUpdateText(val: string) {
  emit('update:modelValue', val)
}
</script>

<style scoped>
:deep(.n-input) {
  --n-border-radius: 2px !important;
  background-color: rgba(var(--color-obsidian-rgb), 0.5);
}

:is(.dark) :deep(.n-input) {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
