<template>
  <!-- Confirm Delete Dialog -->
  <ConfirmDeleteDialog
    :show="showConfirmDelete"
    @confirm="confirmDelete"
    @cancel="showConfirmDelete = false"
  />

  <form
    @submit.prevent="handleSubmit"
    class="p-6 space-y-6 bg-transparent h-full"
  >
    <div class="space-y-5">
      <BaseInput
        id="name"
        label="Nome do Orçamento (Opcional)"
        v-model="form.name"
        placeholder="Ex: Orçamento da Casa"
        icon="i-lucide-type"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <BaseInput
          id="limit_value"
          label="Valor Limite (R$)"
          type="number"
          :step="0.01"
          :min="0.01"
          v-model="form.limit_value"
          placeholder="0,00"
          required
          icon="i-lucide-banknote"
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
    <div class="flex items-center gap-4 pt-6 mt-4">
      <NButton
        v-if="props.initialData"
        type="error"
        ghost
        class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest !bg-red-500/5 hover:!bg-red-500/10"
        @click="handleDelete"
      >
        Excluir
      </NButton>
      <NButton
        quaternary
        circle
        class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest text-zinc-400"
        @click="$emit('close')"
      >
        Cancelar
      </NButton>
      <NButton
        type="primary"
        :loading="isSubmitting"
        class="flex-[2] !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-violet-500/20"
        @click="handleSubmit"
      >
        Salvar Orçamento
      </NButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import type { Budget } from '@/shared/domain/entities/Budget'
import type { Category } from '@/shared/domain/entities/Category'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import ConfirmDeleteDialog from '@/shared/components/molecules/ConfirmDeleteDialog.vue'

const props = defineProps<{
  initialData?: Budget | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useBudgetStore()
const transactionStore = useTransactionStore()
const message = useMessage()

const isSubmitting = ref(false)
const showConfirmDelete = ref(false)

const form = reactive({
  name: '',
  limit_value: 0,
  category_id: '',
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
  { immediate: true },
)

const colors = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
]

const handleDelete = () => {
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (!props.initialData?.id) return
  showConfirmDelete.value = false
  isSubmitting.value = true
  try {
    await store.deleteBudget(props.initialData.id)
    message.success('Orçamento removido.')
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Failed to delete budget:', error)
    message.error('Erro ao remover orçamento.')
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = async () => {
  if (!form.category_id) {
    message.error('Por favor, selecione uma categoria.')
    return
  }

  if (!form.limit_value || form.limit_value <= 0) {
    message.error('O valor limite deve ser maior que zero.')
    return
  }

  isSubmitting.value = true
  try {
    let finalCategoryId = form.category_id
    const isExistingCategory = transactionStore.categories.some((c) => c.id === finalCategoryId)

    if (!isExistingCategory) {
      const existingByName = transactionStore.categories.find(
        (c) => c.name.toLowerCase() === form.category_id.toLowerCase(),
      )

      if (existingByName) {
        finalCategoryId = existingByName.id
      } else {
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        await transactionStore.saveCategory({
          name: form.category_id,
          color: randomColor,
        } as Category)
        const newlyCreated = transactionStore.categories.find((c) => c.name === form.category_id)
        if (newlyCreated) finalCategoryId = newlyCreated.id
      }
    }

    const budgetData = {
      ...(props.initialData || {}),
      name: form.name || undefined,
      limit_value: Number(form.limit_value),
      category_id: finalCategoryId,
      period: 'monthly' as const,
    } as Budget

    await store.saveBudget(budgetData)
    message.success('Orçamento salvo com sucesso!')
    emit('saved')
    emit('close')
  } catch (error: any) {
    message.error('Erro ao salvar o orçamento: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>
