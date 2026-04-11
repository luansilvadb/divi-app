<template>
  <aside
    class="sidebar transition-all duration-300 ease-in-out"
    :class="{ 'sidebar--collapsed': isCollapsed }"
  >
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-brand">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black shadow-sm">
            D
          </div>
          <span class="sidebar-brand-text" v-if="!isCollapsed">Divi</span>
        </div>
      </RouterLink>

      <button
        @click="isCollapsed = !isCollapsed"
        class="sidebar-toggle-btn"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto pt-2 pb-6 custom-scrollbar">
      <Menu 
        :model="menuItems" 
        class="border-none bg-transparent w-full"
        :pt="{
          list: { class: 'p-0 m-0 list-none' },
          itemContent: { class: 'p-0 bg-transparent' },
          itemLink: { class: 'p-0 bg-transparent' },
          submenuHeader: { class: 'px-6 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-p-surface-400 dark:text-p-surface-500 mt-4 mb-2' }
        }"
      >
        <template #item="{ item }">
          <RouterLink
            v-if="item.to"
            v-slot="{ href, navigate }"
            :to="item.to"
            custom
          >
            <a
              :href="href"
              @click="navigate"
              class="flex items-center px-4 py-3 cursor-pointer rounded-xl mx-2 mb-1 transition-all duration-200 outline-none select-none no-underline gap-3"
              :class="[
                isPageActive(item.to)
                  ? 'bg-p-primary-500/10 text-p-primary-500'
                  : 'text-p-surface-600 dark:text-p-surface-200 hover:bg-p-surface-100 dark:hover:bg-p-surface-800/50',
              ]"
            >
              <i
                :class="[item.icon, { 'scale-110': isPageActive(item.to) }]"
                class="text-xl transition-transform duration-200"
              ></i>
              <span
                class="truncate font-bold text-[0.95rem] transition-all duration-200"
                :class="{ 'opacity-0 w-0 hidden': isCollapsed }"
                >{{ item.label }}</span
              >
              <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            </a>
          </RouterLink>
        </template>
      </Menu>
    </div>

    <div class="sidebar-footer border-t border-surface-200 dark:border-surface-800/20 p-2">
      <div class="flex flex-col gap-1 mb-4">
        <button @click="toggleTheme" class="footer-btn">
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-xl"></i>
          <span v-if="!isCollapsed" class="ml-3 font-bold text-[0.95rem]">Mudar Tema</span>
        </button>
        
        <button @click="emit('logout')" class="footer-btn text-error/70 hover:text-error hover:bg-error/10">
          <i class="pi pi-sign-out text-xl"></i>
          <span v-if="!isCollapsed" class="ml-3 font-bold text-[0.95rem]">Sair do App</span>
        </button>
      </div>

      <RouterLink to="/profile" class="profile-card" :class="{ 'justify-center mx-0': isCollapsed }">
        <div class="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center font-black text-primary border border-black/5">
          LS
        </div>
        <div v-if="!isCollapsed" class="ml-3 flex-1 min-w-0">
          <p class="text-[0.85rem] font-bold text-surface-800 dark:text-surface-50 truncate">Luan Silva</p>
          <p class="text-[0.65rem] font-medium text-surface-400 truncate uppercase">Premium</p>
        </div>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTheme } from '../../../core/theme'
import { useSidebarStore } from '../../stores/sidebarStore'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'

const emit = defineEmits(['logout'])
const sidebarStore = useSidebarStore()
const { isDark, toggle: toggleTheme } = useTheme()
const route = useRoute()

const isCollapsed = computed({
  get: () => !sidebarStore.isExpanded,
  set: (val: boolean) => sidebarStore.setExpanded(!val),
})

const isPageActive = (itemTo: string | undefined) => {
  if (!itemTo) return false
  if (itemTo === '/') return route.path === '/'
  return route.path.startsWith(itemTo)
}

const menuItems = computed(() => [
  {
    label: 'Menu Principal',
    items: [
      { label: 'Dashboard', icon: 'pi pi-th-large', to: '/' },
      { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', to: '/transactions' },
      { label: 'Orçamentos', icon: 'pi pi-dollar', to: '/budgets' },
      { label: 'Metas', icon: 'pi pi-bullseye', to: '/goals' },
      { label: 'Empréstimos', icon: 'pi pi-credit-card', to: '/loans' },
      { label: 'Assinaturas', icon: 'pi pi-history', to: '/subscriptions' },
    ],
  },
  {
    label: 'Análise',
    items: [
      { label: 'Calendário', icon: 'pi pi-calendar', to: '/calendar' },
      { label: 'Relatórios', icon: 'pi pi-chart-line', to: '/reports' },
    ],
  },
  {
    label: 'Preferências',
    items: [
      { label: 'Meu Perfil', icon: 'pi pi-user', to: '/profile' },
      { label: 'Configurações', icon: 'pi pi-cog', to: '/settings' },
    ],
  },
])
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-0);
  border-right: 1px solid var(--surface-200);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:is(.dark) .sidebar {
  background-color: var(--surface-950);
  border-right-color: var(--surface-800);
}

.sidebar--collapsed { width: 80px; }

/* ... Rest of the styles remain the same ... */
.sidebar-header {
  height: 80px;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar--collapsed .sidebar-header { padding: 0; justify-content: center; }

.sidebar-brand-text {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #10b981 0%, #0284c7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--surface-400);
}

.footer-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--surface-500);
}

.profile-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin: 0 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  text-decoration: none;
}
</style>
