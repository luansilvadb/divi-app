<template>
  <!-- Glassmorphism wrapper for premium depth effect -->
  <div
    class="datacard-wrapper"
    :class="[
      'datacard-glass',
      'rounded-[var(--radius-lg)]',
      elevationClass,
      { 'datacard-disabled': disabled },
    ]"
  >
    <NCard
      v-bind="$attrs"
      class="datacard-inner overflow-hidden border-0 bg-transparent"
      :class="{
        'cursor-pointer': clickable && !disabled,
        'focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2': clickable,
      }"
      :role="clickable ? 'button' : undefined"
      :tabindex="clickable && !disabled ? 0 : undefined"
      :aria-disabled="disabled"
      :aria-label="ariaLabel"
      @click="handleClick"
      @keydown.enter="handleKeydown"
      @keydown.space.prevent="handleKeydown"
    >
      <!-- Error State -->
      <div
        v-if="error"
        class="error-state-container animate-fade-in"
        role="alert"
        aria-live="polite"
      >
        <div class="error-state-icon-wrapper">
          <i class="i-lucide-alert-circle error-state-icon"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="error-state-title">Erro ao carregar dados</h3>
          <p class="error-state-subtitle">
            {{ errorMessage || 'Não foi possível carregar as informações agora.' }}
          </p>
        </div>
        <NButton
          v-if="retryable"
          secondary
          size="small"
          :disabled="disabled"
          @click.stop="handleRetry"
          class="mt-2 font-semibold flex items-center gap-2"
        >
          <i class="i-lucide-refresh-cw w-4 h-4"></i>
          Tentar novamente
        </NButton>
      </div>

      <!-- Loading State with Shimmer -->
      <div v-else-if="loading" class="p-[var(--space-6)] flex flex-col gap-[var(--space-4)] animate-fade-in">
        <div class="flex items-center gap-[var(--space-4)]">
          <div class="skeleton-shimmer w-12 h-12 rounded-full"></div>
          <div class="flex flex-col gap-[var(--space-2)] flex-1">
            <div class="skeleton-shimmer h-4 rounded-[var(--radius-md)]" style="width: 60%"></div>
            <div class="skeleton-shimmer h-4 rounded-[var(--radius-md)]" style="width: 80%"></div>
          </div>
        </div>
        <div class="skeleton-shimmer h-4 rounded-[var(--radius-md)] w-full"></div>
        <div class="skeleton-shimmer h-4 rounded-[var(--radius-md)]" style="width: 70%"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="empty"
        class="empty-state-container animate-fade-in"
      >
        <div class="empty-state-icon-wrapper">
          <slot name="empty-icon">
            <i class="i-lucide-search-x empty-state-icon"></i>
          </slot>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="empty-state-title">
            {{ emptyTitle || 'Sem dados' }}
          </h3>
          <p class="empty-state-subtitle leading-relaxed">
            {{ emptySubtitle || 'Não há informações disponíveis para exibir neste momento.' }}
          </p>
        </div>
        <div v-if="$slots['empty-action']" class="mt-[var(--space-4)]">
          <slot name="empty-action" />
        </div>
      </div>

      <!-- Default Content -->
      <div v-else class="flex flex-col gap-[var(--space-5)] p-[var(--space-2)]">
        <!-- Render default slot content when no named slots are provided -->
        <div v-if="$slots.default" class="datacard-default-content">
          <slot />
        </div>

        <!-- Header -->
        <div v-if="$slots['header-left']" class="datacard-header">
          <div class="datacard-header-left">
            <slot name="header-left" />
          </div>
          <div v-if="$slots['header-right']" class="datacard-header-right">
            <slot name="header-right" />
          </div>
        </div>

        <!-- Values Section -->
        <div v-if="$slots.values" class="datacard-body">
          <slot name="values" />
        </div>

        <!-- Extra Content (between values and progress) -->
        <div v-if="$slots['extra-content']">
          <slot name="extra-content" />
        </div>

        <!-- Progress Section -->
        <div v-if="$slots.progress" class="datacard-body">
          <slot name="progress" />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots['footer-left'] || $slots['footer-right']"
          class="datacard-footer"
        >
          <div v-if="$slots['footer-left']" class="datacard-footer-left">
            <slot name="footer-left" />
          </div>
          <div v-if="$slots['footer-right']" class="datacard-footer-right">
            <slot name="footer-right" />
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NButton } from 'naive-ui'

/**
 * DataCard Component - Design Refresh 2026
 *
 * A premium card component with glassmorphism, elevation system,
 * and comprehensive micro-interactions.
 *
 * @example
 * <DataCard
 *   :loading="isLoading"
 *   :empty="!hasData"
 *   :error="hasError"
 *   :clickable="true"
 *   @click="handleClick"
 * >
 *   <template #header-left>Title</template>
 *   <template #values>Value content</template>
 * </DataCard>
 */

export interface DataCardProps {
  /** Loading state with shimmer animation */
  loading?: boolean
  /** Empty state display */
  empty?: boolean
  /** Empty state title text */
  emptyTitle?: string
  /** Empty state subtitle text */
  emptySubtitle?: string
  /** Error state display */
  error?: boolean
  /** Error message text */
  errorMessage?: string
  /** Show retry button in error state */
  retryable?: boolean
  /** Enable hover elevation effect */
  hoverable?: boolean
  /** Enable click interactions and focus states */
  clickable?: boolean
  /** Disable all interactions */
  disabled?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
}

const props = defineProps<DataCardProps>()

const emit = defineEmits<{
  /** Emitted when clickable card is clicked */
  click: []
  /** Emitted when retry button is clicked */
  retry: []
}>()

/**
 * Compute elevation class based on interaction props
 * - clickable: Full elevation with hover/active states
 * - hoverable: Moderate elevation with hover state
 * - default: Static shadow-sm
 */
const elevationClass = computed(() => {
  if (props.disabled) return ''
  if (props.clickable) return 'elevation-clickable'
  if (props.hoverable) return 'elevation-hoverable'
  return 'elevation-default'
})

/**
 * Handle click events, respecting disabled state
 */
const handleClick = () => {
  if (props.clickable && !props.disabled) {
    emit('click')
  }
}

/**
 * Handle keyboard interactions (Enter/Space)
 */
const handleKeydown = () => {
  if (props.clickable && !props.disabled) {
    emit('click')
  }
}

/**
 * Handle retry button click, preventing event bubbling
 */
const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
/**
 * Component-scoped styles for DataCard
 * Uses CSS custom properties from design-tokens.css
 */

.datacard-wrapper {
  /* Smooth transitions for all state changes */
  transition: background-color var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-in-out),
              transform var(--duration-fast) var(--ease-out);
}

/* Ensure NCard internals don't add unwanted borders */
.datacard-inner :deep(.n-card__content) {
  padding: 0;
}

.datacard-inner :deep(.n-card__border) {
  border: none;
}

/* Focus ring for keyboard navigation */
.datacard-inner:focus-visible {
  outline: none;
}

/* Active/press state enhancement */
.datacard-wrapper:active:not(.datacard-disabled) {
  transform: scale(0.995);
}

/* Disabled state overrides */
.datacard-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.datacard-disabled * {
  pointer-events: none;
}

/* Default slot content wrapper */
.datacard-default-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}
</style>
