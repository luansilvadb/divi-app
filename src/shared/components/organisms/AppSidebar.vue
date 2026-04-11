<template>
  <NLayoutSider
    collapse-mode="width"
    :collapsed-width="80"
    :width="260"
    :collapsed="isCollapsed"
    show-trigger="arrow-circle"
    @collapse="isCollapsed = true"
    @expand="isCollapsed = false"
    bordered
    class="!bg-zinc-50 dark:!bg-zinc-950 !transition-all !duration-300"
  >
    <div class="flex flex-col h-full">
      <div class="h-16 flex items-center px-6">
        <RouterLink to="/" class="flex items-center gap-3 no-underline">
          <div class="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white font-black shadow-sm">
            D
          </div>
          <span v-if="!isCollapsed" class="text-xl font-black bg-gradient-to-br from-violet-500 to-indigo-600 bg-clip-text text-transparent">
            Divi
          </span>
        </RouterLink>
      </div>

      <div class="flex-1 overflow-y-auto py-4">
        <NMenu
          :collapsed="isCollapsed"
          :collapsed-width="80"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuClick"
        />
      </div>

      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div class="flex flex-col gap-2 mb-4">
          <NButton quaternary circle @click="toggleTheme" class="!w-full !justify-start !px-3">
            <template #icon>
              <i :class="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="text-xl"></i>
            </template>
            <span v-if="!isCollapsed" class="ml-2 font-bold">Mudar Tema</span>
          </NButton>
          
          <NButton quaternary circle @click="emit('logout')" class="!w-full !justify-start !px-3 !text-red-500 hover:!bg-red-500/10">
            <template #icon>
              <i class="i-lucide-log-out text-xl"></i>
            </template>
            <span v-if="!isCollapsed" class="ml-2 font-bold">Sair</span>
          </NButton>
        </div>

        <RouterLink to="/profile" class="flex items-center p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors no-underline">
          <div class="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center font-black text-violet-500 border border-violet-500/20">
            LS
          </div>
          <div v-if="!isCollapsed" class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-bold text-zinc-800 dark:text-zinc-50 truncate">Luan Silva</p>
            <p class="text-[10px] font-medium text-zinc-400 truncate uppercase tracking-wider">Premium</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </NLayoutSider>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { NLayoutSider, NMenu, NButton, NIcon, type MenuOption } from 'naive-ui'
import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'

const emit = defineEmits(['logout'])
const sidebarStore = useSidebarStore()
const { isDark, toggle: toggleTheme } = useTheme()
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
  return () => h('i', { class: iconClass + ' text-xl' })
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
:deep(.n-menu-item-content--selected) {
  background-color: rgba(139, 92, 246, 0.1) !important;
}
:deep(.n-menu-item-content--selected .n-menu-item-content-header) {
  color: #8b5cf6 !important;
  font-weight: 700;
}
:deep(.n-menu-item-content--selected .n-menu-item-content__icon) {
  color: #8b5cf6 !important;
}
</style>
