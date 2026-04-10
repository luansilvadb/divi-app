<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useTransactionStore } from '../../application/stores/transactionStore'
import { useService } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IPredictionService } from '../../domain/prediction'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: { amount: number; payee: string; categoryId: string; walletId: string }): void
}>()

const transactionStore = useTransactionStore()
const predictionService = useService<IPredictionService>(DI_TOKENS.PredictionService)

const amount = ref<number | null>(null)
const payee = ref('')
const categoryId = ref('')
const walletId = ref('')

const isUserInteracted = ref({
  category: false,
  wallet: false
})

const close = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  if (amount.value && payee.value) {
    emit('save', {
      amount: amount.value,
      payee: payee.value,
      categoryId: categoryId.value,
      walletId: walletId.value
    })
    reset()
  }
}

const reset = () => {
  amount.value = null
  payee.value = ''
  categoryId.value = ''
  walletId.value = ''
  isUserInteracted.value = { category: false, wallet: false }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSave()
  } else if (e.key === 'Escape') {
    close()
  }
}

// Predição ao digitar o Payee
watch(payee, async (newPayee) => {
  if (newPayee.length >= 3 && amount.value) {
    const prediction = await predictionService.predict(newPayee, amount.value)
    
    if (!isUserInteracted.value.category && prediction.categoryId) {
      categoryId.value = prediction.categoryId
    }
    if (!isUserInteracted.value.wallet && prediction.walletId) {
      walletId.value = prediction.walletId
    }
  }
})

// Foco automático no campo de valor ao abrir
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (transactionStore.categories.length === 0) transactionStore.fetchCategories()
    if (transactionStore.wallets.length === 0) transactionStore.fetchWallets()
    
    // Timeout para garantir que o modal renderizou
    setTimeout(() => {
      const input = document.querySelector('.quick-entry-amount input') as HTMLElement
      input?.focus()
    }, 100)
  }
})

// Expor para testes
defineExpose({ amount, payee, categoryId, walletId, handleSave, close })
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Nova Transação Rápida"
    :style="{ width: '25rem' }"
    @keydown="handleKeydown"
  >
    <div class="flex flex-col gap-4 p-2">
      <div class="flex flex-col gap-2">
        <label for="amount" class="font-semibold">Valor</label>
        <InputNumber
          v-model="amount"
          inputId="amount"
          mode="currency"
          currency="BRL"
          locale="pt-BR"
          class="quick-entry-amount w-full"
          autoFocus
          fluid
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="payee" class="font-semibold">Beneficiário (Payee)</label>
        <InputText
          v-model="payee"
          id="payee"
          class="w-full"
          placeholder="Ex: Starbucks"
          fluid
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="category" class="font-semibold">Categoria</label>
        <Select
          v-model="categoryId"
          id="category"
          :options="transactionStore.categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecione uma categoria"
          class="w-full"
          @change="isUserInteracted.category = true"
          fluid
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="wallet" class="font-semibold">Carteira</label>
        <Select
          v-model="walletId"
          id="wallet"
          :options="transactionStore.wallets"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecione uma carteira"
          class="w-full"
          @change="isUserInteracted.wallet = true"
          fluid
        />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="secondary" @click="close" />
        <Button label="Salvar (Enter)" @click="handleSave" :disabled="!amount || !payee" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Estilos específicos se necessário */
</style>
