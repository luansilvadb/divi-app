<template>
  <div class="p-6 bg-transparent h-full">
    <!-- Confirm Delete Dialog (Refined Luxury Pattern) -->
    <BaseConfirmDialog
      :show="showConfirmDelete"
      title="Excluir Orçamento"
      message="Tem certeza que deseja remover este planejamento? Os dados de limite e categoria serão apagados."
      confirm-text="Excluir"
      cancel-text="Manter"
      @confirm="confirmDelete"
      @cancel="showConfirmDelete = false"
    />

    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      size="large"
      label-placement="top"
      class="space-y-4"
    >
      <!-- Name Input -->
      <NFormItem label="Nome do Orçamento" path="name">
        <template #label>
          <div class="flex items-center gap-2 opacity-60">
            <i class="i-lucide-type text-xs"></i>
            <span class="text-[10px] uppercase font-bold tracking-widest">Identificação (Opcional)</span>
          </div>
        </template>
        <NInput
          v-model:value="form.name"
          placeholder="Ex: Orçamento Mensal, Viagem..."
          class="!rounded-xl"
        />
      </NFormItem>

      <NGrid :x-gap="16" :cols="2">
        <!-- Limit Value Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Valor Limite" path="limit_value">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-banknote text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Meta de Gastos</span>
              </div>
            </template>
            <NInput
              :value="displayLimit"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputLimit"
            >
              <template #prefix>
                <span class="text-xs font-bold opacity-40 mr-1">R$</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Category Selection -->
        <NGi>
          <NFormItem label="Categoria" path="category_id">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-layers text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Categoria</span>
              </div>
            </template>
            <NSelect
              v-model:value="form.category_id"
              :options="categoryOptions"
              filterable
              tag
              placeholder="Selecione ou crie..."
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Action Buttons (Clean Layout) -->
      <div class="flex items-center gap-4 pt-6 mt-4">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest !bg-red-500/10 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-300"
          @click="handleDelete"
        >
          Excluir Orçamento
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

    </NForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NGrid,
  NGi,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import type { Budget } from '@/shared/domain/entities/Budget'
import type { Category } from '@/shared/domain/entities/Category'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const props = defineProps<{
  initialData?: Budget | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useBudgetStore()
const transactionStore = useTransactionStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const showConfirmDelete = ref(false)

const form = reactive({
  name: '',
  limit_value: null as number | null,
  category_id: null as string | null,
})

const rules: FormRules = {
  limit_value: { required: true, type: 'number', min: 0.01, message: 'Defina um valor maior que zero', trigger: 'blur' },
  category_id: { required: true, message: 'Selecione uma categoria', trigger: 'change' }
}

const categoryOptions = computed(() =>
  transactionStore.categories.map(cat => ({ label: cat.name, value: cat.id }))
)

// --- Live Masking Logic ---

const displayLimit = computed(() => {
  if (form.limit_value === null) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(form.limit_value)
})

function handleInputLimit(val: string) {
  const digits = val.replace(/\D/g, '')
  if (!digits) {
    form.limit_value = null
    return
  }
  form.limit_value = Number(digits) / 100
}

const formatCurrency = (value: number | null) => {
  if (value === null || isNaN(value)) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.name = newData.name || ''
      form.limit_value = typeof newData.limit_value === 'bigint' ? Number(newData.limit_value) / 100 : (newData.limit_value || null)
      form.category_id = newData.category_id || null
    } else {
      form.name = ''
      form.limit_value = null
      form.category_id = null
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
  formRef.value?.validate(async (errors) => {
    if (errors) return

    isSubmitting.value = true
    try {
      let finalCategoryId = form.category_id

      if (finalCategoryId && !transactionStore.categories.some(c => c.id === finalCategoryId)) {
        const existingByName = transactionStore.categories.find(
          (c) => c.name.toLowerCase() === finalCategoryId?.toLowerCase(),
        )

        if (existingByName) {
          finalCategoryId = existingByName.id
        } else {
          const randomColor = colors[Math.floor(Math.random() * colors.length)]
          await transactionStore.saveCategory({
            name: finalCategoryId,
            color: randomColor,
          } as Category)
          const newlyCreated = transactionStore.categories.find((c) => c.name === finalCategoryId)
          if (newlyCreated) finalCategoryId = newlyCreated.id
        }
      }

      const budgetData = {
        ...props.initialData,
        name: form.name || undefined,
        limit_value: BigInt(Math.round((form.limit_value || 0) * 100)),
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
  })
}
</script>

<style scoped>
:deep(.n-input),
:deep(.n-input-number),
:deep(.n-date-picker),
:deep(.n-select .n-base-selection) {
  --n-border-radius: 12px !important;
  background-color: rgba(var(--color-zinc-500-rgb), 0.05) !important;
  border: 1px solid transparent !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.n-input:hover),
:deep(.n-select .n-base-selection:hover) {
  border-color: rgba(139, 92, 246, 0.3) !important;
}

:deep(.n-input.n-input--focus),
:deep(.n-select.n-select--active .n-base-selection) {
  background-color: transparent !important;
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1) !important;
}

:is(.dark) :deep(.n-input),
:is(.dark) :deep(.n-input-number),
:is(.dark) :deep(.n-date-picker),
:is(.dark) :deep(.n-select .n-base-selection) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.n-form-item .n-form-item-label) {
  padding-bottom: 4px;
}
</style>
