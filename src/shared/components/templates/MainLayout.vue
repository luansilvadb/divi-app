<template>
  <NLayout has-sider class="h-screen w-screen !bg-zinc-50 dark:!bg-zinc-950">
    <!-- Desktop Sidebar -->
    <AppSidebar v-if="!isMobile" @logout="emit('logout')" />

    <div class="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden h-full">
      <!-- Top header (Static at top, behaves like sticky because content scrolls below) -->
      <GlobalHeader 
        @new-transaction="isTransactionDialogOpen = true" 
        @new-budget="isBudgetDialogOpen = true"
      />

      <main 
        ref="scrollerRef"
        class="flex-1 overflow-y-auto px-6 md:px-12 pb-24 md:pb-12"
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

    <!-- Global Floating Action Button -->
    <NButton
      v-if="isMobile"
      type="primary"
      circle
      size="large"
      class="fixed bottom-24 right-6 !w-14 !h-14 shadow-xl z-50 hover:scale-110 active:scale-95 transition-transform"
      @click="handleMobileFAB"
    >
      <template #icon>
        <i class="i-lucide-plus text-2xl"></i>
      </template>
    </NButton>

    <!-- Global Transaction Dialog -->
    <TransactionDialog :show="isTransactionDialogOpen" @close="isTransactionDialogOpen = false" />
    
    <!-- Global Budget Dialog -->
    <BudgetDialog :show="isBudgetDialogOpen" @close="isBudgetDialogOpen = false" />
  </NLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NLayout, NButton } from 'naive-ui'
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'
import AppMobileDrawer from '@/shared/components/organisms/AppMobileDrawer.vue'
import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'
import BudgetDialog from '@/modules/budgets/ui/components/BudgetDialog.vue'
import GlobalHeader from '@/shared/components/organisms/GlobalHeader.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { useViewHeader } from '@/shared/composables/useViewHeader'

const route = useRoute()
const scrollerRef = ref<HTMLElement | null>(null)
const isMobile = useIsMobile()
const isMobileDrawerOpen = ref(false)
const isTransactionDialogOpen = ref(false)
const isBudgetDialogOpen = ref(false)
const { setScrollY } = useViewHeader()

const emit = defineEmits<{
  (e: 'logout'): void
}>()

const isBudgetsPage = computed(() => route.name === 'budgets')

function handleMobileFAB() {
  if (isBudgetsPage.value) {
    isBudgetDialogOpen.value = true
  } else {
    isTransactionDialogOpen.value = true
  }
}

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
