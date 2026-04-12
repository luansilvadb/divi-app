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
      class="space-y-4"
    >
      <!-- Name Input -->
      <NFormItem label="Nome da Conta" path="name">
        <template #label>
          <div class="flex items-center gap-2 opacity-60">
            <i class="i-lucide-landmark text-xs"></i>
            <span class="text-[10px] uppercase font-bold tracking-widest">Identificação</span>
          </div>
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
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-banknote text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Saldo Atual</span>
              </div>
            </template>
            <NInput
              :value="displayBalance"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputBalance"
            >
              <template #prefix>
                <span class="text-xs font-bold opacity-40 mr-1">{{ activeConfig.symbol }}</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Currency Type -->
        <NGi>
          <NFormItem label="Moeda" path="currency">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-globe text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Moeda</span>
              </div>
            </template>
            <NSelect
              v-model:value="form.currency"
              :options="currencyOptions"
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Action Buttons (Clean Layout) -->
      <div class="flex items-center gap-4 pt-6">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest !bg-red-500/10 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-300"
          @click="handleDelete"
        >
          Excluir Conta
        </NButton>
        <NButton
          type="primary"
          :loading="isSubmitting"
          class="flex-[2] !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-violet-500/20"
          @click="handleSubmit"
        >
          Salvar Conta
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

const activeConfig = computed(() => currencyConfigs[form.currency] || currencyConfigs.BRL)

// --- Live Masking Logic ---

const displayBalance = computed(() => {
  if (form.balance === null) return ''
  return new Intl.NumberFormat(activeConfig.value.locale, {
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

const formatCurrency = (value: number | null) => {
  if (value === null || isNaN(value)) return ''
  return new Intl.NumberFormat(activeConfig.value.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.name = newData.name
      form.balance = newData.balance
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
  } catch (error: any) {
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
      const walletData: Partial<Wallet> = {
        ...(props.initialData || {}),
        name: form.name,
        balance: form.balance || 0,
        currency: form.currency,
      }

      await store.saveWallet(walletData)
      emit('saved')
      emit('close')
      message.success('Conta salva com sucesso!')
    } catch (error: any) {
      message.error(error.message || 'Erro ao salvar conta.')
    } finally {
      isSubmitting.value = false
    }
  })
}
</script>

<style scoped>
:deep(.n-input), 
:deep(.n-input-number), 
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
:is(.dark) :deep(.n-select .n-base-selection) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.n-form-item .n-form-item-label) {
  padding-bottom: 4px;
}
</style>
