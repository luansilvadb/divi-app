<template>
  <NLayout has-sider class="h-screen w-screen" style="background: var(--surface-background);">
    <!-- Desktop Sidebar -->
    <AppSidebar v-if="!isMobile" @logout="emit('logout')" />

    <div class="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden h-full">
      <!-- Top header (Static at top, behaves like sticky because content scrolls below) -->
      <GlobalHeader />

      <main
        ref="scrollerRef"
        class="flex-1 overflow-y-auto px-6 md:px-12 pb-24 md:pb-12" style="background: var(--surface-background); color: var(--text-label);"
        @scroll="handleScroll"
      >
        <slot />
      </main>
    </div>

    <!-- Mobile Navigation -->
    <template v-if="isMobile">
      <AppBottomBar @open-drawer="isMobileDrawerOpen = true" />
      <AppMobileDrawer
        :is-open="isMobileDrawerOpen"
        @close="isMobileDrawerOpen = false"
        @logout="emit('logout')"
      />
    </template>
  </NLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NLayout } from 'naive-ui'
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'
import AppMobileDrawer from '@/shared/components/organisms/AppMobileDrawer.vue'
import GlobalHeader from '@/shared/components/organisms/GlobalHeader.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const scrollerRef = ref<HTMLElement | null>(null)
const isMobile = useIsMobile()
const isMobileDrawerOpen = ref(false)
const { setScrollY } = useViewHeader()

const emit = defineEmits<{
  (e: 'logout'): void
}>()

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  if (target) {
    setScrollY(target.scrollTop)
  }
}

onMounted(() => {
  // Ensure we start with 0 scroll on mount
  setScrollY(0)
})
</script>
