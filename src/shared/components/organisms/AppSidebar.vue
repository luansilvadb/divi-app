<template>
  <aside
    class="sidebar !hidden md:!flex transition-all duration-300 ease-in-out"
    :class="{
      'sidebar--collapsed': isCollapsed,
    }"
  >
    <div class="sidebar-noise" aria-hidden="true"></div>

    <!-- Logo Header -->
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-brand group/logo">
        <div
          class="sidebar-logo-icon transition-transform duration-500 ease-out group-hover/logo:scale-105 group-hover/logo:rotate-3"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="drop-shadow-sm"
          >
            <rect width="44" height="44" rx="12" fill="url(#sidebarLogoGrad)" />
            <path
              d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
              fill="white"
              fill-opacity="0.95"
            />
            <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.8" />
            <defs>
              <linearGradient id="sidebarLogoGrad" x1="0" y1="0" x2="44" y2="44">
                <stop stop-color="#10b981" />
                <!-- Premium Emerald -->
                <stop offset="1" stop-color="#0284c7" />
                <!-- Deep Ocean Blue -->
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

    <!-- Navigation Menu (Scrollable) -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-6 custom-scrollbar">
      <Menu :model="menuItems" class="border-none bg-transparent w-full">
        <template #item="{ item, props }">
          <RouterLink
            v-if="item.route"
            v-slot="{ href, navigate, isActive }"
            :to="item.route"
            custom
          >
            <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
              :class="[
                'flex items-center px-4 py-3 cursor-pointer rounded-xl mx-2 mb-1 group',
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-surface-600 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800/10',
              ]"
            >
              <span
                :class="item.icon"
                class="text-xl group-hover:scale-110"
                v-tooltip.right="isCollapsed ? item.label : undefined"
              ></span>
              <span
                class="ml-3 truncate font-bold text-[0.95rem]"
                :class="{ 'opacity-0 w-0 hidden': isCollapsed }"
                >{{ item.label }}</span
              >
              <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            </a>
          </RouterLink>
          <component :is="item.component" v-else-if="item.component" v-bind="item.props" />
        </template>
        <template #submenuheader="{ item }">
          <div
            class="px-6 py-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface-400/50 dark:text-surface-400/50 mt-4 mb-2"
            :class="{ 'opacity-0 h-0 p-0 hidden': isCollapsed }"
          >
            {{ item.label }}
          </div>
        </template>
      </Menu>
    </div>

    <!-- Sidebar Footer Actions (Menu-style) -->
    <div
      class="sidebar-footer mt-auto flex flex-col pt-4 border-t border-surface-200 dark:border-surface-800/10"
    >
      <div class="flex flex-col gap-1 px-2 mb-4">
        <!-- Logout Item -->
        <button
          @click="emit('logout')"
          class="flex items-center px-4 py-3 cursor-pointer rounded-xl group text-error/60 hover:bg-error/10 hover:text-error"
          :class="{ 'justify-center px-0': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Sair do Sistema' : undefined"
        >
          <i class="pi pi-sign-out text-xl group-hover:scale-110"></i>
          <span
            class="ml-3 truncate font-bold text-[0.95rem]"
            :class="{ 'opacity-0 w-0 hidden': isCollapsed }"
          >
            Sair do App
          </span>
        </button>

        <!-- Theme Toggle Item (Standardized with Nav Items) -->
        <div
          @click="toggleTheme"
          class="flex items-center px-4 py-3 cursor-pointer rounded-xl group text-surface-600 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800/10"
          :class="{ 'justify-center px-0': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Mudar Tema' : undefined"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-xl group-hover:scale-110"></i>
          <span
            class="ml-3 truncate font-bold text-[0.95rem]"
            :class="{ 'opacity-0 w-0 hidden': isCollapsed }"
          >
            Mudar Tema
          </span>
        </div>
      </div>

      <!-- Main User Profile (Compact) -->
      <RouterLink
        to="/profile"
        class="group/user relative flex items-center p-2 mx-2 mb-6 rounded-xl transition-colors duration-300 hover:bg-surface-50 dark:hover:bg-surface-800/10 cursor-pointer select-none no-underline"
        :class="{ 'justify-center mx-0': isCollapsed }"
      >
        <!-- Avatar Area -->
        <div class="relative flex-none">
          <div
            class="w-10 h-10 rounded-full bg-surface-0 dark:bg-surface-800 flex items-center justify-center overflow-hidden border border-black/10 dark:border-white/10 shadow-sm transition-transform duration-500 group-hover/user:scale-110"
          >
            <span class="text-[0.7rem] font-black text-primary">LS</span>
          </div>
          <div
            class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface-main bg-success-main shadow-sm"
          ></div>
        </div>

        <!-- User Info -->
        <div
          class="ml-3 flex-1 min-w-0 transition-opacity duration-300"
          :class="{ 'opacity-0 w-0 hidden': isCollapsed }"
        >
          <div
            class="text-[0.8rem] font-bold text-surface-800 dark:text-surface-50 truncate tracking-tight text-left"
          >
            Luan Silva
          </div>
          <div
            class="text-[0.6rem] font-medium text-surface-600/40 dark:text-surface-200/40 truncate tracking-tight uppercase text-left"
          >
            luan@divi.app
          </div>
        </div>

        <i
          v-if="!isCollapsed"
          class="pi pi-chevron-right text-[0.6rem] text-surface-600/20 dark:text-surface-200/20 transition-transform duration-300 group-hover/user:translate-x-1"
        ></i>
      </RouterLink>
    </div>
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
      { label: 'Assinaturas', icon: 'pi pi-history', route: '/subscriptions' },
    ],
  },
  {
    label: 'Análise',
    items: [
      { label: 'Calendário', icon: 'pi pi-calendar', route: '/calendar' },
      { label: 'Relatórios', icon: 'pi pi-chart-line', route: '/reports' },
      { label: 'Atividades', icon: 'pi pi-file', route: '/activity-log' },
    ],
  },
  {
    label: 'Preferências',
    items: [
      { label: 'Meu Perfil', icon: 'pi pi-user', route: '/profile' },
      { label: 'Configurações', icon: 'pi pi-cog', route: '/settings' },
    ],
  },
])
</script>

<style scoped>
@reference "../../../core/styles/main.css";

/* Custom Scrollbar for premium feel */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
:is(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

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
  box-shadow:
    1px 0 0 0 rgba(255, 255, 255, 0.4),
    4px 0 32px -4px rgba(0, 0, 0, 0.04);
  z-index: 50;
  will-change: transform, width;
  contain: paint;
  transition:
    background-color 0.3s ease,
    width var(--transition-speed) var(--transition-timing);
}

:is(.dark) .sidebar {
  background: rgba(19, 24, 36, 0.7);
  border-right-color: rgba(255, 255, 255, 0.04);
  box-shadow:
    1px 0 0 0 rgba(255, 255, 255, 0.02),
    8px 0 40px -8px rgba(0, 0, 0, 0.4);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar.low-power-mode {
  transition: none;
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
  transition:
    opacity calc(var(--transition-speed) * 0.4) var(--transition-timing),
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
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #10b981 0%, #0284c7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 4px 24px rgba(2, 132, 199, 0.15); /* subtle premium glow */
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
