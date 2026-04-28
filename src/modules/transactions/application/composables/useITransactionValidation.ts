import type { FormRules } from 'naive-ui'

export interface ITransactionForm {
  title: string
  amount: number | null
  type: 'income' | 'expense' | 'transfer'
  category_id: string | null
  wallet_id: string | null
  date: string
}

export function useITransactionValidation() {
  const rules: FormRules = {
    title: { required: true, message: 'Título é obrigatório', trigger: 'blur' },
    amount: { required: true, type: 'number', min: 0.01, message: 'Valor deve ser maior que zero', trigger: 'blur' },
    category_id: { required: true, message: 'Selecione uma categoria', trigger: 'change' },
    wallet_id: { required: true, message: 'Selecione uma conta', trigger: 'change' }
  }

  function validateForm(form: ITransactionForm): { valid: boolean; errors?: string[] } {
    const errors: string[] = []

    if (!form.title?.trim()) {
      errors.push('Título é obrigatório')
    }

    if (form.amount === null || form.amount <= 0) {
      errors.push('Valor deve ser maior que zero')
    }

    if (!form.category_id) {
      errors.push('Selecione uma categoria')
    }

    if (!form.wallet_id) {
      errors.push('Selecione uma conta')
    }

    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
  }

  return {
    rules,
    validateForm,
  }
}
