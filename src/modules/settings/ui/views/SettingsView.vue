<template>
  <StandardPageLayout
    title="Configurações"
    highlight="Configurações"
    subtitle="Personalize sua experiência no Divi."
  >
    <div class="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
      <!-- SEÇÃO: TEMA -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-[10px] font-bold uppercase tracking-[0.2em] ml-4">
          Tema
        </NText>
        <NCard :bordered="false" class="!rounded-2xl !bg-white dark:!bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 shadow-sm overflow-hidden" :content-style="{ padding: '0px' }">
          <NList hoverable clickable>
            <!-- Cor de Destaque -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-zinc-100 dark:hover:!bg-zinc-800/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <i class="i-lucide-palette text-xl"></i>
                </div>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-[15px]">Cor de destaque</NText>
                  <NText depth="3" class="text-[11px]">Selecione um tema de cor para a interface</NText>
                </div>
                <i class="i-lucide-chevron-right text-zinc-400 dark:text-zinc-600"></i>
              </div>
            </NListItem>

            <!-- Material You Toggle -->
            <NListItem class="!px-5 !py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <i class="i-lucide-brush text-xl"></i>
                </div>
                <div class="flex-1">
                  <NText strong class="text-[15px]">Material You</NText>
                </div>
                <NSwitch :default-value="false" />
              </div>
            </NListItem>

            <!-- Modo de Tema -->
            <NListItem class="!px-5 !py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <i :class="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" class="text-xl"></i>
                </div>
                <div class="flex-1">
                  <NText strong class="text-[15px]">Modo de tema</NText>
                </div>
                <NSelect
                  v-model:value="themeMode"
                  :options="themeOptions"
                  class="w-32"
                  size="small"
                  @update:value="handleThemeChange"
                />
              </div>
            </NListItem>
          </NList>
        </NCard>
      </div>

      <!-- SEÇÃO: PREFERÊNCIAS -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-[10px] font-bold uppercase tracking-[0.2em] ml-4">
          Preferências
        </NText>
        <NCard :bordered="false" class="!rounded-2xl !bg-white dark:!bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 shadow-sm overflow-hidden" :content-style="{ padding: '0px' }">
          <NList hoverable clickable>
            <!-- Editar Página Inicial -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-zinc-100 dark:hover:!bg-zinc-800/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <i class="i-lucide-home text-xl"></i>
                </div>
                <div class="flex-1">
                  <NText strong class="text-[15px]">Editar página inicial</NText>
                </div>
                <i class="i-lucide-chevron-right text-zinc-400 dark:text-zinc-600"></i>
              </div>
            </NListItem>

            <!-- Idioma -->
            <NListItem class="!px-5 !py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <i class="i-lucide-languages text-xl"></i>
                </div>
                <div class="flex-1">
                  <NText strong class="text-[15px]">Idioma</NText>
                </div>
                <NSelect
                  v-model:value="language"
                  :options="languageOptions"
                  class="w-36"
                  size="small"
                />
              </div>
            </NListItem>

            <!-- Mais Opções -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-zinc-100 dark:hover:!bg-zinc-800/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <i class="i-lucide-layout-grid text-xl"></i>
                </div>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-[15px]">Mais opções</NText>
                  <NText depth="3" class="text-[11px]">Estilo, transações, contas, formatos</NText>
                </div>
                <i class="i-lucide-chevron-right text-zinc-400 dark:text-zinc-600"></i>
              </div>
            </NListItem>
          </NList>
        </NCard>
      </div>

      <!-- SEÇÃO: FERRAMENTAS E EXTRAS -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-[10px] font-bold uppercase tracking-[0.2em] ml-4">
          Ferramentas e extras
        </NText>
        <NCard :bordered="false" class="!rounded-2xl !bg-white dark:!bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 shadow-sm overflow-hidden" :content-style="{ padding: '0px' }">
          <NList hoverable clickable>
            <!-- Divisor de Contas -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-zinc-100 dark:hover:!bg-zinc-800/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <i class="i-lucide-users text-xl"></i>
                </div>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-[15px]">Divisor de Contas</NText>
                  <NText depth="3" class="text-[11px]">Divida a conta de forma rápida e fácil</NText>
                </div>
                <i class="i-lucide-chevron-right text-zinc-400 dark:text-zinc-600"></i>
              </div>
            </NListItem>
          </NList>
        </NCard>
      </div>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard,
  NSpace,
  NText,
  NList,
  NListItem,
  NSwitch,
  NSelect,
} from 'naive-ui'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import { useTheme } from '@/core/theme'

const { isDark, toggle: toggleTheme } = useTheme()

const themeMode = ref('system')
const themeOptions = [
  { label: 'Sistema', value: 'system' },
  { label: 'Escuro', value: 'dark' },
  { label: 'Claro', value: 'light' },
]

const language = ref('pt-BR')
const languageOptions = [
  { label: 'Português', value: 'pt-BR' },
  { label: 'English', value: 'en-US' },
]

function handleThemeChange(value: string) {
  // Logic to handle theme change
  if (value === 'dark' && !isDark.value) toggleTheme()
  if (value === 'light' && isDark.value) toggleTheme()
}
</script>

<style scoped>
:deep(.n-list) {
  --n-color: transparent !important;
  --n-border-color: rgba(128, 128, 128, 0.1) !important;
}

:deep(.n-list-item) {
  border-bottom: 1px solid rgba(128, 128, 128, 0.1) !important;
}

:deep(.n-list-item:last-child) {
  border-bottom: none !important;
}

:deep(.n-card) {
  backdrop-filter: blur(12px);
}
</style>
