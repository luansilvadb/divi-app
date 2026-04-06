<template>
  <div class="fixed bottom-6 left-0 right-0 z-[100] px-6 pointer-events-none md:hidden">
    <nav class="pointer-events-auto mx-auto max-w-[360px] bg-bg-main border border-black/5 dark:border-white/5 shadow-2xl rounded-[1.5rem] py-1.5 px-2 flex items-center justify-around ring-1 ring-black/5 dark:ring-white/5">
      <template v-for="item in items" :key="item.label">
        <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
          <a :href="href" @click="navigate" :class="[
            'flex flex-col items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer px-4 py-2 rounded-xl group active:scale-95',
            isActive ? 'text-primary-main bg-primary-main/10' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
          ]">
            <i 
              :class="[item.icon, isActive ? 'scale-100' : 'scale-100 opacity-70 group-hover:opacity-100']" 
              class="text-lg transition-all duration-300"
            ></i>
            
            <span 
              class="text-[10px] font-medium transition-all duration-300 leading-none"
              :class="isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'"
            >
              {{ item.label }}
            </span>
          </a>
        </RouterLink>

        <button v-else-if="item.action" @click="item.action" class="flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl group text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer active:scale-95">
          <i :class="item.icon" class="text-lg opacity-70 group-hover:opacity-100 transition-all duration-300"></i>
          <span class="text-[10px] font-medium opacity-70 group-hover:opacity-100 transition-all duration-300 leading-none">
            {{ item.label }}
          </span>
        </button>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits<{
  (e: 'open-drawer'): void
}>()

const items = computed(() => [
  { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
  { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
  { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
  { label: 'Mais', icon: 'pi pi-ellipsis-h', action: () => emit('open-drawer') }
])
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
