<template>
  <div
    class="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none md:hidden will-change-transform"
  >
    <nav
      class="pointer-events-auto mx-auto w-full max-w-[440px] bg-[var(--surface-primary)] border-t border-[var(--surface-separator)] shadow-sm rounded-[2.5rem] p-1 flex items-center overflow-hidden"
    >
      <template v-for="item in items" :key="item.label">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a
            :href="href"
            @click="navigate"
            :class="[
              'flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer py-2.5 rounded-[1.5rem] group relative',
              isPageActive(item.route) ? 'text-[#007AFF] dark:text-[#0A84FF]' : 'text-label-3 dark:text-label-3-dark font-medium',
            ]"
          >
            <div
              v-if="isPageActive(item.route)"
              class="absolute inset-0 bg-[rgba(0,122,255,0.06)] dark:bg-[rgba(10,132,255,0.08)] rounded-[1.5rem] transition-opacity duration-300 pointer-events-none"
            ></div>

            <i
              :class="[item.icon, { 'scale-110': isPageActive(item.route) }]"
              class="text-[1.2rem] transition-transform duration-300 relative z-10"
            ></i>

            <span
              :class="[
                'text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 leading-none relative z-10',
                isPageActive(item.route) ? 'opacity-100' : 'opacity-60',
              ]"
            >
              {{ item.label }}
            </span>

            <div v-if="isPageActive(item.route)" class="absolute bottom-1 w-1 h-1 bg-[#007AFF] dark:bg-[#0A84FF] rounded-full"></div>
          </a>
        </RouterLink>

        <button
          v-else-if="item.action"
          @click="item.action"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-[1.5rem] group text-zinc-500 dark:text-zinc-400 transition-all duration-300 cursor-pointer active:scale-95 border-none bg-transparent"
        >
          <i :class="[item.icon]" class="text-[1.2rem] transition-transform duration-300"></i>
          <span class="text-[8px] font-black uppercase tracking-widest leading-none opacity-60">
            {{ item.label }}
          </span>
        </button>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isPageActive = (itemRoute: string | undefined) => {
  if (!itemRoute) return false
  if (itemRoute === '/') return route.path === '/'
  return route.path.startsWith(itemRoute)
}

const emit = defineEmits<{
  (e: 'open-drawer'): void
}>()

const items = computed(() => [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', route: '/' },
  { label: 'Transações', icon: 'i-lucide-arrow-left-right', route: '/transactions' },
  { label: 'Orçamentos', icon: 'i-lucide-IWallet', route: '/budgets' },
  { label: 'Mais', icon: 'i-lucide-more-horizontal', action: () => emit('open-drawer') },
])
</script>
