<template>
  <nav
    class="app-bottom-bar flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-main border-t border-black/5 dark:border-white/5 justify-around items-center h-[4.5rem] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="bottom-nav-item flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200"
      active-class="!text-primary-main"
      :aria-label="item.label"
    >
      <div class="bottom-nav-icon mb-1" v-html="item.icon"></div>
      <span class="text-[10px] font-bold tracking-wider uppercase">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="14" y="10" width="7" height="11" rx="1.5"/><rect x="3" y="13" width="7" height="8" rx="1.5"/></svg>`,
  },
  {
    to: '/transactions',
    label: 'Transações',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l3-3h14"/><path d="M22 7l-3 3H5"/><polyline points="17 12 19 14 17 16"/><polyline points="7 8 5 10 7 12"/></svg>`,
  },
  {
    to: '/budgets',
    label: 'Orçamentos',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2"/></svg>`,
  },
  {
    to: '/goals',
    label: 'Metas',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  },
  {
    to: '/loans',
    label: 'Emprést.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
  },
]
</script>

<style scoped>
.bottom-nav-item:active {
  transform: scale(0.95);
}

/* Fallback for env(safe-area-inset-bottom) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
