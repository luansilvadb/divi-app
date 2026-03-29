<template>
  <div class="divi-input-group">
    <label v-if="label" :for="id" class="divi-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="divi-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="divi-error">{{ error }}</p>
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
.divi-input-group {
  margin-bottom: 1rem;
}
.divi-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}
.divi-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  outline: none;
  transition: border-color 0.2s;
}
.divi-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}
.divi-error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc2626;
}
</style>
