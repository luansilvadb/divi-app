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
        <svg
          class="sidebar-toggle-icon"
          :class="{ 'sidebar-toggle-icon--rotated': isCollapsed }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="sidebar-nav-group">
        <span class="sidebar-nav-label">Menu Principal</span>
        <div class="sidebar-nav-divider"></div>
      </div>

      <RouterLink
        v-for="(item, index) in mainNavItems"
        :key="item.to"
        :to="item.to"
        v-memo="[item.to, item.badge, isCollapsed]"
        class="sidebar-nav-item"
        active-class="sidebar-nav-item--active"
        :style="{ '--item-delay': `${index * 30}ms` }"
        :aria-label="item.label"
        @mouseenter="handlePrefetch(item.to)"
      >
        <div class="sidebar-nav-item-indicator"></div>
        <div class="sidebar-nav-item-icon-wrapper">
          <div class="sidebar-nav-item-icon" v-html="item.icon"></div>
        </div>
        <div class="sidebar-nav-item-content">
          <span class="sidebar-nav-item-label">{{ item.label }}</span>
          <span v-if="item.badge" class="sidebar-nav-item-badge">{{ item.badge }}</span>
        </div>
      </RouterLink>

      <div class="sidebar-nav-group" style="margin-top: 1rem">
        <span class="sidebar-nav-label">Análise</span>
        <div class="sidebar-nav-divider"></div>
      </div>

      <RouterLink
        v-for="(item, index) in analysisNavItems"
        :key="item.to"
        :to="item.to"
        v-memo="[item.to, isCollapsed]"
        class="sidebar-nav-item"
        active-class="sidebar-nav-item--active"
        :style="{ '--item-delay': `${(index + mainNavItems.length) * 30}ms` }"
        :aria-label="item.label"
        @mouseenter="handlePrefetch(item.to)"
      >
        <div class="sidebar-nav-item-indicator"></div>
        <div class="sidebar-nav-item-icon-wrapper">
          <div class="sidebar-nav-item-icon" v-html="item.icon"></div>
        </div>
        <div class="sidebar-nav-item-content">
          <span class="sidebar-nav-item-label">{{ item.label }}</span>
        </div>
      </RouterLink>
    </nav>

    <!-- User section / Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-footer-divider"></div>

      <!-- Theme toggle -->
      <button @click="toggleTheme" class="sidebar-footer-btn">
        <div class="sidebar-nav-item-icon-wrapper">
          <div class="sidebar-nav-item-icon" v-html="isDark ? sunIcon : moonIcon"></div>
        </div>
        <div class="sidebar-nav-item-content">
          <span class="sidebar-footer-btn-label">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </div>
      </button>

      <!-- Logout -->
      <button @click="$emit('logout')" class="sidebar-footer-btn sidebar-footer-btn--danger">
        <div class="sidebar-nav-item-icon-wrapper">
          <div class="sidebar-nav-item-icon" v-html="logoutIcon"></div>
        </div>
        <div class="sidebar-nav-item-content">
          <span class="sidebar-footer-btn-label">Sair</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'

defineEmits(['logout'])

const sidebarStore = useSidebarStore()
const { isDark, toggle: toggleTheme } = useTheme()

let prefetchTimeout: ReturnType<typeof setTimeout> | null = null
const handlePrefetch = (to: string) => {
  if (prefetchTimeout) clearTimeout(prefetchTimeout)
  prefetchTimeout = setTimeout(() => {
    sidebarStore.prefetchRoute(to)
  }, 100)
}

// Mapeia o estado do store para a prop local (invertida para manter compatibilidade com o template atual)
const isCollapsed = computed({
  get: () => !sidebarStore.isExpanded,
  set: (val: boolean) => sidebarStore.setExpanded(!val),
})

// Breakpoint detection using matchMedia (Efficient & Event-driven)
const lgQuery = window.matchMedia('(max-width: 1024px)')

function handleBreakpointChange(e: MediaQueryListEvent | MediaQueryList) {
  if (e.matches) {
    sidebarStore.setExpanded(false)
  } else {
    sidebarStore.setExpanded(true)
  }
}

onMounted(() => {
  // Initialize performance detection
  sidebarStore.initPerformanceDetection()

  // Set initial state based on current viewport
  handleBreakpointChange(lgQuery)

  // Listen for breakpoint changes
  lgQuery.addEventListener('change', handleBreakpointChange)
})

onBeforeUnmount(() => {
  lgQuery.removeEventListener('change', handleBreakpointChange)
})

// SVG Icons
interface NavItem {
  to: string
  label: string
  icon: string
  badge?: string | number
}

const mainNavItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="14" y="10" width="7" height="11" rx="1.5"/><rect x="3" y="13" width="7" height="8" rx="1.5"/></svg>`,
  },
  {
    to: '/transactions',
    label: 'Transações',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l3-3h14"/><path d="M22 7l-3 3H5"/><polyline points="17 12 19 14 17 16"/><polyline points="7 8 5 10 7 12"/></svg>`,
  },
  {
    to: '/budgets',
    label: 'Orçamentos',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2"/></svg>`,
  },
  {
    to: '/goals',
    label: 'Metas',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  },
  {
    to: '/loans',
    label: 'Empréstimos',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
  },
  {
    to: '/subscriptions',
    label: 'Assinaturas',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/><path d="M12 7v5l3 3"/></svg>`,
  },
]

const analysisNavItems: NavItem[] = [
  {
    to: '/calendar',
    label: 'Calendário',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="3" height="3" rx="0.5"/></svg>`,
  },
  {
    to: '/reports',
    label: 'Relatórios',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 5-9"/></svg>`,
  },
  {
    to: '/activity-log',
    label: 'Atividades',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`,
  },
]

const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
const logoutIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
</script>

<style scoped>
@reference "../../../core/styles/main.css";

/* ===== Variables & Design Tokens ===== */
:is(.sidebar) {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --sidebar-nav-padding: 30px;
  --transition-speed: 0.4s;
  --transition-timing: cubic-bezier(0.25, 1, 0.5, 1); /* Faster initial, smoother end */
  --nav-item-height: 48px;
  --icon-size: 22px;
  --indicator-width: 4px;
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
  -webkit-backdrop-filter: blur(40px) saturate(1.6);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    1px 0 0 0 rgba(255, 255, 255, 0.4),
    4px 0 32px -4px rgba(0, 0, 0, 0.04);
  z-index: 50;

  /* Performance Optimizations (GPU) */
  will-change: transform, width;
  contain: paint;
  transition: background-color 0.3s ease;
}

:is(.dark) .sidebar {
  background: rgba(19, 24, 36, 0.7);
  border-right-color: rgba(255, 255, 255, 0.04);
  box-shadow:
    1px 0 0 0 rgba(255, 255, 255, 0.02),
    8px 0 40px -8px rgba(0, 0, 0, 0.4);
}

/* Low Power Mode - Disable heavy effects */
:is(.low-power-mode) .sidebar {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  background: rgb(255, 255, 255);
}

:is(.dark.low-power-mode) .sidebar {
  background: rgb(19, 24, 36);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.015;
  /* Decision: Physical file is more robust than long Data URIs */
  background-image: url('/assets/noise.png');
  background-repeat: repeat;
  pointer-events: none;

  /* GPU Layer Isolation */
  will-change: opacity;
  contain: paint;
}

:is(.low-power-mode) .sidebar-noise {
  display: none !important;
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
  justify-content: center; /* Aligns toggle to center in collapsed mode */
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
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  transition:
    transform 0.3s var(--transition-timing),
    filter 0.3s ease;
  margin-right: 1rem;
}

.sidebar-brand:hover .sidebar-logo-icon {
  transform: scale(1.08) translateY(-1px);
}

.sidebar-brand-text {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  background: linear-gradient(
    135deg,
    var(--color-primary-main) 0%,
    var(--color-secondary-main) 55%,
    var(--color-accent-main) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  white-space: nowrap;
}

/* Master Toggle Button Stylized */
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

:is(.dark) .sidebar-master-toggle {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-master-toggle:hover,
.sidebar-master-toggle:focus-visible {
  outline: 2px solid var(--color-primary-main);
  outline-offset: -2px;
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

:is(.dark) .sidebar-master-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.sidebar--collapsed .sidebar-master-toggle {
  background: transparent;
  width: 32px; /* Consistency in size */
  height: 32px;
}

.sidebar-toggle-icon {
  width: 18px;
  height: 18px;
  transition: transform var(--transition-speed) var(--transition-timing);
}

.sidebar-toggle-icon--rotated {
  transform: rotate(180deg);
}

/* ===== Navigation ===== */
.sidebar-nav {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 0.25rem 0.625rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  transition: padding var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-nav {
  padding-left: 0;
  padding-right: 0;
}

.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.sidebar-nav-group {
  padding: 0.5rem 0 0.5rem var(--sidebar-nav-padding);
  transition: padding var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-nav-group {
  padding-left: 0;
  text-align: center;
}

.sidebar-nav-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-disabled);
  white-space: nowrap;
  opacity: 1;
  max-height: 20px;
  margin-bottom: 6px;
  transition:
    opacity calc(var(--transition-speed) * 0.3) ease,
    max-height var(--transition-speed) var(--transition-timing),
    margin var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-nav-label {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}

.sidebar-nav-divider {
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
  margin: 0.5rem 0;
  opacity: 0;
  transition: opacity var(--transition-speed) ease;
}

.sidebar--collapsed .sidebar-nav-divider {
  opacity: 1;
  background: linear-gradient(90deg, transparent 20%, var(--color-border-main), transparent 80%);
}

/* ===== Nav Items ===== */
.sidebar-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--nav-item-height);
  border-radius: 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 4px;
  overflow: hidden;
  white-space: nowrap;
  transition:
    color 0.3s var(--transition-timing),
    transform 0.2s var(--transition-timing);
  margin-left: 10px;
  margin-right: 10px;

  /* Performance Optimization */
  contain: content;
}

.sidebar--collapsed .sidebar-nav-item {
  margin-left: 0;
  margin-right: 0;
  border-radius: 0;
  justify-content: center;
}

/* Hover/Active states */
.sidebar-nav-item::before {
  content: '';
  position: absolute;
  inset: 2px 2px;
  border-radius: 12px;
  background: rgba(26, 35, 51, 0.03);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 0;
  will-change: opacity;
  contain: strict;
}

:is(.dark) .sidebar-nav-item::before {
  background: rgba(255, 255, 255, 0.04);
}

.sidebar-nav-item:hover::before,
.sidebar-nav-item:focus-visible::before {
  opacity: 1;
}

.sidebar-nav-item:focus-visible {
  outline: 2px solid var(--color-primary-main);
  outline-offset: -2px;
}

.sidebar-nav-item--active {
  color: var(--color-text-primary);
}

.sidebar-nav-item--active::before {
  opacity: 1;
  background: rgba(var(--color-primary-main-rgb, 0, 0, 0), 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

:is(.dark) .sidebar-nav-item--active::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Indicator (The bar on left) */
.sidebar-nav-item-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleX(0);
  width: var(--indicator-width);
  height: 24px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(to bottom, var(--color-primary-main), var(--color-secondary-main));
  transition:
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.4s ease;
  z-index: 10;
  transform-origin: left;
}

.sidebar-nav-item--active .sidebar-nav-item-indicator {
  transform: translateY(-50%) scaleX(1);
}

.sidebar--collapsed .sidebar-nav-item-indicator {
  height: 32px;
}

/* Icon Wrapper for perfect centering */
.sidebar-nav-item-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  flex-shrink: 0;
  transition: width var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-nav-item-icon-wrapper {
  width: var(--sidebar-collapsed-width);
}

.sidebar-nav-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size);
  height: var(--icon-size);
  transition:
    transform 0.4s var(--transition-timing),
    color 0.3s ease;
}

.sidebar-nav-item-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.sidebar-nav-item--active .sidebar-nav-item-icon {
  color: var(--color-secondary-main);
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
}

.sidebar--collapsed .sidebar-nav-item--active .sidebar-nav-item-icon {
  transform: scale(1.1);
}

/* Label/Content box */
.sidebar-nav-item-content {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 0.25rem;
  overflow: hidden;
  transition:
    opacity calc(var(--transition-speed) * 0.4) var(--transition-timing),
    transform var(--transition-speed) var(--transition-timing);
}

.sidebar--collapsed .sidebar-nav-item-content {
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
}

.sidebar-nav-item-label {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-nav-item-badge {
  margin-left: auto;
  margin-right: 16px;
  padding: 1.5px 7px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  color: white;
  background: var(--color-primary-main);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ===== Footer ===== */
.sidebar-footer {
  position: relative;
  z-index: 2;
  padding: 0.5rem 0.625rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar--collapsed .sidebar-footer {
  padding-left: 0;
  padding-right: 0;
}

.sidebar-footer-divider {
  height: 1.5px;
  margin: 0.5rem 1rem;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
}

.sidebar-footer-btn {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--nav-item-height);
  width: 100%;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s var(--transition-timing);
  overflow: hidden;
}

.sidebar-footer-btn:hover,
.sidebar-footer-btn:focus-visible {
  outline: 2px solid var(--color-primary-main);
  outline-offset: -2px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text-primary);
}

:is(.dark) .sidebar-footer-btn:hover {
  background: rgba(255, 255, 255, 0.04);
}

.sidebar--collapsed .sidebar-footer-btn {
  border-radius: 0;
  justify-content: center;
}

.sidebar-footer-btn-label {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
}

/* ===== Premium Mode Adjustments ===== */
.sidebar--collapsed .sidebar-nav-item:hover .sidebar-nav-item-icon {
  transform: scale(1.15);
  color: var(--color-primary-main);
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-nav-item,
  .sidebar-toggle-icon {
    transition-duration: 0.01ms !important;
  }
}

</style>
