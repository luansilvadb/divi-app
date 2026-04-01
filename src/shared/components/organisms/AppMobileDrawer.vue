<template>
  <Teleport to="body">
    <div class="md:hidden">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
      </Transition>

      <!-- Drawer Content -->
      <Transition name="slide-right">
        <div
          v-if="isOpen"
          class="fixed right-0 top-0 bottom-0 z-[100] w-[280px] bg-bg-main shadow-2xl flex flex-col overflow-hidden"
        >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
          <span class="font-bold text-lg">Mais Opções</span>
          <button
            @click="$emit('close')"
            class="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Scrollable Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-6">
          <!-- Main Menu extras -->
          <div>
            <span class="block text-xs font-bold uppercase tracking-wider text-text-disabled mb-3">Principal</span>
            <div class="space-y-1">
              <RouterLink
                v-for="item in mainNavItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                active-class="!text-primary-main bg-primary-main/5"
                @click="$emit('close')"
              >
                <div class="text-currentColor w-5 h-5" v-html="item.icon"></div>
                <span class="font-medium">{{ item.label }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- Analysis -->
          <div>
            <span class="block text-xs font-bold uppercase tracking-wider text-text-disabled mb-3">Análise</span>
            <div class="space-y-1">
              <RouterLink
                v-for="item in analysisNavItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                active-class="!text-primary-main bg-primary-main/5"
                @click="$emit('close')"
              >
                <div class="text-currentColor w-5 h-5" v-html="item.icon"></div>
                <span class="font-medium">{{ item.label }}</span>
              </RouterLink>
            </div>
          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-black/5 dark:border-white/5 space-y-2 pb-safe">
          <button
            @click="handleThemeToggle"
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div class="w-5 h-5" v-html="isDark ? sunIcon : moonIcon"></div>
            <span class="font-medium">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-error-main hover:bg-error-main/10 transition-colors"
          >
            <div class="w-5 h-5" v-html="logoutIcon"></div>
            <span class="font-medium">Sair</span>
          </button>
        </div>
      </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useTheme } from '@/core/theme'
import { RouterLink } from 'vue-router'

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

// Icons for footer
const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
const logoutIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`

// Missing Items from bottom bar
const mainNavItems = [
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

const analysisNavItems = [
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
