<template>
  <header class="global-header flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm sticky top-0 z-40">
    <div class="flex items-center gap-4">
      <!-- Search focus or Breadcrumbs could go here -->
    </div>
    
    <div class="flex items-center gap-3">
      <SyncStatusIndicator />
      
      <!-- Placeholder for other global actions like notifications -->
      <div class="h-8 w-[1px] bg-black/5 dark:bg-white/5 mx-1"></div>
      
      <button class="flex items-center justify-center w-9 h-9 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 text-text-secondary hover:text-text-primary transition-colors">
        <i class="pi pi-bell text-[1.1rem]"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import SyncStatusIndicator from '@/shared/components/molecules/SyncStatusIndicator.vue'
</script>

<style scoped>
.global-header {
  min-height: 64px;
}
</style>
