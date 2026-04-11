<template>
  <NDrawer
    :show="isOpen"
    @update:show="$emit('close')"
    :width="280"
    placement="right"
    class="!bg-zinc-50 dark:!bg-zinc-950"
  >
    <div class="flex flex-col h-full">
      <!-- Luxury Header -->
      <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight leading-none mb-1">Mais Opções</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Explore o Sistema</span>
          </div>
          <NButton quaternary circle @click="$emit('close')">
            <template #icon><i class="i-lucide-x text-xl"></i></template>
          </NButton>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto py-4">
        <NMenu
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuClick"
        />
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 pb-safe">
        <div class="flex items-center justify-between px-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Aparência</span>
          <ThemeToggle />
        </div>

        <NButton
          type="error"
          ghost
          @click="handleLogout"
          class="!w-full !justify-start !rounded-xl !border-none !bg-red-500/5 hover:!bg-red-500/10"
        >
          <template #icon><i class="i-lucide-log-out text-lg"></i></template>
          <span class="font-bold">Sair da Conta</span>
        </NButton>
      </div>
    </div>
  </NDrawer>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { NDrawer, NMenu, NButton, type MenuOption } from 'naive-ui'
import ThemeToggle from '../molecules/ThemeToggle.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

const route = useRoute()
const router = useRouter()

const activeKey = ref<string>(route.path)
watch(() => route.path, (newPath) => {
  activeKey.value = newPath
})

function handleLogout() {
  emit('close')
  emit('logout')
}

function renderIcon(iconClass: string) {
  return () => h('i', { class: iconClass + ' text-xl' })
}

const menuOptions: MenuOption[] = [
  {
    label: 'Outras Opções',
    key: 'others',
    type: 'group',
    children: [
      { label: 'Metas', key: '/goals', icon: renderIcon('i-lucide-target') },
      { label: 'Empréstimos', key: '/loans', icon: renderIcon('i-lucide-banknote') },
      { label: 'Assinaturas', key: '/subscriptions', icon: renderIcon('i-lucide-refresh-cw') },
    ]
  },
  {
    label: 'Análise',
    key: 'analysis',
    type: 'group',
    children: [
      { label: 'Calendário', key: '/calendar', icon: renderIcon('i-lucide-calendar') },
      { label: 'Relatórios', key: '/reports', icon: renderIcon('i-lucide-bar-chart-3') },
    ]
  },
  {
    label: 'Preferências',
    key: 'prefs',
    type: 'group',
    children: [
      { label: 'Meu Perfil', key: '/profile', icon: renderIcon('i-lucide-user') },
      { label: 'Configurações', key: '/settings', icon: renderIcon('i-lucide-settings') },
    ]
  }
]

function handleMenuClick(key: string) {
  router.push(key)
  emit('close')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1.5rem);
}
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
