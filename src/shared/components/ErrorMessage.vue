<template>
  <div class="error-message" :class="{ 'error-message--retryable': retryable }">
    <div class="error-message__icon">
      <slot name="icon">
        <span class="icon-alert">⚠️</span>
      </slot>
    </div>
    <div class="error-message__content">
      <p class="error-message__text">{{ displayMessage }}</p>
      <button
        v-if="retryable"
        class="error-message__retry"
        @click="handleRetry"
        :disabled="isRetrying"
      >
        {{ isRetrying ? retryingText : retryText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getUserFriendlyErrorMessage } from '@/shared/utils/api-helpers'

interface Props {
  error: unknown
  customMessage?: string
  retryable?: boolean
  retryText?: string
  retryingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  customMessage: undefined,
  retryable: false,
  retryText: 'Try Again',
  retryingText: 'Retrying...',
})

const emit = defineEmits<{
  retry: []
}>()

const isRetrying = ref(false)

const displayMessage = computed(() => {
  if (props.customMessage) return props.customMessage
  return getUserFriendlyErrorMessage(props.error)
})

async function handleRetry() {
  if (isRetrying.value) return

  isRetrying.value = true
  try {
    emit('retry')
  } finally {
    // Small delay to prevent rapid retries
    setTimeout(() => {
      isRetrying.value = false
    }, 500)
  }
}
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.error-message--retryable {
  background-color: #fff7ed;
  border-color: #fed7aa;
}

.error-message__icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.error-message__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message__text {
  margin: 0;
  color: #991b1b;
  font-size: 0.875rem;
  line-height: 1.5;
}

.error-message__retry {
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background-color: #dc2626;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-message__retry:hover:not(:disabled) {
  background-color: #b91c1c;
}

.error-message__retry:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
