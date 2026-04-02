<template>
  <BottomSheet
    ref="bottomSheetRef"
    v-bind="$attrs"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :duration="duration"
    class="custom-spring-bottom-sheet"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
    @opening-started="$emit('opening-started')"
    @closing-started="$emit('closing-started')"
    @dragging-up="$emit('dragging-up')"
    @dragging-down="$emit('dragging-down')"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="ariaLabelledBy"
    :aria-describedby="ariaDescribedBy"
  >
    <template #header>
      <!-- Wrap header to add visual drag handle and accessible keyboard interactions -->
      <div class="sheet-header-wrapper w-full flex flex-col items-center justify-center pt-2 pb-1 relative" aria-hidden="true">
         <div class="drag-handle w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full mb-2"></div>
      </div>
      <slot name="header"></slot>
    </template>

    <template #default>
      <slot></slot>
    </template>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </BottomSheet>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 250
  },
  ariaLabelledBy: {
    type: String,
    default: undefined
  },
  ariaDescribedBy: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits([
  'update:modelValue',
  'opened',
  'closed',
  'opening-started',
  'closing-started',
  'dragging-up',
  'dragging-down'
])

const bottomSheetRef = ref<InstanceType<typeof BottomSheet> | null>(null)

// Expose internal methods to be callable via template refs from parent
defineExpose({
  open: () => bottomSheetRef.value?.open(),
  close: () => bottomSheetRef.value?.close(),
  snapToPoint: (index: number) => bottomSheetRef.value?.snapToPoint(index)
})

// Focus Trap e Eventos de Teclado
const handleKeyDown = (e: KeyboardEvent) => {
  if (props.modelValue && e.key === 'Escape') {
    emit('update:modelValue', false)
    bottomSheetRef.value?.close()
  }
}

onMounted(() => {
  document.documentElement.style.setProperty('--vsbs-custom-duration', `${props.duration}ms`)
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.documentElement.style.removeProperty('--vsbs-custom-duration')
  document.removeEventListener('keydown', handleKeyDown)
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Focus no primeiro elemento interativo ao abrir (se houver necessidade)
    setTimeout(() => {
      const sheet = document.querySelector('[data-vsbs-sheet]')
      if (sheet) {
        (sheet as HTMLElement).focus()
      }
    }, props.duration)
  }
})
</script>

<style>
/* CSS fix to ensure time-based animation over frame-based */
.custom-spring-bottom-sheet [data-vsbs-sheet] {
  /* Provide a spring-like cubic bezier function for a more natural animation feel */
  /* This guarantees constant physics duration across framerates */
  transition: transform var(--vsbs-custom-duration, 250ms) cubic-bezier(0.175, 0.885, 0.32, 1.1),
              height var(--vsbs-custom-duration, 250ms) cubic-bezier(0.175, 0.885, 0.32, 1.1) !important;
  will-change: transform, height;

  /* Apply app-specific theming for dark/light mode */
  background-color: var(--color-bg-elevated) !important;
  color: var(--color-text-primary) !important;
  border-top-left-radius: 1.5rem !important; /* 24px */
  border-top-right-radius: 1.5rem !important; /* 24px */
}

/* Ensure backdrop uses proper easing to match the sheet */
.custom-spring-bottom-sheet [data-vsbs-backdrop] {
  transition: opacity var(--vsbs-custom-duration, 250ms) ease-out !important;
  will-change: opacity;
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(2px);
}

/* Esconder a barra de header default do autor caso ela venha conflitando,
já que estamos renderizando nossa própria drag-handle acessível via slot */
.custom-spring-bottom-sheet [data-vsbs-header]::before {
  display: none !important;
}

/* Improve header look */
.custom-spring-bottom-sheet [data-vsbs-header] {
  padding-top: 8px !important;
  padding-bottom: 0 !important;
}

/* If dragging is active, transitions are usually disabled by the lib via inline styles (transition: none),
   so these CSS rules only affect the explicit open/close/snap phases avoiding frame lag or acceleration. */
</style>
