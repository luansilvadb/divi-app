const fs = require('fs');
const content = `<template>
  <!-- Using Drawer with mask hidden and explicit visible true for static desktop layout -->
  <Drawer
    :visible="true"
    :modal="false"
    :showCloseIcon="false"
    :dismissable="false"
    class="!hidden md:!flex transition-all duration-300 ease-in-out !shadow-none"
    :class="{
      'w-[80px]': isCollapsed,
      'w-[260px]': !isCollapsed,
      '!transition-none': sidebarStore.isLowPowerMode,
    }"
    :pt="{
      mask: { class: 'hidden' },
      root: { class: 'h-screen sticky top-0 bg-white/60 dark:bg-[#131824]/70 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 flex flex-col z-50' },
      header: { class: 'hidden' },
      content: { class: 'p-0 flex flex-col h-full overflow-hidden' }
    }"
  >
    <div class="sidebar-noise" aria-hidden="true"></div>

    <!-- Logo Header -->
    <div
      class="relative z-10 flex items-center min-h-[80px] transition-all duration-300 overflow-visible"
      :class="isCollapsed ? 'justify-center p-6 px-0' : 'justify-between py-6 px-4 pl-7'"
    >
      <RouterLink
        to="/"
        class="flex items-center no-underline min-w-0 transition-all duration-300"
        :class="isCollapsed ? 'opacity-0 -translate-x-5 max-w-0 invisible' : 'opacity-100 translate-x-0'"
      >
        <div class="shrink-0 mr-4">
          <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="11" fill="url(#sidebarLogoGrad)" />
            <path d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z" fill="white" fill-opacity="0.95" />
            <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.6" />
            <defs>
              <linearGradient id="sidebarLogoGrad" x1="0" y1="0" x2="44" y2="44">
                <stop stop-color="var(--color-primary-main)" />
                <stop offset="0.5" stop-color="var(--color-secondary-main)" />
                <stop offset="1" stop-color="var(--color-accent-main)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-main via-secondary-main to-accent-main">
          Divi
        </span>
      </RouterLink>

      <!-- Superior Toggle Button -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 text-text-secondary cursor-pointer transition-all duration-300 z-10 shrink-0 border-none"
        :aria-label="isCollapsed ? 'Expandir menu' : 'Recolher menu'"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <!-- Navigation Menu -->
    <Menu :model="menuItems" class="border-none bg-transparent w-full">
        <template #item="{ item, props }">
            <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate" :class="[
                  'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2',
                  isActive ? 'bg-primary-main/10 text-primary-main font-bold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]">
                    <span :class="item.icon" class="text-xl" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                    <span class="ml-3 truncate transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                </a>
            </RouterLink>
            <component :is="item.component" v-else-if="item.component" v-bind="item.props" />
            <a v-else-if="item.action" v-bind="props.action" @click="item.action" :class="[
                  'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5',
                  item.class
                ]">
                <span :class="item.icon" class="text-xl" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                <span class="ml-3 truncate transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
            </a>
        </template>
        <template #submenuheader="{ item }">
            <div class="px-6 py-2 text-xs font-bold uppercase tracking-wider text-text-disabled mt-2" :class="{ 'opacity-0 h-0 p-0 hidden': isCollapsed }">
                {{ item.label }}
            </div>
        </template>
    </Menu>

    <!-- Theme Toggle Area -->
    <div class="mt-auto p-4 flex justify-center mb-4">
      <ThemeToggle />
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import ThemeToggle from '../molecules/ThemeToggle.vue'

const emit = defineEmits(['logout'])

const sidebarStore = useSidebarStore()
useTheme()

const isCollapsed = computed({
  get: () => !sidebarStore.isExpanded,
  set: (val: boolean) => sidebarStore.setExpanded(!val),
})

const lgQuery = window.matchMedia('(max-width: 1024px)')

function handleBreakpointChange(e: MediaQueryListEvent | MediaQueryList) {
  if (e.matches) {
    sidebarStore.setExpanded(false)
  } else {
    sidebarStore.setExpanded(true)
  }
}

onMounted(() => {
  sidebarStore.initPerformanceDetection()
  handleBreakpointChange(lgQuery)
  lgQuery.addEventListener('change', handleBreakpointChange)
})

onBeforeUnmount(() => {
  lgQuery.removeEventListener('change', handleBreakpointChange)
})

const menuItems = computed(() => [
    {
        label: 'Menu Principal',
        items: [
            { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
            { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
            { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
            { label: 'Metas', icon: 'pi pi-bullseye', route: '/goals' },
            { label: 'Empréstimos', icon: 'pi pi-credit-card', route: '/loans' },
            { label: 'Assinaturas', icon: 'pi pi-history', route: '/subscriptions' }
        ]
    },
    {
        label: 'Análise',
        items: [
            { label: 'Calendário', icon: 'pi pi-calendar', route: '/calendar' },
            { label: 'Relatórios', icon: 'pi pi-chart-line', route: '/reports' },
            { label: 'Atividades', icon: 'pi pi-file', route: '/activity-log' }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        class: 'text-error-main hover:bg-error-main/10',
        action: () => emit('logout')
    }
])
</script>

<style scoped>
@reference "../../../core/styles/main.css";
</style>
`;
fs.writeFileSync('src/shared/components/organisms/AppSidebar.vue', content);
