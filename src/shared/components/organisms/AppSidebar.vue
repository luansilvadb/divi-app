<template>
  <aside 
    class="w-64 h-screen bg-primary-main text-white flex flex-col transition-all duration-300 sticky top-0"
    :class="{ 'w-20': isCollapsed }"
  >
    <div class="p-6 border-b border-white/10 flex items-center justify-between">
      <div v-if="!isCollapsed" class="flex items-center gap-2">
        <span class="text-2xl font-bold text-accent-main">Divi</span>
      </div>
      <button 
        @click="isCollapsed = !isCollapsed" 
        class="p-1 rounded-sm hover:bg-white/10 transition-colors"
      >
        <span class="text-white/70">{{ isCollapsed ? '➡️' : '⬅️' }}</span>
      </button>
    </div>
    
    <nav class="flex-1 py-4 overflow-y-auto">
      <RouterLink 
        v-for="item in navItems" 
        :key="item.to"
        :to="item.to" 
        class="flex items-center py-3 px-6 text-white/70 hover:bg-white/5 hover:text-white transition-all border-l-4 border-transparent" 
        active-class="active-nav-item"
      >
        <span class="text-xl" :class="{ 'mr-3': !isCollapsed }">{{ item.icon }}</span>
        <span v-if="!isCollapsed" class="font-medium">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-white/10">
      <button 
        @click="$emit('logout')" 
        class="w-full flex items-center py-3 px-2 text-white/70 hover:bg-error-main/20 hover:text-error-main rounded-sm transition-all"
        :class="{ 'justify-center': isCollapsed }"
      >
        <span class="text-xl" :class="{ 'mr-3': !isCollapsed }">🚪</span>
        <span v-if="!isCollapsed" class="font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits(['logout'])

const isCollapsed = ref(false)

const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/transactions', icon: '💸', label: 'Transactions' },
  { to: '/budgets', icon: '🎯', label: 'Budgets' },
  { to: '/goals', icon: '🏆', label: 'Goals' },
  { to: '/loans', icon: '🏛️', label: 'Loans' },
  { to: '/subscriptions', icon: '📅', label: 'Subscriptions' },
  { to: '/calendar', icon: '🗓️', label: 'Calendar' },
  { to: '/reports', icon: '📈', label: 'Reports' },
  { to: '/activity-log', icon: '📑', label: 'Activity Log' },
]
</script>

<style scoped>
@reference "../../../core/styles/main.css";

.active-nav-item {
  @apply bg-white/10 text-accent-main border-accent-main;
}
</style>
