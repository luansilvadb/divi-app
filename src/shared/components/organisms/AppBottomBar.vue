<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-main border-t border-black/5 dark:border-white/5 pb-safe">
    <Dock :model="items" position="bottom" :pt="{
        root: { class: 'w-full justify-around h-[4.5rem] bg-transparent !border-none' },
        container: { class: 'w-full justify-around' },
        item: { class: 'w-full h-full flex justify-center items-center' },
        itemLink: { class: 'flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200' }
    }">
        <template #item="{ item, props }">
            <RouterLink v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate" :class="[
                  'flex flex-col items-center justify-center w-full h-full transition-colors duration-200 cursor-pointer',
                  isActive ? 'text-primary-main' : 'text-text-disabled'
                ]">
                    <span :class="item.icon" class="text-xl mb-1"></span>
                    <span class="text-[10px] font-bold tracking-wider uppercase">{{ item.label }}</span>
                </a>
            </RouterLink>
            <a v-else-if="item.action" v-bind="props.action" @click="item.action" class="flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200 cursor-pointer">
                <span :class="item.icon" class="text-xl mb-1"></span>
                <span class="text-[10px] font-bold tracking-wider uppercase">{{ item.label }}</span>
            </a>
        </template>
    </Dock>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Dock from 'primevue/dock'

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
