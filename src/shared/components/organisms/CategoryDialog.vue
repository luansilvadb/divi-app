<template>
  <!-- Mobile Drawer -->
  <template v-if="isMobile">
    <NDrawer
      :show="show"
      @update:show="handleClose"
      placement="bottom"
      resizable
      :default-height="600"
      class="!rounded-t-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950"
    >
      <div class="flex flex-col h-full">
        <!-- Drawer Handle & Header -->
        <div class="pt-3 pb-6 px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div class="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6 opacity-40"></div>
          <div class="flex flex-col">
            <NText
              class="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-1"
            >
              {{ category ? messages.MSG_I_CATEGORY_EDIT : messages.MSG_I_CATEGORY_NEW }}
            </NText>
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">Classificação</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-safe">
          <CategoryFormContent
            :initial-data="category"
            :parent-options="parentOptions"
            :is-submitting-edit="!!category"
            @close="$emit('close')"
            @saved="handleSaved"
            @delete="$emit('delete')"
          />
        </div>
      </div>
    </NDrawer>
  </template>

  <!-- Desktop Modal -->
  <template v-else>
    <NModal
      :show="show"
      @update:show="handleClose"
      preset="card"
      :closable="false"
      class="!max-w-lg !rounded-[24px] !bg-white !border-none shadow-2xl"
      :header-style="{ padding: '0' }"
      :content-style="{ padding: '0' }"
    >
      <template #header>
        <div class="relative w-full">
          <div class="px-6 pt-6 pb-6 flex items-start justify-between">
            <!-- Header Content -->
            <div class="flex flex-col gap-1">
              <h2 class="text-[#1d1d1f] dark:text-white font-sf-display font-semibold text-[24px] leading-[1.3] tracking-[-0.02em]">
                {{ category ? messages.MSG_I_CATEGORY_EDIT : messages.MSG_I_CATEGORY_NEW }}
              </h2>
              <p class="text-[#6e6e73] dark:text-[#8e8e93] text-[17px] font-sf-text font-normal leading-[1.5]">
                {{ category ? messages.MSG_I_CATEGORY_EDIT_DESC : messages.MSG_I_CATEGORY_NEW_DESC }}
              </p>
            </div>

            <!-- Close Button - Apple Style -->
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center text-[#6e6e73] dark:text-[#8e8e93] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] hover:text-[#1d1d1f] dark:hover:text-white active:scale-95 transition-all duration-150"
              @click="$emit('close')"
            >
              <i class="i-lucide-x text-xl"></i>
            </button>
          </div>
        </div>
      </template>

      <div class="px-5 pb-5">
        <CategoryFormContent
          :initial-data="category"
          :parent-options="parentOptions"
          :is-submitting-edit="!!category"
          @close="$emit('close')"
          @saved="handleSaved"
          @delete="$emit('delete')"
        />
      </div>
    </NModal>
  </template>
</template>

<script setup lang="ts">
import { NModal, NDrawer, NText } from 'naive-ui'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { messages } from '@/shared/messages/catalog'
import CategoryFormContent from './CategoryFormContent.vue'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

defineProps<{
  show: boolean
  category?: ICategory | null
  parentOptions: Array<{ label: string; value: string }>
}>()

const emit = defineEmits(['close', 'saved', 'delete'])
const isMobile = useIsMobile()

function handleClose(value: boolean) {
  if (!value) {
    emit('close')
  }
}

function handleSaved(data: { name: string; color: string; icon: string; parent_id: string | null }) {
  emit('saved', data)
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1.5rem);
}
</style>
