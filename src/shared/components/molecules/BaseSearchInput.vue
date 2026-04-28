<template>
  <div class="base-search-input w-full relative group">
    <NInput
      v-model:value="localValue"
      :placeholder="placeholder"
      size="large"
      class="!rounded-xl transition-all duration-150 ease-out"
      @input="onInput"
      clearable
      @clear="clear"
    >
      <template #prefix>
        <i v-if="loading" class="i-lucide-loader-2 animate-spin text-lg" style="color: var(--color-primary)"></i>
        <i v-else class="i-lucide-search text-lg transition-colors" style="color: var(--text-tertiary)"></i>
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
/* Naive UI theme handles all styling via naiveTheme.ts */
</style>
