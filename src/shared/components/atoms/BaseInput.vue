<template>
  <div class="mb-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium mb-1 text-surface-800 dark:text-surface-50"
      >{{ label }}</label
    >

    <IconField v-if="icon" class="w-full relative">
      <InputIcon
        :class="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-400 z-10"
      />
      <InputNumber
        v-if="type === 'number'"
        :id="id"
        :modelValue="numericValue"
        @update:modelValue="handleUpdate"
        :placeholder="placeholder"
        :invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        fluid
        v-bind="$attrs"
        class="w-full"
        :inputClass="[
          'w-full bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-200/10 rounded-xl text-surface-800 dark:text-surface-50 text-sm shadow-inner transition-all duration-300 outline-none',
          'py-3.5 pr-4 pl-10',
          'hover:border-primary/30',
          'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface-100 dark:focus:bg-surface-700/60',
          'placeholder:text-surface-400/60 dark:text-surface-400/60',
        ]"
      />
      <InputText
        v-else
        :id="id"
        :type="type"
        :modelValue="textValue"
        @update:modelValue="handleUpdateText"
        :placeholder="placeholder"
        :invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        fluid
        v-bind="$attrs"
        :class="[
          'w-full bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-200/10 rounded-xl text-surface-800 dark:text-surface-50 text-sm shadow-inner transition-all duration-300 outline-none',
          'py-3.5 pr-4 pl-10',
          'hover:border-primary/30',
          'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface-100 dark:focus:bg-surface-700/60',
          'placeholder:text-surface-400/60 dark:text-surface-400/60',
        ]"
      />
    </IconField>

    <template v-else>
      <InputNumber
        v-if="type === 'number'"
        :id="id"
        :modelValue="numericValue"
        @update:modelValue="handleUpdate"
        :placeholder="placeholder"
        :invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        fluid
        v-bind="$attrs"
        class="w-full"
        :inputClass="[
          'w-full bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-200/10 rounded-xl text-surface-800 dark:text-surface-50 text-sm shadow-inner transition-all duration-300 outline-none',
          'py-3.5 px-4',
          'hover:border-primary/30',
          'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface-100 dark:focus:bg-surface-700/60',
          'placeholder:text-surface-400/60 dark:text-surface-400/60',
        ]"
      />
      <InputText
        v-else
        :id="id"
        :type="type"
        :modelValue="textValue"
        @update:modelValue="handleUpdateText"
        :placeholder="placeholder"
        :invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        fluid
        v-bind="$attrs"
        :class="[
          'w-full bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-200/10 rounded-xl text-surface-800 dark:text-surface-50 text-sm shadow-inner transition-all duration-300 outline-none',
          'py-3.5 px-4',
          'hover:border-primary/30',
          'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface-100 dark:focus:bg-surface-700/60',
          'placeholder:text-surface-400/60 dark:text-surface-400/60',
        ]"
      />
    </template>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

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
  if (props.modelValue === null || props.modelValue === undefined) return undefined
  return String(props.modelValue)
})

function handleUpdate(val: number | null) {
  emit('update:modelValue', val)
}

function handleUpdateText(val: string | undefined) {
  emit('update:modelValue', val)
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
