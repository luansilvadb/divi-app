<template>
  <div class="p-6 bg-transparent h-full">
    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      :show="showConfirmDelete"
      title="Excluir Conta"
      message="Tem certeza que deseja excluir esta conta? O saldo e as transações associadas podem ser afetados."
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
      <!-- Name Input -->
      <NFormItem label="Nome" path="name">
        <template #label>
          <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Nome</span>
        </template>
        <NInput
          v-model:value="form.name"
          placeholder="Ex: Nubank, Carteira, Itaú..."
          class="!rounded-xl"
        />
      </NFormItem>

      <NGrid :x-gap="16" :cols="2">
        <!-- Balance Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Saldo Inicial" path="balance">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Saldo Inicial</span>
            </template>
            <NInput
              :value="displayBalance"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputBalance"
            >
              <template #prefix>
                <span class="text-[13px] font-semibold text-[#8e8e93] dark:text-[#636366] mr-1">{{ activeConfig?.symbol || 'R$' }}</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Currency Type -->
        <NGi>
          <NFormItem label="Moeda" path="currency">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Moeda</span>
            </template>
            <NSelect
              v-model:value="form.currency"
              :options="currencyOptions"
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
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const props = defineProps<{
  initialData?: Wallet | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const showConfirmDelete = ref(false)

const form = reactive({
  name: '',
  balance: null as number | null,
  currency: 'BRL',
})

const rules: FormRules = {
  name: { required: true, message: 'Nome da conta é obrigatório', trigger: 'blur' },
  balance: { required: true, type: 'number', message: 'Saldo inicial é obrigatório', trigger: 'blur' },
}

const currencyOptions = [
  { label: 'Real (BRL)', value: 'BRL' },
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
]

const currencyConfigs: Record<string, { locale: string; symbol: string }> = {
  BRL: { locale: 'pt-BR', symbol: 'R$' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
}

const activeConfig = computed(() => currencyConfigs[form.currency] || currencyConfigs['BRL'])

// --- Live Masking Logic ---

const displayBalance = computed(() => {
  if (form.balance === null) return ''
  return new Intl.NumberFormat(activeConfig.value?.locale || 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(form.balance)
})

function handleInputBalance(val: string) {
  const digits = val.replace(/\D/g, '')
  if (!digits) {
    form.balance = null
    return
  }
  form.balance = Number(digits) / 100
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.name = newData.name
      form.balance = typeof newData.balance === 'bigint' ? Number(newData.balance) / 100 : newData.balance
      form.currency = newData.currency
    }
  },
  { immediate: true },
)

const handleDelete = () => {
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (!props.initialData?.id) return
  showConfirmDelete.value = false
  isSubmitting.value = true
  try {
    // Note: Transaction store needs a deleteWallet if it doesn't have one
    // For now we'll mock it or use saveWallet with deleted flag if supported
    message.warning('Funcionalidade de exclusão em desenvolvimento.')
    emit('close')
  } catch {
    message.error('Erro ao excluir conta.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    isSubmitting.value = true
    try {
      const walletData = {
        ...props.initialData,
        name: form.name,
        balanceNum: form.balance || 0,
        currency: form.currency,
      }

      await store.saveWallet(walletData)
      emit('saved')
      emit('close')
      message.success('Conta salva com sucesso!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar conta.'
      message.error(errorMessage)
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
