<template>
  <div class="mb-2 relative">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-text-primary">{{
      label
    }}</label>

    <Select
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="(val: string | number) => $emit('update:modelValue', val)"
      :options="options"
      optionLabel="label"
      optionValue="value"
      :placeholder="placeholder"
      :invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      fluid

    >
      <template #empty>
        <div class="py-2 px-4 text-sm text-text-disabled italic">
          Nenhuma opção disponível
        </div>
      </template>
    </Select>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error-main">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import Select from 'primevue/select'

defineProps<{
  id: string
  label?: string
  modelValue: string | number | undefined | null
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>
