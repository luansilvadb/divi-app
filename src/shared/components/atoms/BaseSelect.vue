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
      appendTo="self"
      :pt="{
        root: {
            class: [
              'w-full px-3 py-2 rounded-md border bg-surface-main text-text-primary focus:outline-hidden transition-all shadow-none',
              error ? 'border-error-main focus:border-error-main focus:ring-2 focus:ring-error-main/20' : 'border-border-main focus:border-primary-main focus:ring-2 focus:ring-primary-main/20'
            ]
        },
        label: {
            class: 'p-0 text-left truncate',
            style: { padding: 0 }
        },
        overlay: {
            class: 'absolute z-60 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-surface-main/90 backdrop-blur-md border border-border-main shadow-xl focus:outline-none'
        },
        list: {
            class: 'p-1'
        },
        option: {
            class: 'rounded-md py-2 px-4 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 data-[p-highlight=true]:bg-primary-main data-[p-highlight=true]:text-white cursor-pointer select-none'
        }
      }"
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
