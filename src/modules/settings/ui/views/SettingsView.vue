<template>
  <div class="settings-page p-6 max-w-5xl mx-auto pb-32 md:pb-6">
    <header class="mb-8">
      <h1 class="text-4xl font-black text-surface-800 dark:text-surface-50 tracking-tight mb-2">Configurações</h1>
      <p class="text-surface-600 dark:text-surface-200 opacity-60">Personalize sua experiência no Divi.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="border-none shadow-lg bg-surface-0/40 dark:bg-surface-800/40 backdrop-blur-md">
        <template #title>Categorias</template>
        <template #content>
          <div class="flex flex-col gap-4">
            <p class="text-sm opacity-60 mb-2">Gerencie as categorias para organizar suas transações e orçamentos.</p>
            
            <form @submit.prevent="handleAddCategory" class="flex gap-2">
              <BaseInput
                id="newCategoryName"
                v-model="newCategoryName"
                placeholder="Nome da nova categoria"
                class="flex-1 !mb-0"
              />
              <BaseButton
                type="submit"
                variant="primary"
                class="!py-0"
                :disabled="!newCategoryName.trim() || isSaving"
                :loading="isSaving"
              >
                Adicionar
              </BaseButton>
            </form>

            <div class="mt-4">
              <h4 class="text-xs font-bold uppercase tracking-widest text-surface-600 dark:text-surface-400 mb-3">Categorias Atuais</h4>
              
              <div v-if="transactionStore.categories.length === 0" class="text-sm text-surface-500 italic p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl text-center">
                Nenhuma categoria cadastrada.
              </div>
              
              <ul v-else class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                <li 
                  v-for="cat in transactionStore.categories" 
                  :key="cat.id"
                  class="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
                >
                  <span class="font-medium text-surface-800 dark:text-surface-100">{{ cat.name }}</span>
                  <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: cat.color || '#9ca3af' }"></div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </Card>

      <div class="flex flex-col gap-6">
        <Card class="border-none shadow-lg bg-surface-0/40 dark:bg-surface-800/40 backdrop-blur-md">
          <template #title>Sincronização</template>
          <template #content>
            <div class="flex flex-col gap-4">
              <p class="text-sm opacity-60">Ajuste a frequência de sincronização e preferências de rede.</p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

const transactionStore = useTransactionStore()

const newCategoryName = ref('')
const isSaving = ref(false)

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#d946ef', '#f43f5e', '#f43f5e', '#e11d48'
]

onMounted(async () => {
  if (transactionStore.categories.length === 0) {
    await transactionStore.fetchCategories()
  }
})

const handleAddCategory = async () => {
  const name = newCategoryName.value.trim()
  if (!name) return

  isSaving.value = true
  try {
    // Generate a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    await transactionStore.saveCategory({
      name,
      color: randomColor,
    } as any)
    
    newCategoryName.value = ''
  } catch (error) {
    console.error('Erro ao salvar categoria', error)
    alert('Não foi possível salvar a categoria.')
  } finally {
    isSaving.value = false
  }
}
</script>
