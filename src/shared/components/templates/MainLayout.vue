<template>
  <NLayout has-sider class="h-screen w-screen !bg-zinc-50 dark:!bg-zinc-950">
    <!-- Desktop Sidebar -->
    <AppSidebar v-if="!isMobile" @logout="emit('logout')" />

    <NLayout class="!bg-transparent">
      <NLayoutContent
        embedded
        :native-scrollbar="false"
        class="!bg-transparent h-full flex flex-col"
        :content-style="{ paddingBottom: isMobile ? '5rem' : '0' }"
      >
        <!-- Top header -->
        <GlobalHeader />

        <div id="main-scroll-container" class="flex-1 p-6 md:p-12">
          <slot />
        </div>
      </NLayoutContent>
    </NLayout>

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
      @click="isTransactionDialogOpen = true"
    >
      <template #icon>
        <i class="i-lucide-plus text-2xl"></i>
      </template>
    </NButton>

    <!-- Global Transaction Dialog -->
    <TransactionDialog :show="isTransactionDialogOpen" @close="isTransactionDialogOpen = false" />
  </NLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutContent, NButton } from 'naive-ui'
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'
import AppMobileDrawer from '@/shared/components/organisms/AppMobileDrawer.vue'
import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'
import GlobalHeader from '@/shared/components/organisms/GlobalHeader.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'

const isMobile = useIsMobile()
const isMobileDrawerOpen = ref(false)
const isTransactionDialogOpen = ref(false)

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>
