<template>
  <div class="transaction-form-overlay" @click.self="$emit('close')">
    <BaseCard class="transaction-form">
      <template #header>
        <h2>New Transaction</h2>
      </template>

      <form @submit.prevent="handleSubmit">
        <div class="type-switch">
          <button 
            type="button" 
            :class="{ active: form.type === 'expense' }"
            @click="form.type = 'expense'"
          >Expense</button>
          <button 
            type="button" 
            :class="{ active: form.type === 'income' }"
            @click="form.type = 'income'"
          >Income</button>
        </div>

        <BaseInput
          id="title"
          label="Title"
          v-model="form.title"
          placeholder="e.g., Netflix"
          @input="handleTitleInput"
        />

        <BaseInput
          id="amount"
          label="Amount"
          type="number"
          step="0.01"
          v-model="form.amount"
        />

        <div class="form-row">
          <div class="form-group">
            <label class="divi-label">Category</label>
            <select v-model="form.category_id" class="divi-select">
              <option value="">Select Category</option>
              <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="divi-label">Wallet</label>
            <select v-model="form.wallet_id" class="divi-select">
              <option value="">Select Wallet</option>
              <option v-for="wallet in store.wallets" :key="wallet.id" :value="wallet.id">
                {{ wallet.name }}
              </option>
            </select>
          </div>
        </div>

        <BaseInput
          id="date"
          label="Date"
          type="date"
          v-model="form.date"
        />

        <div class="form-actions">
          <BaseButton variant="outline" type="button" @click="$emit('close')">Cancel</BaseButton>
          <BaseButton type="submit" :loading="isSubmitting">Save Transaction</BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
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
  date: new Date().toISOString().slice(0, 10)
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
      updated_at: new Date().toISOString()
    }
    await store.saveTransaction(transactionData as any)
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
.transaction-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.transaction-form {
  width: 100%;
  max-width: 500px;
  background: white;
}
.type-switch {
  display: flex;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}
.type-switch button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.type-switch button.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  color: #4f46e5;
}
.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.form-group {
  flex: 1;
}
.divi-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}
.divi-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: white;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
