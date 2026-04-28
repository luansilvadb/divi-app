<script setup lang="ts">
import { computed } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options?: SelectOption[]
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
  options: () => [],
  placeholder: 'Selecione uma opção',
  disabled: false,
  required: false,
  label: '',
  error: '',
  helperText: '',
  id: () => `apple-select-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectClass = computed(() => {
  return [
    'apple-select__field',
    {
      'apple-select__field--error': props.error,
      'apple-select__field--disabled': props.disabled
    }
  ]
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
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
  <div class="apple-select">
    <label v-if="label" :for="id" class="apple-select__label">
      {{ label }}
      <span v-if="required" class="apple-select__required">*</span>
    </label>

    <div class="apple-select__wrapper">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClass"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled selected>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="apple-select__icon">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <p v-if="error" class="apple-select__error" role="alert">
      {{ error }}
    </p>

    <p v-else-if="helperText" class="apple-select__helper">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
.apple-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.apple-select__label {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0;
}

.apple-select__required {
  color: #ff3b30;
  margin-left: 2px;
}

.apple-select__wrapper {
  position: relative;
  width: 100%;
}

.apple-select__field {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 17px;
  padding: 12px 40px 12px 16px;
  border: 1px solid #86868b;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1d1d1f;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.apple-select__field:hover:not(.apple-select__field--disabled) {
  border-color: #6e6e73;
}

.apple-select__field:focus {
  outline: none;
  border-color: #0071e3;
  border-width: 2px;
  padding: 11px 39px 11px 15px; /* Adjust for border width change */
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
}

.apple-select__field--error {
  border-color: #ff3b30;
}

.apple-select__field--error:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.2);
}

.apple-select__field--disabled {
  background-color: #f5f5f7;
  color: #6e6e73;
  cursor: not-allowed;
  opacity: 0.6;
}

.apple-select__icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apple-select__error {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #ff3b30;
  margin: 0;
  margin-top: -4px;
}

.apple-select__helper {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #6e6e73;
  margin: 0;
  margin-top: -4px;
}
</style>
