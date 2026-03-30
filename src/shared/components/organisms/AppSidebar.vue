<template>
  <aside 
    class="sidebar"
    :class="{ 'sidebar--collapsed': isCollapsed }"
  >
    <!-- Subtle background effects -->
    <div class="sidebar-bg" aria-hidden="true">
      <div class="sidebar-orb sidebar-orb--1"></div>
      <div class="sidebar-orb sidebar-orb--2"></div>
    </div>
    <div class="sidebar-noise" aria-hidden="true"></div>

    <!-- Logo Header -->
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-brand">
        <div class="sidebar-logo-icon">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="12" fill="url(#sidebarLogoGrad)"/>
            <path d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z" fill="white" fill-opacity="0.95"/>
            <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.6"/>
            <defs>
              <linearGradient id="sidebarLogoGrad" x1="0" y1="0" x2="44" y2="44">
                <stop stop-color="var(--color-primary-main)"/>
                <stop offset="0.5" stop-color="var(--color-secondary-main)"/>
                <stop offset="1" stop-color="var(--color-accent-main)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="sidebar-brand-text">Divi</span>
        </transition>
      </RouterLink>

      <button 
        @click="isCollapsed = !isCollapsed"
        class="sidebar-toggle"
        :aria-label="isCollapsed ? 'Expandir menu' : 'Recolher menu'"
      >
        <svg 
          class="sidebar-toggle-icon" 
          :class="{ 'sidebar-toggle-icon--rotated': isCollapsed }"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="sidebar-nav-group">
        <span v-if="!isCollapsed" class="sidebar-nav-label">Menu Principal</span>
        <div v-else class="sidebar-nav-divider"></div>
      </div>
      
      <RouterLink
        v-for="(item, index) in mainNavItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-nav-item"
        active-class="sidebar-nav-item--active"
        :style="{ '--item-delay': `${index * 30}ms` }"
      >
        <div class="sidebar-nav-item-indicator"></div>
        <div class="sidebar-nav-item-icon" v-html="item.icon"></div>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="sidebar-nav-item-label">{{ item.label }}</span>
        </transition>
        <transition name="fade">
          <span v-if="!isCollapsed && item.badge" class="sidebar-nav-item-badge">{{ item.badge }}</span>
        </transition>
      </RouterLink>

      <div class="sidebar-nav-group" style="margin-top: 0.5rem;">
        <span v-if="!isCollapsed" class="sidebar-nav-label">Análise</span>
        <div v-else class="sidebar-nav-divider"></div>
      </div>

      <RouterLink
        v-for="(item, index) in analysisNavItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-nav-item"
        active-class="sidebar-nav-item--active"
        :style="{ '--item-delay': `${(index + mainNavItems.length) * 30}ms` }"
      >
        <div class="sidebar-nav-item-indicator"></div>
        <div class="sidebar-nav-item-icon" v-html="item.icon"></div>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="sidebar-nav-item-label">{{ item.label }}</span>
        </transition>
      </RouterLink>
    </nav>

    <!-- User section / Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-footer-divider"></div>
      
      <!-- Theme toggle -->
      <button 
        @click="toggleTheme"
        class="sidebar-footer-btn"
        :class="{ 'sidebar-footer-btn--centered': isCollapsed }"
      >
        <div class="sidebar-nav-item-icon" v-html="isDark ? sunIcon : moonIcon"></div>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="sidebar-footer-btn-label">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </transition>
      </button>

      <!-- Logout -->
      <button 
        @click="$emit('logout')"
        class="sidebar-footer-btn sidebar-footer-btn--danger"
        :class="{ 'sidebar-footer-btn--centered': isCollapsed }"
      >
        <div class="sidebar-nav-item-icon" v-html="logoutIcon"></div>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="sidebar-footer-btn-label">Sair</span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../../../core/theme'

defineEmits(['logout'])

const { isDark, toggle: toggleTheme } = useTheme()
const isCollapsed = ref(false)

// Collapse on small screens
function handleResize() {
  if (window.innerWidth < 1024) {
    isCollapsed.value = true
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// SVG Icons (Lucide-inspired, clean line icons)
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
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="10" width="7" height="11" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/></svg>`,
  },
  { 
    to: '/transactions', 
    label: 'Transações',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l3-3h14"/><path d="M22 7l-3 3H5"/><polyline points="17 12 19 14 17 16"/><polyline points="7 8 5 10 7 12"/></svg>`,
  },
  { 
    to: '/budgets', 
    label: 'Orçamentos',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2"/></svg>`,
  },
  { 
    to: '/goals', 
    label: 'Metas',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  },
  { 
    to: '/loans', 
    label: 'Empréstimos',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
  },
  { 
    to: '/subscriptions', 
    label: 'Assinaturas',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/><path d="M12 7v5l3 3"/></svg>`,
  },
]

const analysisNavItems: NavItem[] = [
  { 
    to: '/calendar', 
    label: 'Calendário',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="3" height="3" rx="0.5"/></svg>`,
  },
  { 
    to: '/reports', 
    label: 'Relatórios',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 5-9"/></svg>`,
  },
  { 
    to: '/activity-log', 
    label: 'Atividades',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`,
  },
]

const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`

const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`

const logoutIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
</script>

<style scoped>
@reference "../../../core/styles/main.css";

/* ===== Sidebar Shell ===== */
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    1px 0 0 0 rgba(255, 255, 255, 0.5),
    4px 0 24px -4px rgba(0, 0, 0, 0.06);
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 40;
}

:is(.dark) .sidebar {
  background: rgba(22, 27, 34, 0.7);
  border-right-color: rgba(255, 255, 255, 0.06);
  box-shadow: 
    1px 0 0 0 rgba(255, 255, 255, 0.03),
    4px 0 24px -4px rgba(0, 0, 0, 0.3);
}

.sidebar--collapsed {
  width: 76px;
}

/* ===== Background Effects ===== */
.sidebar-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.sidebar-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.12;
  will-change: transform;
}

:is(.dark) .sidebar-orb {
  opacity: 0.15;
}

.sidebar-orb--1 {
  width: 200px;
  height: 200px;
  background: var(--color-primary-main);
  top: -40px;
  left: -40px;
  animation: sidebar-float-1 20s ease-in-out infinite;
}

.sidebar-orb--2 {
  width: 160px;
  height: 160px;
  background: var(--color-secondary-main);
  bottom: 5%;
  right: -30px;
  animation: sidebar-float-2 25s ease-in-out infinite;
}

@keyframes sidebar-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 30px) scale(1.1); }
}

@keyframes sidebar-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-15px, -20px) scale(1.05); }
}

.sidebar-noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

/* ===== Header ===== */
.sidebar-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem 1.25rem 1.25rem;
  min-height: 68px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  min-width: 0;
}

.sidebar-logo-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-brand:hover .sidebar-logo-icon {
  transform: scale(1.06) rotate(-2deg);
}

.sidebar-brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(
    135deg,
    var(--color-primary-main) 0%,
    var(--color-secondary-main) 50%,
    var(--color-accent-main) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  white-space: nowrap;
}

.sidebar-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text-primary);
}

:is(.dark) .sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-toggle-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-toggle-icon--rotated {
  transform: rotate(180deg);
}

/* ===== Navigation ===== */
.sidebar-nav {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 0.25rem 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.sidebar-nav-group {
  padding: 0.5rem 0.5rem 0.25rem;
}

.sidebar-nav-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-disabled);
  white-space: nowrap;
}

.sidebar-nav-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
  margin: 0.25rem 0;
}

/* ===== Nav Items ===== */
.sidebar-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 10px;
  color: var(--color-text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 2px;
  overflow: hidden;
}

.sidebar-nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  transition: background 0.2s ease;
  z-index: 0;
}

.sidebar-nav-item:hover::before {
  background: rgba(0, 0, 0, 0.04);
}

:is(.dark) .sidebar-nav-item:hover::before {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav-item:hover {
  color: var(--color-text-primary);
}

.sidebar-nav-item:active {
  transform: scale(0.98);
}

.sidebar-nav-item-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 60%;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, var(--color-primary-main), var(--color-secondary-main));
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-nav-item--active .sidebar-nav-item-indicator {
  transform: translateY(-50%) scaleY(1);
}

.sidebar-nav-item--active {
  color: var(--color-text-primary);
}

.sidebar-nav-item--active::before {
  background: rgba(0, 0, 0, 0.05);
}

:is(.dark) .sidebar-nav-item--active::before {
  background: rgba(255, 255, 255, 0.07);
}

.sidebar-nav-item-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.sidebar-nav-item-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.sidebar-nav-item--active .sidebar-nav-item-icon {
  color: var(--color-secondary-main);
}

.sidebar-nav-item-label {
  position: relative;
  z-index: 1;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
}

.sidebar-nav-item--active .sidebar-nav-item-label {
  font-weight: 600;
}

.sidebar-nav-item-badge {
  position: relative;
  z-index: 1;
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  line-height: 1.5;
}

/* ===== Footer ===== */
.sidebar-footer {
  position: relative;
  z-index: 2;
  padding: 0.5rem 0.75rem 1rem;
}

.sidebar-footer-divider {
  height: 1px;
  margin: 0 0.25rem 0.5rem;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
}

.sidebar-footer-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
}

.sidebar-footer-btn--centered {
  justify-content: center;
}

.sidebar-footer-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text-primary);
}

:is(.dark) .sidebar-footer-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.sidebar-footer-btn--danger:hover {
  background: rgba(var(--color-error-main), 0.08);
  color: var(--color-error-main);
}

.sidebar-footer-btn--danger:hover {
  background: color-mix(in srgb, var(--color-error-main) 8%, transparent);
  color: var(--color-error-main);
}

.sidebar-footer-btn-label {
  white-space: nowrap;
  line-height: 1;
}

/* ===== Transitions ===== */
.fade-slide-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Collapsed State Adjustments ===== */
.sidebar--collapsed .sidebar-header {
  justify-content: center;
  padding: 1.25rem 0.5rem;
}

.sidebar--collapsed .sidebar-brand {
  justify-content: center;
}

.sidebar--collapsed .sidebar-toggle {
  display: none;
}

.sidebar--collapsed .sidebar-nav {
  padding: 0.25rem 0.5rem;
}

.sidebar--collapsed .sidebar-nav-group {
  padding: 0.5rem 0;
}

.sidebar--collapsed .sidebar-nav-item {
  justify-content: center;
  padding: 0.625rem;
}

.sidebar--collapsed .sidebar-nav-item-indicator {
  width: 3px;
  height: 40%;
}

.sidebar--collapsed .sidebar-footer {
  padding: 0.5rem 0.5rem 1rem;
}

.sidebar--collapsed .sidebar-footer-btn {
  justify-content: center;
  padding: 0.625rem;
}

/* ===== Tooltip for collapsed state ===== */
.sidebar--collapsed .sidebar-nav-item {
  position: relative;
}

.sidebar--collapsed .sidebar-nav-item::after {
  content: attr(aria-label);
  display: none;
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .sidebar-orb {
    animation: none !important;
  }
  
  .sidebar,
  .sidebar-nav-item,
  .sidebar-toggle-icon {
    transition-duration: 0.01ms !important;
  }
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
  }
}
</style>
