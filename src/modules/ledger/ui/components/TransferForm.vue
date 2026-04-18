<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useService } from '@/core/di'
import { LedgerTransactionService } from '@/modules/ledger/application/services/TransactionService'
import { WalletService } from '@/modules/ledger/application/services/WalletService'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import { formatCurrency } from '@/shared/utils/formatters'
import { parseDecimalToBigInt } from '@/shared/utils/bigint-adapter'

const transactionService = useService('LedgerTransactionService')
const walletService = useService(WalletService)

// State
const fromWalletId = ref<string | null>(null)
const toWalletId = ref<string | null>(null)
const amount = ref<string>('')
const description = ref<string>('')
const date = ref<string>(new Date().toISOString().split('T')[0])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const success = ref<boolean>(false)

// Computed
const wallets = computed<Wallet[]>(() => walletService.wallets.value || [])
const fromWallet = computed<Wallet | undefined>(() =>
  wallets.value.find((w) => w.id === fromWalletId.value),
)
const toWallet = computed<Wallet | undefined>(() =>
  wallets.value.find((w) => w.id === toWalletId.value),
)
const isFormValid = computed<boolean>(() => {
  if (!fromWalletId.value || !toWalletId.value || !amount.value) return false
  if (fromWalletId.value === toWalletId.value) return false

  const amountBigInt = parseDecimalToBigInt(amount.value)
  if (!amountBigInt || amountBigInt <= 0n) return false

  return fromWallet.value?.balance >= amountBigInt
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
    fromWalletId.value = wallets.value[0].id
    toWalletId.value = wallets.value[1].id
  }
})
</script>

<template>
  <div class="transfer-form bg-slate-800 rounded-lg p-6 border border-slate-700">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2 text-amber-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 111.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Transferência entre Carteiras
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- From Wallet -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Carteira de Origem</label>
        <select
          v-model="fromWalletId"
          class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          :disabled="isLoading"
        >
          <option value="" disabled>Selecione uma carteira</option>
          <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
            {{ wallet.name }} ({{ formatCurrency(wallet.balance) }})
          </option>
        </select>
      </div>

      <!-- To Wallet -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Carteira de Destino</label>
        <select
          v-model="toWalletId"
          class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          :disabled="isLoading"
        >
          <option value="" disabled>Selecione uma carteira</option>
          <option
            v-for="wallet in wallets"
            :key="wallet.id"
            :value="wallet.id"
            :disabled="wallet.id === fromWalletId.value"
          >
            {{ wallet.name }}
          </option>
        </select>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Valor</label>
        <input
          v-model="amount"
          type="text"
          inputmode="decimal"
          class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="0,00"
          :disabled="isLoading"
        />
        <div v-if="fromWallet" class="mt-1 text-xs text-slate-400">
          Saldo disponível: {{ formatCurrency(fromWallet.balance) }}
        </div>
        <div v-if="error && fromWallet && amount" class="mt-1 text-xs text-red-400">
          {{ error }}
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Descrição (opcional)</label>
        <input
          v-model="description"
          type="text"
          class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Ex: Transferência tática"
          :disabled="isLoading"
        />
      </div>

      <!-- Date -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Data</label>
        <input
          v-model="date"
          type="date"
          class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          :disabled="isLoading"
        />
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading">Processando...</span>
          <span v-else>Transferir</span>
          <svg
            v-if="isLoading"
            class="ml-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Success Message -->
      <div
        v-if="success"
        class="mt-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Transferência realizada com sucesso!
      </div>
    </form>
  </div>
</template>

<style scoped>
.transfer-form {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}
.transfer-form input,
.transfer-form select,
.transfer-form textarea {
  font-family: 'JetBrains Mono', monospace;
}
</style>
