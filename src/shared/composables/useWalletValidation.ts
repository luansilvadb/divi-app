import { reactive, ref } from 'vue'
import type { FormRules } from 'naive-ui'

export function useWalletValidation(initialData?: { name: string; balance: number | null; currency: string }) {
  const form = reactive({
    name: initialData?.name ?? '',
    balance: initialData?.balance ?? null as number | null,
    currency: initialData?.currency ?? 'BRL',
  })

  const rules: FormRules = {
    name: { 
      required: true, 
      message: 'Nome da conta é obrigatório', 
      trigger: 'blur' 
    },
    balance: { 
      required: true, 
      type: 'number', 
      message: 'Saldo inicial é obrigatório', 
      trigger: 'blur' 
    },
  }

  const isSubmitting = ref(false)

  const resetForm = () => {
    form.name = ''
    form.balance = null
    form.currency = 'BRL'
  }

  const setForm = (data: { name: string; balance: number | null; currency: string }) => {
    form.name = data.name
    form.balance = data.balance
    form.currency = data.currency
  }

  return {
    form,
    rules,
    isSubmitting,
    resetForm,
    setForm,
  }
}
