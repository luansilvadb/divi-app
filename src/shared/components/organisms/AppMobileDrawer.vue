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
                      'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer mx-1 mb-1 group',
                      isActive ? 'bg-primary-main/10 text-primary-main font-bold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                    ]">
                        <span :class="[item.icon, isActive ? 'scale-110' : 'group-hover:scale-110']" class="text-xl transition-transform duration-300"></span>
                        <span class="font-medium text-base">{{ item.label }}</span>
                        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                    </a>
                </RouterLink>
            </template>
            <template #submenuheader="{ item }">
                <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-text-disabled mb-2 mt-4 ml-4">
                    {{ item.label }}
                </span>
            </template>
        </Menu>
    </nav>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-4 pb-safe mt-auto">
      <div v-if="user" class="user-profile p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-3">
        <div class="user-avatar min-w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-main/20">
            <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name || user.email" class="w-full h-full object-cover">
            <div v-else class="w-full h-full bg-primary-main text-white flex items-center justify-center font-bold text-lg uppercase">
                {{ (user.name || user.email).charAt(0) }}
            </div>
        </div>
        <div class="user-info flex flex-col overflow-hidden">
            <span class="text-sm font-bold truncate">{{ user.name || 'Usuário' }}</span>
            <span class="text-xs text-text-secondary truncate">{{ user.email }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <ThemeToggle />
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-2 rounded-xl text-error-main font-bold hover:bg-error-main/10 transition-colors cursor-pointer border border-error-main/20"
        >
          <span>Sair</span>
          <span class="pi pi-sign-out text-lg"></span>
        </button>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'
import ThemeToggle from '../molecules/ThemeToggle.vue'
import { createMainNavigation } from '../../config/navigation'
import type { User } from '../../../modules/auth/domain/entities/User'

defineProps<{
  isOpen: boolean
  user?: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

function handleLogout() {
  emit('close')
  emit('logout')
}

const menuItems = computed(() =>
  createMainNavigation({ onLogout: handleLogout }).slice(0, 2) // Only main groups, no logout section
)
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
