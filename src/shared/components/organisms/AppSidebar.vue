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
    class="smooth-sider-transition"
    :style="{ background: 'var(--surface-primary)', borderRight: '1px solid var(--surface-separator)' }"
  >
    <div class="flex flex-col h-full py-2">
      <!-- HEADER / LOGO -->
      <div
        class="flex items-center w-full pl-[18px] pr-[18px] h-24 shrink-0 transition-opacity"
      >
        <RouterLink to="/" class="flex items-center no-underline w-full group">
          <!-- Logo SVG replicado do Login -->
          <div class="shrink-0 group-active:scale-95 transition-transform">
            <AppLogo :size="40" :withShadow="false" />
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
              class="text-[1.75rem] font-bold tracking-tight leading-none"
              :style="{ color: 'var(--text-label)' }"
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
            class="flex items-center w-full h-[60px] group rounded-[12px] transition-colors"
            :class="isCollapsed ? '' : 'hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)]'"
            :style="{ paddingLeft: '18px', paddingRight: '18px', margin: '0' }"
          >
            <NAvatar
              :size="40"
              class="shrink-0 font-bold transition-transform group-hover:scale-[1.04]"
              :style="{ background: 'rgba(0,122,255,0.1)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.18)' }"
            >
              <span class="text-base">LS</span>
            </NAvatar>

            <div
              class="overflow-hidden transition-all duration-300 ease-in-out flex flex-col justify-center whitespace-nowrap"
              :style="{
                maxWidth: isCollapsed ? '0px' : '180px',
                opacity: isCollapsed ? 0 : 1,
                marginLeft: isCollapsed ? '0px' : '16px'
              }"
            >
              <NText strong class="block truncate leading-tight text-[14px]" :style="{ color: 'var(--text-label)' }">Luan Silva</NText>
              <NText class="block text-[11px] font-semibold truncate mt-0.5" :style="{ color: '#007AFF' }">Premium</NText>
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
import AppLogo from '@/shared/components/atoms/AppLogo.vue'
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
  return () => h('i', { class: iconClass + ' text-[1.5rem]' })
}

const menuOptions: MenuOption[] = [
  {
    label: 'Menu Principal',
    key: 'main-group',
    type: 'group',
    children: [
      { label: 'Dashboard', key: '/', icon: renderIcon('i-lucide-layout-dashboard') },
      { label: 'Transações', key: '/transactions', icon: renderIcon('i-lucide-arrow-left-right') },
      { label: 'Categorias', key: '/categories', icon: renderIcon('i-lucide-tag') },
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
