<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <BaseCard class="w-full max-w-lg shadow-2xl">
      <template #header>
        <h2 class="text-xl font-bold text-text-primary">New Transaction</h2>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex p-1 bg-bg-main rounded-lg gap-1">
          <button
            type="button"
            class="flex-1 py-2 px-4 rounded-md font-semibold transition-all"
            :class="
              form.type === 'expense'
                ? 'bg-error-main text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface-main'
            "
            @click="form.type = 'expense'"
          >
            Expense
          </button>
          <button
            type="button"
            class="flex-1 py-2 px-4 rounded-md font-semibold transition-all"
            :class="
              form.type === 'income'
                ? 'bg-success-main text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface-main'
            "
            @click="form.type = 'income'"
          >
            Income
          </button>
        </div>

        <BaseInput
          id="title"
          label="Title"
          v-model="form.title"
          placeholder="e.g., Netflix"
          @input="handleTitleInput"
        />

        <BaseInput id="amount" label="Amount" type="number" step="0.01" v-model="form.amount" />

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-text-primary">Category</label>
            <select
              v-model="form.category_id"
              class="w-full px-3 py-2 rounded-md border bg-surface-main border-border-main text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main transition-all"
            >
              <option value="">Select Category</option>
              <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-text-primary">Wallet</label>
            <select
              v-model="form.wallet_id"
              class="w-full px-3 py-2 rounded-md border bg-surface-main border-border-main text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main transition-all"
            >
              <option value="">Select Wallet</option>
              <option v-for="wallet in store.wallets" :key="wallet.id" :value="wallet.id">
                {{ wallet.name }}
              </option>
            </select>
          </div>
        </div>

        <BaseInput id="date" label="Date" type="date" v-model="form.date" />

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton variant="outline" type="button" @click="$emit('close')">Cancel</BaseButton>
          <BaseButton
            type="submit"
            :loading="isSubmitting"
            :variant="form.type === 'expense' ? 'danger' : 'secondary'"
          >
            Save Transaction
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from "../../domain/entities";
import { ref, reactive, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { AutoCategorizationService } from '../../application/services/AutoCategorizationService'
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'
import BaseInput from '../../../../shared/components/atoms/BaseInput.vue'
import BaseButton from '../../../../shared/components/atoms/BaseButton.vue'

const emit = defineEmits(['close', 'saved'])
const store = useFinanceStore()
const autoCatService = new AutoCategorizationService()

const isSubmitting = ref(false)

interface TransactionForm {
  title: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  wallet_id: string
  date: string
}

const form = reactive<TransactionForm>({
  title: '',
  amount: 0,
  type: 'expense' as 'income' | 'expense',
  category_id: '',
  wallet_id: '',
  date: new Date().toISOString().slice(0, 10),
})

onMounted(async () => {
  if (store.wallets.length === 0) await store.fetchWallets()
  if (store.categories.length === 0) await store.fetchCategories()
})

function handleTitleInput() {
  const suggestion = autoCatService.suggestCategory(form.title, store.categories)
  if (suggestion) {
    form.category_id = suggestion.id
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    const transactionData = {
      ...form,
      id: crypto.randomUUID(),
      user_id: '', // Will be filled by repo/service
      synced: false,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await store.saveTransaction(transactionData as unknown as Transaction)
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Scoped styles removed in favor of Tailwind classes */
</style>
