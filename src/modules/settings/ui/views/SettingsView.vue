<template>
  <StandardPageLayout
    title="Configurações"
    highlight="Configurações"
    subtitle="Personalize sua experiência no Divi."
  >
    <div class="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
      <!-- SEÇÃO: TEMA -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-xs font-bold uppercase tracking-widest ml-4 text-secondary">
          Tema
        </NText>
        <div class="bg-surface-primary rounded-xl border border-separator overflow-hidden transition-colors duration-normal">
          <NList hoverable clickable>
            <!-- Cor de Destaque -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer group">
              <div class="flex items-center gap-4">
                <BaseIconBox size="md">
                  <i class="i-lucide-palette text-xl"></i>
                </BaseIconBox>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-base">Cor de destaque</NText>
                  <NText depth="3" class="text-xs">Selecione um tema de cor para a interface</NText>
                </div>
                <i class="i-lucide-chevron-right text-tertiary transition-transform group-hover:translate-x-0.5"></i>
              </div>
            </NListItem>

            <!-- Material You Toggle -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-info)">
                  <i class="i-lucide-brush text-xl"></i>
                </BaseIconBox>
                <div class="flex-1">
                  <NText strong class="text-base">Material You</NText>
                </div>
                <NSwitch :default-value="false" />
              </div>
            </NListItem>

            <!-- Modo de Tema -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--text-tertiary)">
                  <i :class="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" class="text-xl"></i>
                </BaseIconBox>
                <div class="flex-1">
                  <NText strong class="text-base">Modo de tema</NText>
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
        </div>
      </div>

      <!-- SEÇÃO: PREFERÊNCIAS -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-xs font-bold uppercase tracking-widest ml-4 text-secondary">
          Preferências
        </NText>
        <div class="bg-surface-primary rounded-xl border border-separator overflow-hidden transition-colors duration-normal">
          <NList hoverable clickable>
            <!-- Editar Página Inicial -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer group">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-warning)">
                  <i class="i-lucide-home text-xl"></i>
                </BaseIconBox>
                <div class="flex-1">
                  <NText strong class="text-base">Editar página inicial</NText>
                </div>
                <i class="i-lucide-chevron-right text-tertiary transition-transform group-hover:translate-x-0.5"></i>
              </div>
            </NListItem>

            <!-- Idioma -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-success)">
                  <i class="i-lucide-languages text-xl"></i>
                </BaseIconBox>
                <div class="flex-1">
                  <NText strong class="text-base">Idioma</NText>
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
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer group">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--text-tertiary)">
                  <i class="i-lucide-layout-grid text-xl"></i>
                </BaseIconBox>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-base">Mais opções</NText>
                  <NText depth="3" class="text-xs">Estilo, transações, contas, formatos</NText>
                </div>
                <i class="i-lucide-chevron-right text-tertiary transition-transform group-hover:translate-x-0.5"></i>
              </div>
            </NListItem>
          </NList>
        </div>
      </div>

      <!-- SEÇÃO: FERRAMENTAS E EXTRAS -->
      <div class="flex flex-col gap-3">
        <NText depth="3" class="text-xs font-bold uppercase tracking-widest ml-4 text-secondary">
          Ferramentas e extras
        </NText>
        <div class="bg-surface-primary rounded-xl border border-separator overflow-hidden transition-colors duration-normal">
          <NList hoverable clickable>
            <!-- Divisor de Contas -->
            <NListItem class="!px-5 !py-4 transition-colors hover:!bg-surface-secondary cursor-pointer group">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-info)">
                  <i class="i-lucide-users text-xl"></i>
                </BaseIconBox>
                <div class="flex-1 flex flex-col">
                  <NText strong class="text-base">Divisor de Contas</NText>
                  <NText depth="3" class="text-xs">Divida a conta de forma rápida e fácil</NText>
                </div>
                <i class="i-lucide-chevron-right text-tertiary transition-transform group-hover:translate-x-0.5"></i>
              </div>
            </NListItem>
          </NList>
        </div>
      </div>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NText,
  NList,
  NListItem,
  NSwitch,
  NSelect,
} from 'naive-ui'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
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
  if (value === 'dark' && !isDark.value) toggleTheme()
  if (value === 'light' && isDark.value) toggleTheme()
}
</script>
