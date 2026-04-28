<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NForm, NFormItem, NSelect, NInput, NDatePicker, NButton, NAlert } from 'naive-ui'
import { useService } from '@/core/di'
import { WalletService } from '@/modules/ledger/application/services/WalletService'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import { formatCurrency } from '@/shared/utils/formatters'
import { parseDecimalToBigInt } from '@/shared/utils/bigint-adapter'

import { TransactionService } from '@/modules/ledger/application/services/TransactionService'

const transactionService = useService<TransactionService>('LedgerTransactionService')
const walletService = useService(WalletService)

// State
const fromWalletId = ref<string | null>(null)
const toWalletId = ref<string | null>(null)
const amount = ref<string>('')
const description = ref<string>('')
const date = ref<string>(new Date().toISOString().split('T')[0] || '')
const dateTimestamp = computed({
  get: () => new Date(date.value || '').getTime(),
  set: (val) => { date.value = new Date(val).toISOString().split('T')[0] || '' }
})
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const success = ref<boolean>(false)

// Computed
const wallets = ref<Wallet[]>([])
walletService.wallets$.subscribe(w => { wallets.value = w })
const walletOptions = computed(() => 
  wallets.value.map(w => ({ label: `${w.name} (${formatCurrency(w.balance)})`, value: w.id }))
)
const destinationWalletOptions = computed(() => 
  wallets.value
    .filter(w => w.id !== fromWalletId.value)
    .map(w => ({ label: w.name, value: w.id }))
)
const fromWallet = computed<Wallet | undefined>(() =>
  wallets.value.find((w) => w.id === fromWalletId.value),
)
const isFormValid = computed<boolean>(() => {
  if (!fromWalletId.value || !toWalletId.value || !amount.value) return false
  if (fromWalletId.value === toWalletId.value) return false

  const amountBigInt = parseDecimalToBigInt(amount.value)
  if (!amountBigInt || amountBigInt <= 0n) return false

  return (fromWallet.value?.balance ?? 0n) >= amountBigInt
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null
  success.value = false

  try {
    const amountBigInt = parseDecimalToBigInt(amount.value)
    if (!amountBigInt) throw new Error('Valor inválido')

    await transactionService.executeTransfer(
      fromWalletId.value!,
      toWalletId.value!,
      amountBigInt,
      description.value,
      new Date(date.value),
    )

    // Reset form
    amount.value = ''
    description.value = ''
    success.value = true

    // Visual feedback
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao processar transferência'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Initialize with first two wallets if available
  if (wallets.value.length >= 2) {
    fromWalletId.value = wallets.value[0]?.id || null
    toWalletId.value = wallets.value[1]?.id || null
  }
})
</script>

<template>
  <NCard title="Transferência entre Carteiras" :bordered="false" class="transfer-form">
    <template #header-extra>
      <i class="i-lucide-repeat text-xl text-primary"></i>
    </template>

    <NForm @submit.prevent="handleSubmit" class="space-y-4">
      <!-- From Wallet -->
      <NFormItem label="Carteira de Origem">
        <NSelect
          v-model:value="fromWalletId"
          :options="walletOptions"
          placeholder="Selecione uma carteira"
          :disabled="isLoading"
        />
        <div v-if="fromWallet" class="mt-1 text-xs text-secondary">
          Saldo disponível: {{ formatCurrency(fromWallet.balance) }}
        </div>
      </NFormItem>

      <!-- To Wallet -->
      <NFormItem label="Carteira de Destino">
        <NSelect
          v-model:value="toWalletId"
          :options="destinationWalletOptions"
          placeholder="Selecione uma carteira"
          :disabled="isLoading"
        />
      </NFormItem>

      <!-- Amount -->
      <NFormItem label="Valor">
        <NInput
          v-model:value="amount"
          type="text"
          inputmode="decimal"
          placeholder="0,00"
          :disabled="isLoading"
          class="font-mono"
        />
        <div v-if="error && fromWallet && amount" class="mt-1 text-xs text-error">
          {{ error }}
        </div>
      </NFormItem>

      <!-- Description -->
      <NFormItem label="Descrição (opcional)">
        <NInput
          v-model:value="description"
          placeholder="Ex: Transferência tática"
          :disabled="isLoading"
        />
      </NFormItem>

      <!-- Date -->
      <NFormItem label="Data">
        <NDatePicker
          v-model:value="dateTimestamp"
          type="date"
          :disabled="isLoading"
        />
      </NFormItem>

      <!-- Submit Button -->
      <div class="pt-4">
        <NButton
          type="primary"
          block
          attr-type="submit"
          :loading="isLoading"
          :disabled="!isFormValid || isLoading"
        >
          Transferir
        </NButton>
      </div>

      <!-- Success Message -->
      <NAlert
        v-if="success"
        type="success"
        class="mt-4"
        closable
        @close="success = false"
      >
        Transferência realizada com sucesso!
      </NAlert>
    </NForm>
  </NCard>
</template>

<style scoped>
.transfer-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
