<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { NModal, NInput, NInputNumber, NSelect, NButton, useMessage } from 'naive-ui'
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
const message = useMessage()

const amount = ref<number | null>(null)
const payee = ref('')
const categoryId = ref('')
const walletId = ref('')

const isUserInteracted = ref({
  category: false,
  wallet: false,
})

const close = () => {
  emit('update:visible', false)
}

const handleSave = async () => {
  if (amount.value && payee.value) {
    try {
      await transactionStore.saveTransaction({
        id: crypto.randomUUID(),
        user_id: '',
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
        created_at: new Date().toISOString(),
      })

      const syncEngine = useService<{ enqueueSync(): void }>(DI_TOKENS.SyncEngine)
      syncEngine.enqueueSync()

      message.success(`Lançamento de R$ ${amount.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} salvo!`)

      emit('save', {
        amount: amount.value,
        payee: payee.value,
        categoryId: categoryId.value,
        walletId: walletId.value,
      })
      reset()
      close()
    } catch (err) {
      console.error('Erro ao salvar via Quick Entry:', err)
      message.error('Não foi possível salvar a transação localmente.')
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
  if (e.key === 'Enter' && !e.shiftKey) {
    handleSave()
  } else if (e.key === 'Escape') {
    close()
  }
}

watch(payee, async (newPayee) => {
  if (newPayee.length >= 3 && amount.value) {
    const prediction = await predictionService.predict(newPayee, amount.value)
    if (!isUserInteracted.value.category && prediction.categoryId) categoryId.value = prediction.categoryId
    if (!isUserInteracted.value.wallet && prediction.walletId) walletId.value = prediction.walletId
  }
})

onMounted(() => {
  if (transactionStore.categories.length === 0) transactionStore.fetchCategories()
  if (transactionStore.wallets.length === 0) transactionStore.fetchWallets()
})

defineExpose({ amount, payee, categoryId, walletId, handleSave, close, isUserInteracted })
</script>

<template>
  <NModal
    :show="visible"
    @update:show="emit('update:visible', $event)"
    preset="card"
    class="!max-w-[400px] !rounded-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
    title="Lançamento Rápido"
    @keydown="handleKeydown"
  >
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Valor (R$)</label>
        <NInputNumber
          v-model:value="amount"
          placeholder="0,00"
          :min="0"
          :precision="2"
          size="large"
          class="!rounded-xl"
          autofocus
        >
          <template #prefix><i class="i-lucide-banknote text-zinc-400"></i></template>
        </NInputNumber>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Beneficiário</label>
        <NInput
          v-model:value="payee"
          placeholder="Ex: Starbucks, Amazon..."
          size="large"
          class="!rounded-xl"
        >
          <template #prefix><i class="i-lucide-shopping-cart text-zinc-400"></i></template>
        </NInput>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Categoria</label>
        <NSelect
          v-model:value="categoryId"
          :options="transactionStore.categories.map(c => ({ label: c.name, value: c.id }))"
          placeholder="Selecione categoria"
          size="large"
          class="!rounded-xl"
          @update:value="isUserInteracted.category = true"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Conta / Carteira</label>
        <NSelect
          v-model:value="walletId"
          :options="transactionStore.wallets.map(w => ({ label: w.name, value: w.id }))"
          placeholder="Selecione conta"
          size="large"
          class="!rounded-xl"
          @update:value="isUserInteracted.wallet = true"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-50">
          ESC para cancelar
        </span>
        <div class="flex gap-3">
          <NButton quaternary circle @click="close" class="!px-4">Cancelar</NButton>
          <NButton
            type="primary"
            class="!rounded-xl !px-6 font-bold shadow-lg shadow-violet-500/20"
            @click="handleSave"
            :disabled="!amount || !payee"
          >
            Salvar
          </NButton>
        </div>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
:deep(.n-input), :deep(.n-input-number), :deep(.n-base-selection) {
  --n-border-radius: 12px !important;
  background-color: rgba(var(--color-zinc-500-rgb), 0.05) !important;
}
:is(.dark) :deep(.n-input), :is(.dark) :deep(.n-input-number), :is(.dark) :deep(.n-base-selection) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
