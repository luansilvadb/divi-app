<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  label?: string
  error?: string
  helperText?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  required: false,
  label: '',
  error: '',
  helperText: '',
  id: () => `apple-input-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClass = computed(() => {
  return [
    'apple-input__field',
    {
      'apple-input__field--error': props.error,
      'apple-input__field--disabled': props.disabled
    }
  ]
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<template>
  <div class="apple-input">
    <label v-if="label" :for="id" class="apple-input__label">
      {{ label }}
      <span v-if="required" class="apple-input__required">*</span>
    </label>

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClass"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <p v-if="error" class="apple-input__error" role="alert">
      {{ error }}
    </p>

    <p v-else-if="helperText" class="apple-input__helper">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
.apple-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.apple-input__label {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0;
}

.apple-input__required {
  color: #ff3b30;
  margin-left: 2px;
}

.apple-input__field {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 17px;
  padding: 12px 16px;
  border: 1px solid #86868b;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1d1d1f;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.apple-input__field::placeholder {
  color: #6e6e73;
  opacity: 0.6;
}

.apple-input__field:hover:not(.apple-input__field--disabled) {
  border-color: #6e6e73;
}

.apple-input__field:focus {
  outline: none;
  border-color: #0071e3;
  border-width: 2px;
  padding: 11px 15px; /* Adjust for border width change */
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
}

.apple-input__field--error {
  border-color: #ff3b30;
}

.apple-input__field--error:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.2);
}

.apple-input__field--disabled {
  background-color: #f5f5f7;
  color: #6e6e73;
  cursor: not-allowed;
  opacity: 0.6;
}

.apple-input__error {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #ff3b30;
  margin: 0;
  margin-top: -4px;
}

.apple-input__helper {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #6e6e73;
  margin: 0;
  margin-top: -4px;
}
</style>
