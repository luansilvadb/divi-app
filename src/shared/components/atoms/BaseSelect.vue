<template>
  <div class="mb-4 relative" v-click-outside="close">
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1 text-text-primary">{{
      label
    }}</label>

    <!-- Trigger -->
    <button
      type="button"
      :id="id"
      class="w-full pl-3 pr-10 py-2 rounded-md border bg-surface-main border-border-main text-text-primary text-left focus:outline-none focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main transition-all cursor-pointer flex items-center justify-between relative"
      :class="{ 'text-text-disabled': !modelValue }"
      @click="isOpen = !isOpen"
    >
      <span class="truncate">{{ selectedLabel || placeholder }}</span>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-disabled"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-60 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-surface-main/90 backdrop-blur-md border border-border-main shadow-xl py-1 focus:outline-none"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="relative cursor-pointer select-none py-2 px-4 text-sm font-medium transition-colors"
          :class="[
            modelValue === option.value
              ? 'bg-primary-main text-white'
              : 'text-text-primary hover:bg-white/5 dark:hover:bg-white/5',
          ]"
          @click="select(option)"
        >
          <span class="block truncate">{{ option.label }}</span>
        </div>
        <div v-if="options.length === 0" class="py-2 px-4 text-sm text-text-disabled italic">
          Nenhuma opção disponível
        </div>
      </div>
    </transition>

    <p v-if="error" class="mt-1 text-xs text-error-main">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  id: string
  label?: string
  modelValue: string | number
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedLabel = computed(() => {
  const option = props.options.find((opt) => opt.value === props.modelValue)
  return option ? option.label : ''
})

function select(option: { label: string; value: string | number }) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function close() {
  isOpen.value = false
}

// Directive to close dropdown when clicking outside
const vClickOutside = {
  mounted(
    el: HTMLElement & { clickOutsideEvent: (event: Event) => void },
    binding: { value: () => void },
  ) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement & { clickOutsideEvent: (event: Event) => void }) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>
