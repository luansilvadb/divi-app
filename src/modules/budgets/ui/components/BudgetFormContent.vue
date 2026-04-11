<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-5 space-y-4 bg-surface-0 dark:bg-surface-800 h-full max-h-none pb-4"
  >
    <div class="space-y-4">
      <BaseInput
        id="name"
        label="Nome do Orçamento (Opcional)"
        v-model="form.name"
        placeholder="Ex: Orçamento da Casa"
        class="premium-input-group"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          id="limit_value"
          label="Valor Limite (R$)"
          type="number"
          :step="0.01"
          :min="0.01"
          v-model="form.limit_value"
          placeholder="0,00"
          required
          class="!mb-0"
        />

        <BaseSelect
          id="category"
          label="Categoria"
          v-model="form.category_id"
          :options="transactionStore.categories.map((cat) => ({ label: cat.name, value: cat.id }))"
          placeholder="Selecione ou digite nova"
          required
          class="!mb-0"
          editable
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4 pt-4 shrink-0">
      <BaseButton
        variant="ghost"
        type="button"
        class="flex-1 !py-3 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100 hover:bg-surface-50 dark:hover:bg-surface-800/10 transition-all"
        @click="$emit('close')"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        type="submit"
        :loading="isSubmitting"
        class="flex-[2] !py-3 font-black uppercase text-[0.7rem] tracking-[0.15em] transition-all"
        variant="primary"
        :disabled="!form.limit_value || !form.category_id"
      >
        Salvar Orçamento
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import type { Budget } from '@/shared/domain/entities/Budget'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'

const props = defineProps<{
  initialData?: Budget | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useBudgetStore()
const transactionStore = useTransactionStore()

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  limit_value: 0,
  category_id: ''
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.name = newData.name || ''
      form.limit_value = newData.limit_value || 0
      form.category_id = newData.category_id || ''
    } else {
      form.name = ''
      form.limit_value = 0
      form.category_id = ''
    }
  },
  { immediate: true }
)

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#d946ef', '#f43f5e', '#f43f5e', '#e11d48'
]

const handleSubmit = async () => {
  if (!form.limit_value || !form.category_id) return

  isSubmitting.value = true
  try {
    let finalCategoryId = form.category_id

    // Verifica se a string digitada já é um ID existente
    const isExistingCategory = transactionStore.categories.some(c => c.id === finalCategoryId)
    
    if (!isExistingCategory) {
      // É uma nova categoria digitada. Verifica se já existe uma com esse exato nome (case-insensitive)
      const existingByName = transactionStore.categories.find(c => c.name.toLowerCase() === form.category_id.toLowerCase())
      
      if (existingByName) {
        finalCategoryId = existingByName.id
      } else {
        // Cria a nova categoria em tempo real
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        await transactionStore.saveCategory({
          name: form.category_id,
          color: randomColor
        } as any)
        
        // Pega a categoria recém-criada (a última adicionada ou buscando pelo nome)
        const newlyCreated = transactionStore.categories.find(c => c.name === form.category_id)
        if (newlyCreated) {
          finalCategoryId = newlyCreated.id
        }
      }
    }

    const budgetData = {
      ...props.initialData,
      name: form.name || undefined,
      limit_value: Number(form.limit_value),
      category_id: finalCategoryId,
      period: 'monthly' as const
    } as Budget

    await store.saveBudget(budgetData)
    
    // Reset form
    form.name = ''
    form.limit_value = 0
    form.category_id = ''
    
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Failed to save budget:', error)
    alert('Erro ao salvar o orçamento: ' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isSubmitting.value = false
  }
}
</script>
