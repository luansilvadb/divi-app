<template>
  <Drawer
    :visible="isOpen"
    @update:visible="$emit('close')"
    position="right"
    class="!bg-bg-main !w-[280px] shadow-2xl !border-none"
    :pt="{
      mask: { class: 'backdrop-blur-sm bg-black/40 z-[90]' },
      root: { class: 'flex flex-col overflow-hidden z-[100]' },
      header: { class: 'p-0 border-none hidden' },
      content: { class: 'p-0 flex-1 overflow-y-auto flex flex-col' }
    }"
  >
    <!-- Custom Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 shrink-0"
    >
      <span class="font-bold text-lg text-text-primary">Mais Opções</span>
      <button
        @click="$emit('close')"
        class="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Fechar menu"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>

    <!-- Scrollable Navigation -->
    <nav class="flex-1 p-4 overflow-y-auto">
        <Menu :model="menuItems" class="border-none bg-transparent w-full">
            <template #item="{ item, props }">
                <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="(e) => { navigate(e); $emit('close'); }" :class="[
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors cursor-pointer',
                      isActive ? 'text-primary-main bg-primary-main/5' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                    ]">
                        <span :class="item.icon" class="text-currentColor w-5 h-5 flex items-center justify-center text-lg"></span>
                        <span class="font-medium">{{ item.label }}</span>
                    </a>
                </RouterLink>
            </template>
            <template #submenuheader="{ item }">
                <span class="block text-xs font-bold uppercase tracking-wider text-text-disabled mb-3 mt-4">
                    {{ item.label }}
                </span>
            </template>
        </Menu>
    </nav>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-black/5 dark:border-white/5 space-y-2 pb-safe mt-auto">
      <button
        @click="handleThemeToggle"
        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="w-5 h-5 flex items-center justify-center text-lg"></span>
        <span class="font-medium">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
      </button>

      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-error-main hover:bg-error-main/10 transition-colors cursor-pointer"
      >
        <span class="pi pi-sign-out w-5 h-5 flex items-center justify-center text-lg"></span>
        <span class="font-medium">Sair</span>
      </button>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/core/theme'
import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

const { isDark, toggle: toggleTheme } = useTheme()

function handleThemeToggle() {
  toggleTheme()
}

function handleLogout() {
  emit('close')
  emit('logout')
}

const menuItems = computed(() => [
    {
        label: 'Principal',
        items: [
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
    }
])
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
