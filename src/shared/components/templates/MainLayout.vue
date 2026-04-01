<template>
  <div class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <!-- Desktop Sidebar -->
    <AppSidebar class="!hidden md:!flex" @logout="emit('logout')" />

    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-[4.5rem] md:pb-0">
      <slot />
    </main>

    <!-- Mobile Bottom Bar -->
    <AppBottomBar />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import AppBottomBar from '@/shared/components/organisms/AppBottomBar.vue'

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>
