<template>
  <div
    class="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none md:hidden will-change-transform"
  >
    <nav
      class="pointer-events-auto mx-auto w-full max-w-[440px] bg-surface-0/90 dark:bg-surface-900/90 backdrop-blur-md border border-surface-200/30 dark:border-surface-800/50 shadow-lg rounded-[2.5rem] p-1 flex items-center ring-1 ring-black/5 dark:ring-white/5 overflow-hidden"
    >
      <template v-for="item in items" :key="item.label">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a
            :href="href"
            @click="navigate"
            :class="[
              'flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 cursor-pointer py-2.5 rounded-[1.5rem] group relative',
              isPageActive(item.route) ? 'text-primary' : 'text-surface-600 dark:text-surface-400 font-medium',
            ]"
          >
            <!-- Subtle Active Background -->
            <div
              v-if="isPageActive(item.route)"
              class="absolute inset-0 bg-primary/5 rounded-[1.5rem] transition-opacity duration-300 pointer-events-none"
            ></div>

            <i
              :class="[item.icon, { 'scale-110': isPageActive(item.route) }]"
              class="text-[1.2rem] transition-transform duration-200 relative z-10"
            ></i>

            <span
              :class="[
                'text-[8px] font-black uppercase tracking-widest transition-opacity duration-200 leading-none relative z-10',
                isPageActive(item.route) ? 'opacity-100' : 'opacity-60',
              ]"
            >
              {{ item.label }}
            </span>

            <!-- Bottom Dot Indicator -->
            <div v-if="isPageActive(item.route)" class="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
          </a>
        </RouterLink>

        <button
          v-else-if="item.action"
          @click="item.action"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-[1.5rem] group text-surface-600 dark:text-surface-400 transition-colors duration-200 cursor-pointer active:scale-95"
        >
          <i :class="[item.icon]" class="text-[1.2rem] transition-transform duration-200"></i>
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
  { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
  { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
  { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
  { label: 'Mais', icon: 'pi pi-ellipsis-h', action: () => emit('open-drawer') },
])
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
