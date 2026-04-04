<template>
  <div class="mb-2">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-text-primary">{{
      label
    }}</label>

    <IconField v-if="icon" class="w-full">
      <InputIcon :class="icon" class="text-text-disabled" />
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
        :pt="ptOptions"
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
        :pt="ptOptions"
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
        :pt="ptOptions"
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
        :pt="ptOptions"
      />
    </template>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error-main">
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

const ptOptions = {
  root: {
    class: [
      'w-full px-3 py-2 rounded-md border bg-surface-main text-text-primary focus:outline-hidden transition-all placeholder:text-text-disabled shadow-none',
      props.error
        ? 'border-error-main focus:border-error-main focus:ring-2 focus:ring-error-main/20'
        : 'border-border-main focus:border-primary-main focus:ring-2 focus:ring-primary-main/20',
    ],
  },
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
