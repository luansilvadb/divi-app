<template>
  <Drawer
    :visible="isOpen"
    @update:visible="$emit('close')"
    position="right"
    class="!w-[280px] shadow-2xl border-l border-surface-200 dark:border-surface-800/50"
    :ptOptions="{ mergeProps: true }"
    :pt="{
      mask: { class: '!z-[290]' },
      root: {
        class: '!flex !flex-col !overflow-hidden !z-[300] !bg-surface-0 dark:!bg-surface-900',
      },
      header: { class: '!p-0 !border-none !hidden' },
      content: {
        class: '!p-0 !flex-1 !overflow-y-auto !flex !flex-col !bg-surface-0 dark:!bg-surface-900',
      },
    }"
  >
    <!-- Custom Luxury Header -->
    <div
      class="relative overflow-hidden bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-800/10"
    >
      <div class="absolute inset-0 bg-p-primary-500/[0.04] pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between px-6 py-5">
        <div class="flex flex-col">
          <span class="text-xl font-black text-p-surface-800 dark:text-p-surface-50 tracking-tighter leading-none mb-1">Mais Opções</span>
          <div class="flex items-center opacity-50">
            <span class="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-p-surface-600 dark:text-p-surface-200">EXPLORE O SISTEMA</span>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center text-p-surface-600 dark:text-p-surface-200 hover:text-p-surface-800 dark:text-p-surface-50 rounded-full hover:bg-p-surface-50 dark:hover:bg-p-surface-800/10 transition-all active:scale-95 border-none bg-transparent cursor-pointer"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Scrollable Navigation -->
    <nav class="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
      <Menu 
        :model="menuItems" 
        class="border-none bg-transparent w-full"
        :pt="{
          list: { class: 'p-0 m-0 list-none' },
          itemContent: { class: 'p-0 bg-transparent' },
          itemLink: { class: 'p-0 bg-transparent' },
          submenuHeader: { class: 'px-4 mb-3 mt-8 first:mt-0 text-[0.6rem] font-black uppercase tracking-[0.25em] text-p-surface-400 dark:text-p-surface-500/60' }
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
              @click="(e) => { navigate(e); $emit('close'); }"
              class="flex items-center w-full gap-4 px-4 py-4 rounded-xl transition-all duration-200 outline-none select-none no-underline"
              :class="[
                isPageActive(item.to)
                  ? 'bg-p-primary-500/10 text-p-primary-500 font-black'
                  : 'text-p-surface-600 dark:text-p-surface-400 hover:bg-p-surface-50 dark:hover:bg-p-surface-800/20',
              ]"
            >
              <i
                :class="[item.icon, { 'scale-110': isPageActive(item.to) }]"
                class="text-xl transition-transform duration-200"
              ></i>
              <span class="font-black text-[0.85rem] uppercase tracking-widest">{{ item.label }}</span>
              <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            </a>
          </RouterLink>
        </template>
      </Menu>
    </nav>

    <!-- Footer Actions -->
    <div
      class="p-6 border-t border-p-surface-200 dark:border-p-surface-800/10 flex flex-col gap-4 pb-safe mt-auto"
    >
      <div class="flex items-center justify-between">
        <span class="text-[0.65rem] font-black uppercase tracking-widest text-p-surface-400">Aparência</span>
        <ThemeToggle />
      </div>

      <BaseButton
        variant="ghost"
        @click="handleLogout"
        class="!w-full !justify-start !gap-3 !px-4 !py-3.5 !rounded-2xl !text-error !bg-error/5 hover:!bg-error/10 !border-none"
      >
        <i class="pi pi-sign-out text-lg"></i>
        <span class="font-black text-[0.85rem] uppercase tracking-widest">Sair da Conta</span>
      </BaseButton>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import ThemeToggle from '../molecules/ThemeToggle.vue'
import BaseButton from '../atoms/BaseButton.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

const route = useRoute()

function handleLogout() {
  emit('close')
  emit('logout')
}

const isPageActive = (itemTo: string | undefined) => {
  if (!itemTo) return false
  if (itemTo === '/') return route.path === '/'
  return route.path.startsWith(itemTo)
}

const menuItems = computed(() => [
  {
    label: 'Outras Opções',
    items: [
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
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
