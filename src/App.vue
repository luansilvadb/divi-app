<template>
  <div class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-bg-main">
      <DashboardView />
    </main>
  </div>
</template>

<script setup lang="ts">
import DashboardView from './modules/dashboard/ui/views/DashboardView.vue'
</script>
