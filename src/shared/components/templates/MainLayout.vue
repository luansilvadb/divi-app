<template>
  <div class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <!-- Desktop Sidebar -->
    <AppSidebar class="!hidden md:!flex" @logout="emit('logout')" />

    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-[4.5rem] md:pb-0 flex flex-col">
      <!-- Top header (Global Status) -->
      <GlobalHeader class="!hidden md:!flex" />
      
      <div class="flex-1 p-6 md:p-12 overflow-y-auto overflow-x-hidden">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Bar -->
    <AppBottomBar @open-drawer="isMobileDrawerOpen = true" />

    <!-- Mobile Drawer -->
    <AppMobileDrawer
      :is-open="isMobileDrawerOpen"
      @close="isMobileDrawerOpen = false"
      @logout="emit('logout')"
    />

    <!-- Global Floating Action Button (FAB) - Desktop and Mobile Strategy -->
    <BaseButton
      v-if="isMobile"
      variant="primary"
      :pt="{
        root: {
          class: 'fixed bottom-[5.5rem] right-6 !w-14 !h-14 !rounded-full !p-0 flex items-center justify-center !bg-[#2A2F3E] !text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/5 hover:!bg-[#353b4d] active:scale-90 transition-all z-[110]'
        }
      }"
      @click="isTransactionDialogOpen = true"
      aria-label="Nova Transação"
    >
      <i class="pi pi-plus text-xl"></i>
    </BaseButton>

    <!-- Global Transaction Dialog -->
    <TransactionDialog
      :show="isTransactionDialogOpen"
      @close="isTransactionDialogOpen = false"
    />
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
