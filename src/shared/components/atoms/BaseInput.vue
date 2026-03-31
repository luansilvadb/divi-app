<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-text-primary">{{
      label
    }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      :class="[
        'w-full px-3 py-2 rounded-md border bg-surface-main text-text-primary focus:outline-hidden focus:ring-2 transition-all placeholder:text-text-disabled',
        error
          ? 'border-error-main focus:ring-error-main/20 focus:border-error-main'
          : 'border-border-main focus:ring-primary-main/20 focus:border-primary-main',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" :id="`${id}-error`" aria-live="polite" class="mt-1 text-xs text-error-main">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  modelValue: string | number
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
