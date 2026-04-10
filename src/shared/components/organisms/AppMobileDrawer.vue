<template>
  <Drawer
    :visible="isOpen"
    @update:visible="$emit('close')"
    position="right"
    class="!w-[280px] shadow-2xl border-l border-surface-200 dark:border-surface-800/50"
    :ptOptions="{ mergeProps: true }"
    :pt="{
      mask: { class: '!z-[290]' },
      root: { class: '!flex !flex-col !overflow-hidden !z-[300] !bg-surface-0 dark:!bg-surface-900' },
      header: { class: '!p-0 !border-none !hidden' },
      content: { class: '!p-0 !flex-1 !overflow-y-auto !flex !flex-col !bg-surface-0 dark:!bg-surface-900' }
    }"
  >
    <!-- Custom Luxury Header -->
    <div class="relative overflow-hidden bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-800/10">
      <!-- Subtle Brand Accent Overlay -->
      <div class="absolute inset-0 bg-primary/[0.04] pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between px-6 py-5">
        <div class="flex flex-col">
          <span class="text-xl font-black text-surface-800 dark:text-surface-50 tracking-tighter leading-none mb-1">Mais Opções</span>
          <div class="flex items-center opacity-50">
            <span class="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-surface-600 dark:text-surface-200">EXPLORE O SISTEMA</span>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center text-surface-600 dark:text-surface-200 hover:text-surface-800 dark:text-surface-50 rounded-full hover:bg-surface-50 dark:hover:bg-surface-800/10 transition-all active:scale-95"
          aria-label="Fechar menu"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Scrollable Navigation -->
    <nav class="flex-1 px-4 py-8 overflow-y-auto">
        <Menu :model="menuItems" class="border-none bg-transparent w-full">
            <template #item="{ item, props }">
                <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="(e) => { navigate(e); $emit('close'); }" :class="[
                      'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer group relative',
                      isActive ? 'text-primary bg-primary/5 shadow-sm' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/20'
                    ]">
                        <span :class="[item.icon, isActive ? 'scale-110 shadow-primary/20' : 'opacity-70 group-hover:opacity-100']" class="w-6 h-6 flex items-center justify-center text-lg transition-transform"></span>
                        <span class="font-black text-[0.85rem] uppercase tracking-widest">{{ item.label }}</span>
                        
                        <!-- Active bar indicator -->
                        <div v-if="isActive" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.5)]"></div>
                    </a>
                </RouterLink>
            </template>
            <template #submenuheader="{ item }">
                <div class="px-4 mb-3 mt-8 first:mt-0">
                    <span class="text-[0.6rem] font-black uppercase tracking-[0.25em] text-surface-400 dark:text-surface-500/60">
                        {{ item.label }}
                    </span>
                    <div class="h-px w-8 bg-surface-200 dark:bg-surface-800/10 mt-1.5 rounded-full"></div>
                </div>
            </template>
        </Menu>
    </nav>

    <!-- Footer Actions -->
    <div class="p-6 border-t border-surface-200 dark:border-surface-800/10 flex flex-col gap-4 pb-safe mt-auto">
      <div class="flex items-center justify-between">
        <span class="text-[0.65rem] font-black uppercase tracking-widest text-surface-400">Aparência</span>
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
import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'
import ThemeToggle from '../molecules/ThemeToggle.vue'
import BaseButton from '../atoms/BaseButton.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

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

