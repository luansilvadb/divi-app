<template>
  <div class="base-search-input w-full relative group">
    <IconField class="w-full">
      <InputIcon
        v-if="loading"
        class="pi pi-spinner pi-spin text-lg transition-all duration-300 !text-secondary-main absolute !top-1/2 !-translate-y-1/2 left-4 z-10 !mt-0"
      />
      <InputIcon
        v-else
        class="pi pi-search text-lg transition-all duration-300 absolute !top-1/2 !-translate-y-1/2 left-4 z-10 !mt-0 !text-text-disabled"
        :class="{ '!text-slate-500 dark:!text-slate-400 scale-110 !opacity-100': localValue }"
      />

      <InputText
        v-model="localValue"
        :placeholder="placeholder"
        class="w-full pl-12 pr-12 py-4 !rounded-xl transition-all duration-300 !bg-[#161D2C] !border border-white/5 shadow-lg hover:!border-white/10 focus:!border-primary-main/30 focus:!ring-0 outline-none !text-text-primary placeholder:!text-text-secondary/40 placeholder:!font-medium placeholder:!tracking-tight"
        @input="onInput(($event.target as HTMLInputElement).value)"
      />

      <transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-2"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
      >
        <button
          v-if="localValue"
          class="absolute inset-y-0 right-4 flex items-center text-text-disabled hover:text-secondary-main transition-colors z-10 p-2 cursor-pointer"
          aria-label="Limpar busca"
          @click="clear"
        >
          <i class="pi pi-times" />
        </button>
      </transition>
    </IconField>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  debounce?: number
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

// Update local value when prop changes externally
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  }
)

const debouncedEmit = useDebounceFn((val: string) => {
  emit('update:modelValue', val)
}, props.debounce || 0)

const onInput = (val: string) => {
  if (props.debounce && props.debounce > 0) {
    debouncedEmit(val)
  } else {
    emit('update:modelValue', val)
  }
}

const clear = () => {
  localValue.value = ''
  emit('update:modelValue', '')
}
</script>

