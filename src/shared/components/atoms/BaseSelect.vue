<template>
  <div class="mb-2 relative">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-surface-800 dark:text-surface-50">{{
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
      :pt="{
        root: { class: ['w-full bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-200/10 rounded-xl text-surface-800 dark:text-surface-50 text-sm shadow-inner transition-all duration-300 outline-none flex items-center', 'hover:border-primary/30', 'focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-black/10 dark:focus-within:bg-black/60'] },
        label: ({ props }: { props: any }) => ({
          class: ['py-3.5 px-4 w-full text-surface-800 dark:text-surface-50 bg-transparent outline-none border-none', { 'opacity-60 text-surface-400 dark:text-surface-400': !props.modelValue }]
        }),
        dropdown: { class: 'w-10 flex items-center justify-center text-surface-400 dark:text-surface-400' },
        overlay: { class: 'bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-200/10 shadow-2xl rounded-2xl outline-none' },
        list: { class: 'p-2 flex flex-col gap-1' },
        option: ({ context }: { context: any }) => ({
          class: ['py-3 px-4 text-sm transition-all duration-200 cursor-pointer rounded-xl font-medium outline-none', context.focused ? 'bg-primary/15 text-primary shadow-sm' : 'text-surface-800 dark:text-surface-50 hover:bg-surface-50 dark:hover:bg-white/5']
        })
      }"
    >
      <template #empty>
        <div class="py-2 px-4 text-sm text-surface-400 dark:text-surface-400 italic">
          Nenhuma opção disponível
        </div>
      </template>
    </Select>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error">
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


