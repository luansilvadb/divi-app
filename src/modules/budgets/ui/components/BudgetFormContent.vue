<template>
  <!-- Premium Validation Message (Strategic UI) -->
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="transform -translate-y-12 opacity-0 scale-90"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-12 opacity-0 scale-90"
    >
      <div
        v-if="showError"
        class="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[90vw] sm:max-w-md px-6 pointer-events-none"
      >
        <Message
          severity="error"
          @close="showError = false"
          class="pointer-events-auto"
          :pt="{
            root: {
              class:
                'relative overflow-hidden border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl bg-white/95 dark:bg-surface-800/95 backdrop-blur-md',
            },
            content: { class: 'p-4 flex items-center gap-4' },
            text: { class: 'flex-1' },
            closeButton: {
              class:
                'w-8 h-8 rounded-lg hover:bg-surface-100 dark:hover:bg-white/5 text-surface-400 transition-colors',
            },
          }"
        >
          <template #messageicon>
            <div
              class="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error shrink-0"
            >
              <i class="pi pi-exclamation-circle text-lg"></i>
            </div>
          </template>

          <div class="flex flex-col">
            <p class="text-[0.9rem] font-bold text-surface-900 dark:text-surface-50 leading-tight">
              {{ validationMessage.title }}
            </p>
            <p class="text-[0.75rem] text-surface-500 dark:text-surface-400 font-medium">
              {{ validationMessage.subtitle }}
            </p>
          </div>
        </Message>
      </div>
    </transition>
  </Teleport>

  <!-- Confirm Delete Dialog -->
  <ConfirmDeleteDialog
    :show="showConfirmDelete"
    @confirm="confirmDelete"
    @cancel="showConfirmDelete = false"
  />

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
        v-if="props.initialData"
        variant="danger-tinted"
        type="button"
        class="flex-1 !py-3 font-black uppercase text-[0.7rem] tracking-widest"
        @click="handleDelete"
      >
        Excluir
      </BaseButton>
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
import type { Category } from '@/modules/transactions/domain/entities/Category'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import Message from 'primevue/message'
import ConfirmDeleteDialog from '@/shared/components/molecules/ConfirmDeleteDialog.vue'

const props = defineProps<{
  initialData?: Budget | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useBudgetStore()
const transactionStore = useTransactionStore()

const isSubmitting = ref(false)
const showError = ref(false)
const showConfirmDelete = ref(false)

const form = reactive({
  name: '',
  limit_value: 0,
  category_id: '',
})

const validationMessage = reactive({
  title: '',
  subtitle: '',
})

watch(showError, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showError.value = false
    }, 4000)
  }
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
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#d946ef',
  '#f43f5e',
  '#f43f5e',
  '#e11d48',
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
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Failed to delete budget:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = async () => {
  // Validation Logic
  if (!form.category_id) {
    validationMessage.title = 'Categoria Ausente'
    validationMessage.subtitle = 'Por favor, selecione ou digite uma categoria para este orçamento.'
    showError.value = true
    return
  }

  if (!form.limit_value || form.limit_value <= 0) {
    validationMessage.title = 'Valor Inválido'
    validationMessage.subtitle = 'O valor limite do orçamento deve ser maior que zero.'
    showError.value = true
    return
  }

  isSubmitting.value = true
  try {
    let finalCategoryId = form.category_id

    // Verifica se a string digitada já é um ID existente
    const isExistingCategory = transactionStore.categories.some((c) => c.id === finalCategoryId)

    if (!isExistingCategory) {
      // É uma nova categoria digitada. Verifica se já existe uma com esse exato nome (case-insensitive)
      const existingByName = transactionStore.categories.find(
        (c) => c.name.toLowerCase() === form.category_id.toLowerCase(),
      )

      if (existingByName) {
        finalCategoryId = existingByName.id
      } else {
        // Cria a nova categoria em tempo real
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        await transactionStore.saveCategory({
          name: form.category_id,
          color: randomColor,
        } as Category)

        // Pega a categoria recém-criada (a última adicionada ou buscando pelo nome)
        const newlyCreated = transactionStore.categories.find((c) => c.name === form.category_id)
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
      period: 'monthly' as const,
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
