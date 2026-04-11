<template>
  <div class="base-search-input w-full relative group">
    <NInput
      v-model:value="localValue"
      :placeholder="placeholder"
      size="large"
      class="!rounded-2xl !bg-zinc-100 dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 transition-all duration-300"
      @input="onInput"
      clearable
      @clear="clear"
    >
      <template #prefix>
        <i v-if="loading" class="i-lucide-loader-2 animate-spin text-lg text-violet-500"></i>
        <i v-else class="i-lucide-search text-lg text-zinc-400 group-focus-within:text-violet-500 transition-colors"></i>
      </template>
    </NInput>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { NInput } from 'naive-ui'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  debounce?: number
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  },
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

<style scoped>
:deep(.n-input) {
  --n-border-radius: 16px !important;
  --n-placeholder-color: #a1a1aa !important;
}
:deep(.n-input__border) {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
