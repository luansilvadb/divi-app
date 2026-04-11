<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-surface-100 dark:bg-surface-950 text-surface-800 dark:text-surface-50"
  >
    <!-- Desktop Sidebar (Only on Desktop) -->
    <AppSidebar v-if="!isMobile" @logout="emit('logout')" />

    <!-- Main Content Area -->
    <main
      class="flex-1 h-full overflow-y-auto overflow-x-hidden relative flex flex-col"
      :class="{ 'pb-[4.5rem] md:pb-0': isMobile }"
    >
      <!-- Top header (Global Status) -->
      <GlobalHeader />

      <div id="main-scroll-container" class="flex-1 p-6 md:p-12 overflow-y-auto overflow-x-hidden">
        <slot />
      </div>
    </main>

    <!-- Mobile Navigation (Only on Mobile) -->
    <template v-if="isMobile">
      <AppBottomBar @open-drawer="isMobileDrawerOpen = true" />
      <AppMobileDrawer
        :is-open="isMobileDrawerOpen"
        @close="isMobileDrawerOpen = false"
        @logout="emit('logout')"
      />
    </template>

    <!-- Global Floating Action Button (FAB) - Premium Fintech Design -->
    <BaseButton
      v-if="isMobile"
      variant="primary"
      :pt="{
        root: {
          class:
            'group fixed bottom-[6.5rem] right-6 !w-[3.5rem] !h-[3.5rem] !rounded-full !p-0 flex items-center justify-center bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-700 text-surface-900 dark:text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:bg-surface-50 dark:hover:bg-surface-800 hover:-translate-y-0.5 active:!scale-95 transition-all duration-200 z-[110] cursor-pointer',
        },
      }"
      @click="isTransactionDialogOpen = true"
      aria-label="Nova Transação"
    >
      <i class="pi pi-plus text-xl transition-transform duration-200 group-hover:rotate-90"></i>
    </BaseButton>

    <!-- Global Transaction Dialog -->
    <TransactionDialog :show="isTransactionDialogOpen" @close="isTransactionDialogOpen = false" />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'
import AppMobileDrawer from '@/shared/components/organisms/AppMobileDrawer.vue'
import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'
import GlobalHeader from '@/shared/components/organisms/GlobalHeader.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import { ref } from 'vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'

const isMobile = useIsMobile()
const isMobileDrawerOpen = ref(false)
const isTransactionDialogOpen = ref(false)

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>
