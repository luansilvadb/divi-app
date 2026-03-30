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
      class="w-full px-3 py-2 rounded-md border bg-surface-main border-border-main text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main transition-all placeholder:text-text-disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-xs text-error-main">{{ error }}</p>
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
/* Scoped styles removed in favor of Tailwind classes */
</style>
