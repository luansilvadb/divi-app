<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useToast } from 'primevue/usetoast'
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
const toast = useToast()

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

const handleSave = async () => {
  if (amount.value && payee.value) {
    try {
      await transactionStore.saveTransaction({
        id: crypto.randomUUID(),
        amount: amount.value,
        title: payee.value,
        payee_id: payee.value,
        category_id: categoryId.value || 'geral',
        wallet_id: walletId.value || 'default',
        type: 'expense',
        date: new Date().toISOString().slice(0, 10),
        sync_status: 'pending',
        deleted: false,
        client_updated_at: new Date().toISOString(),
        version: 1,
        created_at: new Date().toISOString()
      })

      // Disparar sincronização
      const syncEngine = useService<{ enqueueSync(): void }>(DI_TOKENS.SyncEngine)
      syncEngine.enqueueSync()

      toast.add({
        severity: 'success',
        summary: 'Transação Salva',
        detail: `R$ ${amount.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} - ${payee.value}`,
        life: 3000
      })

      emit('save', {
        amount: amount.value,
        payee: payee.value,
        categoryId: categoryId.value,
        walletId: walletId.value
      })
      reset()
      close()
    } catch (err) {
      console.error('Erro ao salvar via Quick Entry:', err)
      toast.add({
        severity: 'error',
        summary: 'Erro ao Salvar',
        detail: 'Não foi possível salvar a transação localmente.',
        life: 5000
      })
    }
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
defineExpose({ amount, payee, categoryId, walletId, handleSave, close, isUserInteracted })
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Nova Transação Rápida"
    :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @keydown="handleKeydown"
  >
    <div class="flex flex-col gap-4 mt-2">
      <!-- Valor -->
      <div class="flex flex-col gap-2">
        <label for="amount" class="text-sm font-semibold">Valor</label>
        <IconField>
          <InputIcon class="pi pi-dollar" />
          <InputNumber
            v-model="amount"
            inputId="amount"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="pt-BR"
            placeholder="0,00"
            class="quick-entry-amount"
            fluid
            autoFocus
          />
        </IconField>
      </div>

      <!-- Beneficiário -->
      <div class="flex flex-col gap-2">
        <label for="payee" class="text-sm font-semibold">Beneficiário (Payee)</label>
        <IconField>
          <InputIcon class="pi pi-shop" />
          <InputText
            v-model="payee"
            id="payee"
            placeholder="Ex: Starbucks"
            fluid
          />
        </IconField>
      </div>

      <!-- Categoria -->
      <div class="flex flex-col gap-2">
        <label for="category" class="text-sm font-semibold">Categoria</label>
        <Select
          v-model="categoryId"
          id="category"
          :options="transactionStore.categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecione uma categoria"
          @change="isUserInteracted.category = true"
          fluid
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <i class="pi pi-tags opacity-70"></i>
              <span>{{ transactionStore.categories.find(c => c.id === slotProps.value)?.name }}</span>
            </div>
            <span v-else class="opacity-60 flex items-center gap-2">
              <i class="pi pi-tags"></i>
              Selecione uma categoria
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Carteira -->
      <div class="flex flex-col gap-2">
        <label for="wallet" class="text-sm font-semibold">Carteira</label>
        <Select
          v-model="walletId"
          id="wallet"
          :options="transactionStore.wallets"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecione uma carteira"
          @change="isUserInteracted.wallet = true"
          fluid
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <i class="pi pi-wallet opacity-70"></i>
              <span>{{ transactionStore.wallets.find(w => w.id === slotProps.value)?.name }}</span>
            </div>
            <span v-else class="opacity-60 flex items-center gap-2">
              <i class="pi pi-wallet"></i>
              Selecione uma carteira
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Select>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full mt-4">
        <span class="text-xs opacity-50 flex items-center gap-1">
          <kbd class="px-1 border rounded opacity-70 font-sans">Esc</kbd> cancelar
        </span>
        <div class="flex gap-2">
          <Button label="Cancelar" severity="secondary" text @click="close" />
          <Button label="Salvar" icon="pi pi-check" @click="handleSave" :disabled="!amount || !payee" />
        </div>
      </div>
    </template>
  </Dialog>
</template>


