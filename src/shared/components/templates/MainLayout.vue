<template>
  <div class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <!-- Desktop Sidebar -->
    <AppSidebar class="!hidden md:!flex" :user="user" @logout="emit('logout')" />

    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-[4.5rem] md:pb-0">
      <slot />
    </main>

    <!-- Mobile Bottom Bar -->
    <AppBottomBar @open-drawer="isMobileDrawerOpen = true" />

    <!-- Mobile Drawer -->
    <AppMobileDrawer
      :is-open="isMobileDrawerOpen"
      :user="user"
      @close="isMobileDrawerOpen = false"
      @logout="emit('logout')"
    />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'
import AppMobileDrawer from '@/shared/components/organisms/AppMobileDrawer.vue'
import { ref } from 'vue'
import type { User } from '@/modules/auth/domain/entities/User'

const props = defineProps<{
  user?: User | null
}>()

const isMobileDrawerOpen = ref(false)

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>
