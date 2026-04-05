<template>
  <aside
    class="sidebar !hidden md:!flex transition-all duration-300 ease-in-out"
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
            <!-- Separator -->
            <div v-if="item.separator" class="my-4 mx-6 border-t border-black/5 dark:border-white/5" :class="{ 'hidden': isCollapsed }"></div>

            <!-- Router Link Item -->
            <RouterLink v-else-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate" :class="[
                  'sidebar-nav-item flex items-center px-4 py-3.5 cursor-pointer rounded-2xl transition-all duration-300 mx-3 mb-1 relative overflow-hidden group',
                  isActive ? 'bg-primary-main/10 text-primary-main is-active' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]">
                    <!-- Background Glow on Active -->
                    <div v-if="isActive" class="absolute inset-0 bg-primary-main/5 blur-xl"></div>
                    
                    <span :class="[item.icon, isActive ? 'scale-110' : 'group-hover:scale-110']" class="text-xl transition-transform duration-300 relative z-10" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                    <span class="ml-3 font-medium truncate transition-all duration-300 relative z-10" :class="{ 'opacity-0 w-0 hidden': isCollapsed, 'font-bold': isActive }">{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto relative z-10 transition-opacity duration-300" :class="{ 'opacity-0 scale-0': isCollapsed }" :value="item.badge" />
                </a>
            </RouterLink>

            <!-- Action Item (e.g., Logout) -->
            <a v-else-if="item.action" v-bind="props.action" @click="item.action" :class="[
                  'sidebar-nav-item flex items-center px-4 py-3.5 cursor-pointer rounded-2xl transition-all duration-300 mx-3 mb-1 group',
                  item.class || 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]">
                <span :class="item.icon" class="text-xl group-hover:scale-110 transition-transform duration-300" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                <span class="ml-3 font-medium truncate transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
            </a>

            <!-- Dynamic Component -->
            <component :is="item.component" v-else-if="item.component" v-bind="item.props" />

            <!-- Plain Link -->
            <a v-else :class="[
                  'sidebar-nav-item flex items-center px-4 py-3.5 cursor-pointer rounded-2xl transition-all duration-300 mx-3 mb-1 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 group'
                ]">
                <span :class="item.icon" class="text-xl group-hover:scale-110 transition-transform duration-300" v-tooltip.right="isCollapsed ? item.label : undefined"></span>
                <span class="ml-3 font-medium truncate transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">{{ item.label }}</span>
            </a>
        </template>
        <template #submenuheader="{ item }">
            <div class="px-7 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-disabled mt-4 mb-1" :class="{ 'opacity-0 h-0 p-0 hidden': isCollapsed }">
                {{ item.label }}
            </div>
        </template>
    </Menu>

    <!-- Theme Toggle Area -->
    <div class="mt-auto px-4 mb-2 flex flex-col gap-2">
      <!-- User Profile -->
      <div v-if="user" class="user-profile transition-all duration-300 mx-2 p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10" :class="{ 'justify-center !px-0 !mx-1': isCollapsed }">
        <div class="user-avatar min-w-[36px] h-[36px] rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-main/20">
            <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name || user.email" class="w-full h-full object-cover">
            <div v-else class="w-full h-full bg-primary-main text-white flex items-center justify-center font-bold text-sm uppercase">
                {{ (user.name || user.email).charAt(0) }}
            </div>
        </div>
        <div class="user-info flex flex-col overflow-hidden transition-all duration-300" :class="{ 'opacity-0 w-0 hidden': isCollapsed }">
            <span class="text-sm font-bold truncate">{{ user.name || 'Usuário' }}</span>
            <span class="text-[10px] text-text-secondary truncate">{{ user.email }}</span>
        </div>
      </div>

      <div class="flex justify-center my-2">
        <ThemeToggle />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'
import { createMainNavigation } from '../../config/navigation'
import type { User } from '../../../modules/auth/domain/entities/User'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import ThemeToggle from '../molecules/ThemeToggle.vue'

const props = defineProps<{
  user?: User | null
}>()

const emit = defineEmits(['logout'])

const sidebarStore = useSidebarStore()
useTheme()

const isCollapsed = computed({
  get: () => !sidebarStore.isExpanded,
  set: (val: boolean) => sidebarStore.setExpanded(!val),
})

const menuItems = computed(() =>
  createMainNavigation({ onLogout: () => emit('logout') })
)

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
</script>

<style scoped>
@reference "../../../core/styles/main.css";

/* ===== Variables & Design Tokens ===== */
:is(.sidebar) {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 84px;
  --transition-speed: 0.5s;
  --transition-timing: cubic-bezier(0.34, 1.56, 0.64, 1);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.04);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}

:is(.dark) .sidebar {
  --glass-bg: rgba(15, 20, 31, 0.85);
  --glass-border: rgba(255, 255, 255, 0.05);
  --glass-shadow: 0 12px 48px -12px rgba(0, 0, 0, 0.6);
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
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-right: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  z-index: 50;
  will-change: width;
  contain: paint;
  transition: width var(--transition-speed) var(--transition-timing);
}

.sidebar-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url('assets/noise.png');
  mix-blend-mode: overlay;
  z-index: 1;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar.low-power-mode {
  transition: none;
  backdrop-filter: none;
}

/* ===== Header (Logo & Toggle) ===== */
.sidebar-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.25rem 2rem 1.75rem;
  min-height: 100px;
  transition: padding var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-header {
  padding: 2rem 0;
  justify-content: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  min-width: 0;
  opacity: 1;
  transform: translateX(0);
  transition: all var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-brand {
  opacity: 0;
  transform: scale(0.8) translateX(-30px);
  pointer-events: none;
  max-width: 0;
  visibility: hidden;
}

.sidebar-brand:hover {
    transform: scale(1.02);
}

.sidebar-brand:hover .sidebar-logo-icon {
    transform: rotate(-10deg) scale(1.1);
}

.sidebar-logo-icon {
  flex-shrink: 0;
  margin-right: 1rem;
  filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--color-primary-main), transparent 70%));
}

.sidebar-brand-text {
  font-size: 2rem;
  font-weight: 950;
  letter-spacing: -0.06em;
  background: linear-gradient(135deg,
    var(--color-primary-main) 0%,
    var(--color-secondary-main) 45%,
    var(--color-accent-main) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
}

.sidebar-master-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.4s var(--transition-timing);
  z-index: 10;
  flex-shrink: 0;
}

:is(.dark) .sidebar-master-toggle {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-master-toggle:hover {
  background: var(--color-primary-main);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main), transparent 60%);
}

.sidebar--collapsed .sidebar-master-toggle {
  background: transparent;
  width: 100%;
  height: auto;
  padding: 1rem 0;
  border-radius: 0;
}

.sidebar--collapsed .sidebar-master-toggle:hover {
    background: rgba(0,0,0,0.05);
    color: var(--color-primary-main);
    transform: none;
    box-shadow: none;
}

:is(.dark).sidebar--collapsed .sidebar-master-toggle:hover {
    background: rgba(255,255,255,0.05);
}

/* User Profile Improvements */
.user-profile {
    position: relative;
    overflow: hidden;
}

.user-profile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
}

.user-profile:hover::before {
    transform: translateX(100%);
}

.user-avatar {
    transition: transform 0.3s var(--transition-timing);
}

.user-profile:hover .user-avatar {
    transform: scale(1.05) rotate(5deg);
}

/* Menu Item Styling Refinements */
.sidebar-nav-item {
    position: relative;
    overflow: hidden;
}

.sidebar-nav-item:hover .pi {
    transform: scale(1.1) rotate(-5deg);
}

.sidebar-nav-item.is-active {
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main), transparent 80%);
}

.sidebar-nav-item.is-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    background: var(--color-primary-main);
    border-radius: 0 4px 4px 0;
    z-index: 20;
}

.sidebar--collapsed .sidebar-nav-item {
    padding-left: 0;
    padding-right: 0;
    justify-content: center;
}

.sidebar--collapsed .sidebar-nav-item .ml-3 {
    margin-left: 0;
}
</style>
