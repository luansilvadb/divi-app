<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-5 space-y-4 bg-surface-0 dark:bg-surface-800 h-full max-h-none pb-4"
  >
    <div class="space-y-4">
      <div v-if="transactionStore.categories.length === 0" class="p-3 bg-error/10 text-error rounded-xl text-sm font-bold flex items-center gap-2">
        <i class="pi pi-exclamation-triangle"></i>
        Você precisa criar pelo menos uma categoria antes de adicionar orçamentos.
      </div>

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
          placeholder="Selecionar Categoria"
          required
          class="!mb-0"
          :disabled="transactionStore.categories.length === 0"
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
        :disabled="!form.limit_value || !form.category_id || transactionStore.categories.length === 0"
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

const handleSubmit = async () => {
  if (!form.limit_value || !form.category_id) return

  isSubmitting.value = true
  try {
    const budgetData = {
      ...(props.initialData || {}),
      name: form.name || undefined,
      limit_value: Number(form.limit_value),
      category_id: form.category_id,
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
