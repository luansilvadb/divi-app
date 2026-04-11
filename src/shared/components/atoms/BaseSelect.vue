<template>
  <div class="mb-2 relative">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium mb-1 text-zinc-800 dark:text-zinc-50"
      >{{ label }}</label
    >

    <NSelect
      :id="id"
      :value="modelValue"
      @update:value="(val: string | number) => $emit('update:modelValue', val)"
      :options="options"
      :placeholder="placeholder"
      :status="error ? 'error' : undefined"
      :filterable="editable"
      :tag="editable"
      class="!rounded-xl"
      v-bind="$attrs"
    >
      <template #empty>
        <div class="py-2 px-4 text-sm text-zinc-400 dark:text-zinc-500 italic">
          Nenhuma opção disponível
        </div>
      </template>
    </NSelect>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui'

defineProps<{
  id: string
  label?: string
  modelValue: string | number | undefined | null
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  error?: string
  editable?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
:deep(.n-base-selection) {
  --n-border-radius: 12px !important;
  background-color: rgba(var(--color-zinc-500-rgb), 0.05) !important;
}

:is(.dark) :deep(.n-base-selection) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
