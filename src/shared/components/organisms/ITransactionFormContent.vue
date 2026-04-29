<template>
  <div class="p-6 bg-white dark:bg-[#1c1c1e] h-full">
    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      :show="showConfirmDelete"
      title="Excluir Transação"
      :message="messages.MSG_A_DELETE_CONFIRM"
      confirm-text="Excluir"
      cancel-text="Cancelar"
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
      <!-- Luxury Type Switcher (Segmented Control) -->
      <NFormItem :show-label="false" path="type">
        <NRadioGroup
          v-model:value="form.type"
          name="ITransaction-type"
          class="w-full"
        >
          <div class="flex p-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-[9px] w-full relative overflow-hidden">

            <!-- Expense Tab -->
            <NRadioButton
              value="expense"
              class="flex-1 !rounded-[7px] !border-none !bg-transparent text-center select-none transition-all duration-150 ease-out relative"
            >
              <div class="flex items-center justify-center gap-2 py-2.5">
                <span
                  class="font-semibold text-[13px] tracking-tight transition-all duration-150"
                  :class="form.type === 'expense' ? 'text-[#1d1d1f] dark:text-white' : 'text-[#6e6e73] dark:text-[#8e8e93]'"
                >
                  Despesa
                </span>
              </div>
            </NRadioButton>

            <!-- Income Tab -->
            <NRadioButton
              value="income"
              class="flex-1 !rounded-[7px] !border-none !bg-transparent text-center select-none transition-all duration-150 ease-out relative"
            >
              <div class="flex items-center justify-center gap-2 py-2.5">
                <span
                  class="font-semibold text-[13px] tracking-tight transition-all duration-150"
                  :class="form.type === 'income' ? 'text-[#1d1d1f] dark:text-white' : 'text-[#6e6e73] dark:text-[#8e8e93]'"
                >
                  Receita
                </span>
              </div>
            </NRadioButton>
          </div>
        </NRadioGroup>
      </NFormItem>

      <!-- Title Input -->
      <NFormItem label="Título" path="title">
        <template #label>
          <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Título</span>
        </template>
        <NInput
          v-model:value="form.title"
          placeholder="Ex: Netflix, Supermercado..."
          @input="handleTitleInput"
          class="!rounded-xl"
        />
      </NFormItem>

      <NGrid :x-gap="20" :cols="2">
        <!-- Amount Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Valor" path="amount">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Valor</span>
            </template>
            <NInput
              :value="displayAmount"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputAmount"
            >
              <template #prefix>
                <span class="text-[13px] font-semibold text-[#8e8e93] dark:text-[#636366] mr-1">{{ activeConfig?.symbol || 'R$' }}</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Date Picker -->
        <NGi>
          <NFormItem label="Data" path="date">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Data</span>
            </template>
            <NDatePicker
              v-model:value="timestampDate"
              type="date"
              format="dd/MM/yyyy"
              class="w-full !rounded-xl"
              input-readonly
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <NGrid :x-gap="20" :cols="2">
        <!-- ICategory Selection -->
        <NGi>
          <NFormItem label="Categoria" path="category_id">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Categoria</span>
            </template>
            <NSelect
              v-model:value="form.category_id"
              :options="categoryOptions"
              filterable
              tag
              scrollable
              placeholder="Selecione ou crie..."
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>

        <!-- IWallet Selection -->
        <NGi>
          <NFormItem label="Conta" path="wallet_id">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Conta</span>
            </template>
            <NSelect
              v-model:value="form.wallet_id"
              :options="IWalletOptions"
              filterable
              tag
              scrollable
              placeholder="Selecione ou crie..."
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Action Buttons (Apple Style) -->
      <div class="flex items-center gap-3 pt-8">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-[48px] !rounded-xl font-semibold text-[17px] tracking-tight !bg-[#ff3b30]/10 !text-[#ff3b30] hover:!bg-[#ff3b30] hover:!text-white active:scale-[0.98] select-none transition-all duration-150"
          @click="handleDelete"
        >
          Excluir
        </NButton>
        <NButton
          type="primary"
          :loading="isSubmitting"
          class="flex-[2] !h-[48px] !rounded-xl font-semibold text-[17px] tracking-tight !bg-[#0071e3] hover:!bg-[#0066cc] active:scale-[0.98] select-none transition-all duration-150"
          @click="() => handleSubmit(formRef)"
        >
          Salvar
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NDatePicker,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NRadioGroup,
  NRadioButton,
  NGrid,
  NGi,
  useMessage,
  type FormInst
} from 'naive-ui'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import { messages } from '@/shared/messages/catalog'
import { useTransactionForm } from '@/modules/transactions/application/composables/useTransactionForm'

const props = defineProps<{
  initialData?: ITransaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const message = useMessage()
const formRef = ref<FormInst | null>(null)

const {
  form,
  rules,
  isSubmitting,
  showConfirmDelete,
  categoryOptions,
  IWalletOptions,
  activeConfig,
  displayAmount,
  timestampDate,
  handleInputAmount,
  handleTitleInput,
  handleSubmit,
  handleDelete,
  confirmDelete
} = useTransactionForm(props, emit, message)
</script>

<style scoped>
/* Naive UI theme handles all styling via naiveTheme.ts */

/* Segmented Control - Apple Style */
:deep(.n-radio-button) {
  --n-button-border-radius: 7px !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

:deep(.n-radio-button:active) {
  transform: scale(0.97);
  opacity: 0.85;
}

/* Selected button - permanent pressed state */
:deep(.n-radio-button.n-radio-button--checked) {
  background-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  transform: scale(1);
}

:is(.dark) :deep(.n-radio-button.n-radio-button--checked) {
  background-color: #3a3a3c !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

:deep(.n-radio-button .n-radio-button__state-border) {
  display: none !important;
}

:deep(.n-radio-button:focus-within) {
  outline: none !important;
}

:deep(.n-radio-button:focus-visible) {
  box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.4) !important;
  border-radius: 7px !important;
}

/* Button interactions */
:deep(.n-button) {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

:deep(.n-button:active) {
  transform: scale(0.98);
}

:deep(.n-button.n-button--loading) {
  opacity: 0.85 !important;
}
</style>
