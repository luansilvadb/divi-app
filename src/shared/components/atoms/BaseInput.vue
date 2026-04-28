<template>
  <div class="mb-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium mb-1 text-label-primary"
      >{{ label }}</label
    >

    <NInputNumber
      v-if="type === 'number'"
      :id="id"
      :value="numericValue"
      @update:value="handleUpdateNumber"
      :placeholder="placeholder"
      :status="error ? 'error' : undefined"
      class="transition-all duration-150 ease-out"
      v-bind="$attrs"
    >
      <template v-if="icon" #prefix>
        <i :class="icon" class="text-label-tertiary"></i>
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
      class="transition-all duration-150 ease-out"
      v-bind="$attrs"
      show-password-on="mousedown"
    >
      <template v-if="icon" #prefix>
        <i :class="icon" class="text-label-tertiary"></i>
      </template>
    </NInput>

    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error">
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
