<template>
  <NLayoutSider
    collapse-mode="width"
    :collapsed-width="84"
    :width="280"
    :collapsed="isCollapsed"
    show-trigger="arrow-circle"
    @collapse="isCollapsed = true"
    @expand="isCollapsed = false"
    bordered
    class="!bg-zinc-50 dark:!bg-[#0e0e11] smooth-sider-transition"
  >
    <div class="flex flex-col h-full py-2">
      <!-- HEADER / LOGO -->
      <div 
        class="flex items-center w-full pl-[18px] pr-4 h-24 shrink-0 transition-opacity"
      >
        <RouterLink to="/" class="flex items-center no-underline w-full group">
          <!-- Logo SVG replicado do Login -->
          <div class="shrink-0 drop-shadow-md group-active:scale-95 transition-transform">
            <svg
              width="48"
              height="48"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="44" height="44" rx="12" fill="url(#logoGradientSidebar)" />
              <path
                d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
                fill="white"
                fill-opacity="0.95"
              />
              <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.6" />
              <defs>
                <linearGradient id="logoGradientSidebar" x1="0" y1="0" x2="44" y2="44">
                  <stop stop-color="#8b5cf6" />
                  <stop offset="1" stop-color="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Texto Replicado do Login (com ajuste de tamanho para sidebar) -->
          <div 
            class="overflow-hidden transition-all duration-300 ease-in-out flex items-center whitespace-nowrap"
            :style="{ 
              maxWidth: isCollapsed ? '0px' : '200px', 
              opacity: isCollapsed ? 0 : 1, 
              marginLeft: isCollapsed ? '0px' : '12px' 
            }"
          >
            <NText
              class="text-[2rem] font-black tracking-tighter leading-none !bg-clip-text !text-transparent !bg-gradient-to-br from-violet-500 to-indigo-600"
            >
              Divi
            </NText>
          </div>
        </RouterLink>
      </div>

      <!-- MAIN MENU -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide py-2">
        <div class="sidebar-menu-wrapper w-full">
          <NMenu
            :collapsed="isCollapsed"
            :collapsed-width="84"
            :icon-size="24"
            :collapsed-icon-size="24"
            :options="menuOptions"
            :value="activeKey"
            @update:value="handleMenuClick"
          />
        </div>
      </div>

      <!-- FOOTER PROFILE -->
      <div class="shrink-0 flex flex-col pt-2 pb-5">
        <!-- Profile Link -->
        <RouterLink to="/profile" class="block no-underline">
          <div 
            class="flex items-center w-full h-[64px] group border-transparent rounded-[16px] transition-colors"
            :class="isCollapsed ? 'hover:bg-transparent' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'"
            :style="{ paddingLeft: '18px', paddingRight: '18px', margin: '0' }"
          >
            <NAvatar
              :size="48"
              class="shrink-0 !bg-violet-500/10 !text-violet-500 font-extrabold border border-violet-500/20 group-hover:scale-[1.05] transition-transform"
            >
              <span class="text-lg">LS</span>
            </NAvatar>
            
            <div 
              class="overflow-hidden transition-all duration-300 ease-in-out flex flex-col justify-center whitespace-nowrap"
              :style="{ 
                maxWidth: isCollapsed ? '0px' : '180px', 
                opacity: isCollapsed ? 0 : 1, 
                marginLeft: isCollapsed ? '0px' : '16px' 
              }"
            >
              <NText strong class="block truncate leading-tight text-[15px] text-zinc-900 dark:text-white">Luan Silva</NText>
              <NText depth="3" class="block text-[10px] font-black tracking-widest uppercase truncate text-violet-500 mt-0.5">Premium</NText>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </NLayoutSider>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  NLayoutSider,
  NMenu,
  NText,
  NAvatar,
  type MenuOption
} from 'naive-ui'
import { useSidebarStore } from '../../stores/sidebarStore'

const sidebarStore = useSidebarStore()
const route = useRoute()
const router = useRouter()

const isCollapsed = computed({
  get: () => !sidebarStore.isExpanded,
  set: (val: boolean) => sidebarStore.setExpanded(!val),
})

const activeKey = ref<string>(route.path)
watch(() => route.path, (newPath) => {
  activeKey.value = newPath
})

function renderIcon(iconClass: string) {
  return () => h('i', { class: iconClass + ' text-[1.25rem]' })
}

const menuOptions: MenuOption[] = [
  {
    label: 'Menu Principal',
    key: 'main-group',
    type: 'group',
    children: [
      { label: 'Dashboard', key: '/', icon: renderIcon('i-lucide-layout-dashboard') },
      { label: 'Transações', key: '/transactions', icon: renderIcon('i-lucide-arrow-left-right') },
      { label: 'Orçamentos', key: '/budgets', icon: renderIcon('i-lucide-wallet') },
      { label: 'Metas', key: '/goals', icon: renderIcon('i-lucide-target') },
      { label: 'Empréstimos', key: '/loans', icon: renderIcon('i-lucide-banknote') },
      { label: 'Assinaturas', key: '/subscriptions', icon: renderIcon('i-lucide-refresh-cw') },
    ]
  },
  {
    label: 'Análise',
    key: 'analysis-group',
    type: 'group',
    children: [
      { label: 'Calendário', key: '/calendar', icon: renderIcon('i-lucide-calendar') },
      { label: 'Relatórios', key: '/reports', icon: renderIcon('i-lucide-bar-chart-3') },
    ]
  },
  {
    label: 'Preferências',
    key: 'settings-group',
    type: 'group',
    children: [
      { label: 'Configurações', key: '/settings', icon: renderIcon('i-lucide-settings') },
    ]
  }
]

function handleMenuClick(key: string) {
  router.push(key)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Base Tweak for Sidebar Expansion */
.smooth-sider-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Meticulous NMenu Geometry Fixes with High Specificity */
/* 1. Control the background pill size (this is what Naive UI actually styles for hover/active) */
.sidebar-menu-wrapper :deep(.n-menu-item-content::before),
.sidebar-menu-wrapper :deep(.n-menu.n-menu--collapsed .n-menu-item-content::before) {
  left: 18px !important;
  right: 18px !important;
  border-radius: 12px !important;
  bottom: 0 !important;
  top: 0 !important;
}

/* 2. Control the padding of the clickable area so icons align perfectly with the 18px bounds */
.sidebar-menu-wrapper :deep(.n-menu-item-content),
.sidebar-menu-wrapper :deep(.n-menu.n-menu--collapsed .n-menu-item-content) {
  padding-left: 18px !important;
  padding-right: 18px !important;
  margin: 0 !important; /* Reset any native margin */
  width: 100% !important; /* Full width so the padding places content correctly */
}

/* 3. Force the icon wrapper to be a perfect 48x48 cube */
.sidebar-menu-wrapper :deep(.n-menu-item-content__icon),
.sidebar-menu-wrapper :deep(.n-menu.n-menu--collapsed .n-menu-item-content__icon) {
  margin: 0 !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.sidebar-menu-wrapper :deep(.n-menu-item) {
  height: 48px !important;
  margin-top: 4px !important;
}

/* Force Text spacing to universally match our external Footer/Header structure */
.sidebar-menu-wrapper :deep(.n-menu-item-content-header) {
  padding-left: 16px !important;
  transition: opacity 0.3s ease !important;
}

/* Hide and handle group titles gracefully */
.sidebar-menu-wrapper :deep(.n-menu-item-group-title) {
  transition: opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease, height 0.3s ease !important;
  opacity: 1;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 18px !important;
}

.n-layout-sider--collapsed .sidebar-menu-wrapper :deep(.n-menu-item-group-title) {
  opacity: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 0 !important;
  pointer-events: none;
}

.n-layout-sider--collapsed .sidebar-menu-wrapper :deep(.n-menu-item-group:not(:first-child)) {
  margin-top: 16px !important;
}
</style>
