<template>
  <aside
    v-motion
    :variants="{
      expanded: { width: '260px' },
      collapsed: { width: '80px' },
    }"
    :animate="isCollapsed ? 'collapsed' : 'expanded'"
    :transition="
      sidebarStore.isLowPowerMode
        ? { duration: 0 }
        : {
            type: 'spring',
            stiffness: 250,
            damping: 25,
            mass: 0.5,
          }
    "
    class="sidebar !hidden md:!flex"
    :class="{
      'sidebar--collapsed': isCollapsed,
      'low-power-mode': sidebarStore.isLowPowerMode,
    }"
  >
    <div class="sidebar-noise" aria-hidden="true"></div>

    <!-- Logo Header -->
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-brand">
        <div class="sidebar-logo-icon">
          <svg
            width="34"
            height="34"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="44" height="44" rx="11" fill="url(#sidebarLogoGrad)" />
            <path
              d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
              fill="white"
              fill-opacity="0.95"
            />
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
        <span class="sidebar-brand-text">Divi</span>
      </RouterLink>

      <!-- Superior Toggle Button -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="sidebar-master-toggle"
        :aria-label="isCollapsed ? 'Expandir menu' : 'Recolher menu'"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <!-- Navigation Menu -->
    <Menu :model="menuItems" class="border-none bg-transparent w-full">
        <template #item="{ item, props }">
            <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive, isExactActive }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate" :class="[
                  'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2',
                  isActive ? 'bg-primary-main/10 text-primary-main font-bold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]">
                    <span :class="item.icon" class="text-xl" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                    <span class="ml-3 truncate transition-opacity duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                </a>
            </RouterLink>
            <a v-else-if="item.action" v-bind="props.action" @click="item.action" :class="[
                  'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5',
                  item.class
                ]">
                <span :class="item.icon" class="text-xl" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                <span class="ml-3 truncate transition-opacity duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
            </a>
        </template>
        <template #submenuheader="{ item }">
            <div class="px-6 py-2 text-xs font-bold uppercase tracking-wider text-text-disabled mt-2" :class="{ 'opacity-0 h-0 p-0 hidden': isCollapsed }">
                {{ item.label }}
            </div>
        </template>
    </Menu>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'

const emit = defineEmits(['logout'])

const sidebarStore = useSidebarStore()
const { isDark, toggle: toggleTheme } = useTheme()

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
        label: isDark.value ? 'Modo Claro' : 'Modo Escuro',
        icon: isDark.value ? 'pi pi-sun' : 'pi pi-moon',
        action: toggleTheme
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

/* ===== Variables & Design Tokens ===== */
:is(.sidebar) {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --transition-speed: 0.4s;
  --transition-timing: cubic-bezier(0.25, 1, 0.5, 1);
}

/* ===== Sidebar Shell ===== */
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 100vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(40px) saturate(1.6);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 1px 0 0 0 rgba(255, 255, 255, 0.4), 4px 0 32px -4px rgba(0, 0, 0, 0.04);
  z-index: 50;
  will-change: transform, width;
  contain: paint;
  transition: background-color 0.3s ease;
}

:is(.dark) .sidebar {
  background: rgba(19, 24, 36, 0.7);
  border-right-color: rgba(255, 255, 255, 0.04);
  box-shadow: 1px 0 0 0 rgba(255, 255, 255, 0.02), 8px 0 40px -8px rgba(0, 0, 0, 0.4);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

/* ===== Header (Logo & Toggle) ===== */
.sidebar-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem 1.5rem 1.75rem;
  min-height: 80px;
  overflow: visible;
  transition: padding var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-header {
  padding: 1.5rem 0;
  justify-content: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  min-width: 0;
  opacity: 1;
  transform: translateX(0);
  transition: opacity calc(var(--transition-speed) * 0.4) var(--transition-timing),
              transform var(--transition-speed) var(--transition-timing),
              max-width var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-brand {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
  max-width: 0;
  visibility: hidden;
}

.sidebar-logo-icon {
  flex-shrink: 0;
  margin-right: 1rem;
}

.sidebar-brand-text {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, var(--color-primary-main) 0%, var(--color-secondary-main) 55%, var(--color-accent-main) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-master-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s var(--transition-timing);
  z-index: 10;
  flex-shrink: 0;
}
</style>
