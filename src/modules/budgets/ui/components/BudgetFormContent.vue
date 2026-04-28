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
      class="space-y-5"
    >
      <!-- Name Input -->
      <NFormItem label="Nome" path="name">
        <template #label>
          <span class="text-[13px] font-semibold text-label-2 tracking-tight">Nome</span>
        </template>
        <NInput
          v-model:value="form.name"
          placeholder="Ex: Orçamento Mensal, Viagem..."
        />
      </NFormItem>

      <NGrid :x-gap="16" :cols="2">
        <!-- Limit Value Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Valor Limite" path="limit_value">
            <template #label>
              <span class="text-[13px] font-semibold text-label-2 tracking-tight">Valor Limite</span>
            </template>
            <NInput
              :value="displayLimit"
              placeholder="0,00"
              @input="handleInputLimit"
            >
              <template #prefix>
                <span class="text-[13px] font-semibold text-label-3 dark:text-label-3-dark mr-1">R$</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- ICategory Selection -->
        <NGi>
          <NFormItem label="Categoria" path="category_id">
            <template #label>
              <span class="text-[13px] font-semibold text-label-2 tracking-tight">Categoria</span>
            </template>
            <NSelect
              v-model:value="form.category_id"
              :options="categoryOptions"
              filterable
              tag
              placeholder="Selecione ou crie..."
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Action Buttons (Apple Style) -->
      <div class="flex items-center gap-4 pt-8">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-[48px] !rounded-[980px] font-semibold text-[17px] tracking-tight !bg-error-subtle dark:!bg-error-subtle-dark !text-error-main dark:!text-error-main-dark hover:!bg-error-main hover:!text-white active:scale-[0.98] transition-all duration-150"
          @click="handleDelete"
        >
          Excluir
        </NButton>
        <NButton
          type="primary"
          :loading="isSubmitting"
          class="flex-[2] !h-[48px] !rounded-[980px] font-semibold text-[17px] tracking-tight !bg-apple-action hover:!bg-apple-action-hover active:scale-[0.98] transition-all duration-150"
          @click="handleSubmit"
        >
          Salvar
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
  NSelect,
  NGrid,
  NGi,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { usetransactionstore } from '@/modules/transactions/application/stores/transactionstore'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const props = defineProps<{
  initialData?: IBudget | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useBudgetStore()
const transactionstore = usetransactionstore()
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
  transactionstore.categories.map(cat => ({ label: cat.name, value: cat.id }))
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

      if (finalCategoryId && !transactionstore.categories.some(c => c.id === finalCategoryId)) {
        const existingByName = transactionstore.categories.find(
          (c) => c.name.toLowerCase() === finalCategoryId?.toLowerCase(),
        )

        if (existingByName) {
          finalCategoryId = existingByName.id
        } else {
          const randomColor = colors[Math.floor(Math.random() * colors.length)]
          await transactionstore.saveCategory({
            name: finalCategoryId,
            color: randomColor,
          } as ICategory)
          const newlyCreated = transactionstore.categories.find((c) => c.name === finalCategoryId)
          if (newlyCreated) finalCategoryId = newlyCreated.id
        }
      }

      const budgetData = {
        ...props.initialData,
        name: form.name || undefined,
        limit_value: BigInt(Math.round((form.limit_value || 0) * 100)),
        category_id: finalCategoryId,
        period: 'monthly' as const,
      } as IBudget

      await store.saveBudget(budgetData)
      message.success('Orçamento salvo com sucesso!')
      emit('saved')
      emit('close')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar o orçamento'
      message.error(msg)
    } finally {
      isSubmitting.value = false
    }
  })
}
</script>

<style scoped>
/* Naive UI theme handles all styling via naiveTheme.ts */

:deep(.n-form-item .n-form-item-label) {
  padding-bottom: 4px;
}
</style>
