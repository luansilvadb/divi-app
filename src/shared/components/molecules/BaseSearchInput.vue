<template>
  <div class="base-search-input w-full relative group">
    <NInput
      ref="inputInst"
      v-model:value="localValue"
      :placeholder="placeholder"
      size="large"
      class="!rounded-xl transition-all duration-300 ease-out search-input-glow"
      @input="onInput"
      clearable
      @clear="clear"
    >
      <template #prefix>
        <i v-if="loading" class="i-lucide-loader-2 animate-spin text-lg" style="color: var(--color-primary)"></i>
        <i v-else class="i-lucide-search text-lg transition-colors" style="color: var(--text-tertiary)"></i>
      </template>
      <template #suffix>
        <div 
          class="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[var(--surface-separator)] bg-white dark:bg-zinc-800 text-[10px] font-black text-[var(--text-tertiary)] shadow-sm group-focus-within:opacity-0 transition-all duration-300 pointer-events-none select-none"
          :title="formatMessage('MSG_I_SEARCH_SHORTCUT', { key: isMac ? '⌘K' : 'Ctrl+K' })"
        >
          <span class="text-[11px] opacity-60">{{ isMac ? '⌘' : 'Ctrl' }}</span>
          <span class="opacity-80">K</span>
        </div>
      </template>
    </NInput>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { NInput, type InputInst } from 'naive-ui'
import { formatMessage } from '@/shared/messages/catalog'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  debounce?: number
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
const inputInst = ref<InputInst | null>(null)
const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

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

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    inputInst.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.search-input-glow :deep(.n-input--focus) {
  box-shadow: 0 0 0 4px var(--color-primary-subtle) !important;
}

.search-input-glow :deep(.n-input) {
  transition: all 0.3s var(--ease-out) !important;
}
</style>
