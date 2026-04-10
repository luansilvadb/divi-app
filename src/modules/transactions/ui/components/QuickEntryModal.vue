<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: { amount: number; payee: string; categoryId: string; walletId: string }): void
}>()

const amount = ref<number | null>(null)
const payee = ref('')
const categoryId = ref('')
const walletId = ref('')

const amountInput = ref<any>(null)

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
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSave()
  } else if (e.key === 'Escape') {
    close()
  }
}

// Foco automático no campo de valor ao abrir
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Timeout para garantir que o modal renderizou
    setTimeout(() => {
      const input = document.querySelector('.quick-entry-amount input') as HTMLElement
      input?.focus()
    }, 100)
  }
})

// Expor para testes
defineExpose({ amount, payee, categoryId, walletId })
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
        <label for="amount">Valor</label>
        <InputNumber
          v-model="amount"
          inputId="amount"
          mode="currency"
          currency="BRL"
          locale="pt-BR"
          class="quick-entry-amount w-full"
          autoFocus
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="payee">Beneficiário (Payee)</label>
        <InputText
          v-model="payee"
          id="payee"
          class="w-full"
          placeholder="Ex: Starbucks"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="category">Categoria</label>
        <Select
          v-model="categoryId"
          id="category"
          :options="[]" 
          placeholder="Selecione uma categoria"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="wallet">Carteira</label>
        <Select
          v-model="walletId"
          id="wallet"
          :options="[]"
          placeholder="Selecione uma carteira"
          class="w-full"
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
