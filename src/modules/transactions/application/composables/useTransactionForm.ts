import { ref, reactive, computed, watch, onMounted } from 'vue'
import { v7 as uuidv7 } from 'uuid'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useService } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { messages } from '@/shared/messages/catalog'
import { useITransactionValidation } from '@/modules/transactions/application/composables/useITransactionValidation'
import type { IAutoCategorizationService } from '@/modules/transactions/core/ports/IAutoCategorizationService'
import type { IAutoCreateService } from '@/modules/transactions/core/ports/IAutoCreateService'
import type { MessageApiInjection } from 'naive-ui/lib/message/src/types'

interface ITransactionForm {
  title: string
  amount: number | null
  type: 'income' | 'expense' | 'transfer'
  category_id: string | null
  wallet_id: string | null
  date: string
}

export function useTransactionForm(
  props: { initialData?: ITransaction | null },
  emit: (event: 'saved' | 'close', ...args: any[]) => void,
  message: MessageApiInjection
) {
  const store = useTransactionStore()
  const autoCatService = useService<IAutoCategorizationService>(DI_TOKENS.IAutoCategorizationService)
  const autoCreateService = useService<IAutoCreateService>(DI_TOKENS.IAutoCreateService)
  const { rules, validateForm } = useITransactionValidation()

  const isSubmitting = ref(false)
  const showConfirmDelete = ref(false)

  const form = reactive<ITransactionForm>({
    title: '',
    amount: null,
    type: 'expense',
    category_id: null,
    wallet_id: null,
    date: new Date().toISOString().slice(0, 10),
  })

  const categoryOptions = computed(() =>
    store.categories.map(cat => ({ label: cat.name, value: cat.id }))
  )

  const IWalletOptions = computed(() =>
    store.wallets.map(w => ({ label: w.name, value: w.id }))
  )

  const currencyConfigs: Record<string, { locale: string; symbol: string }> = {
    BRL: { locale: 'pt-BR', symbol: 'R$' },
    USD: { locale: 'en-US', symbol: '$' },
    EUR: { locale: 'de-DE', symbol: '€' },
  }

  const activeIWallet = computed(() => {
    return store.wallets.find(w => w.id === form.wallet_id)
  })

  const activeConfig = computed(() => {
    const currency = activeIWallet.value?.currency || 'BRL'
    return currencyConfigs[currency] || currencyConfigs['BRL']
  })

  const displayAmount = computed(() => {
    if (form.amount === null) return ''
    return new Intl.NumberFormat(activeConfig.value?.locale || 'pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(form.amount)
  })

  function handleInputAmount(val: string) {
    const digits = val.replace(/\D/g, '')
    if (!digits) {
      form.amount = null
      return
    }
    form.amount = Number(digits) / 100
  }

  const timestampDate = computed({
    get: () => new Date(form.date + 'T12:00:00').getTime(),
    set: (val: number) => {
      form.date = new Date(val).toISOString().slice(0, 10)
    }
  })

  watch(
    () => props.initialData,
    (newData) => {
      if (newData) {
        form.title = newData.title
        form.amount = typeof newData.amount === 'bigint' ? Number(newData.amount) / 100 : newData.amount
        form.type = newData.type
        form.category_id = newData.category_id
        form.wallet_id = newData.wallet_id
        form.date = new Date(newData.date).toISOString().slice(0, 10)
      }
    },
    { immediate: true },
  )

  onMounted(async () => {
    if (store.wallets.length === 0) await store.fetchwallets()
    if (store.categories.length === 0) await store.fetchCategories()
  })

  function handleTitleInput() {
    const suggestion = autoCatService.suggestCategory(form.title, store.categories)
    if (suggestion) {
      form.category_id = suggestion.id
    }
  }

  async function buildITransactionData(): Promise<ITransaction> {
    const finalCategoryId = await autoCreateService.resolveCategory(form.category_id, store.categories)
    const finalIWalletId = await autoCreateService.resolveIWallet(form.wallet_id, store.wallets)

    return {
      ...props.initialData,
      ...form,
      category_id: finalCategoryId,
      wallet_id: finalIWalletId,
      amount: BigInt(Math.round((form.amount || 0) * 100)),
      id: props.initialData?.id || uuidv7(),
      user_id: props.initialData?.user_id || '',
      sync_status: 'pending' as const,
      deleted: props.initialData?.deleted || false,
      client_updated_at: new Date().toISOString(),
      version: (props.initialData?.version || 0) + 1,
    } as ITransaction
  }

  async function handleSubmit(formRef: any) {
    const { valid: isValid } = validateForm(form)
    if (!isValid) {
      formRef.value?.validate((errors: any) => { if (errors) return })
      return
    }

    isSubmitting.value = true
    try {
      const ITransactionData = await buildITransactionData()
      await store.saveITransaction(ITransactionData)
      emit('saved')
      emit('close')
      message.success(props.initialData ? messages.MSG_S_TRANSACTION_UPDATED : messages.MSG_S_TRANSACTION_CREATED)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar transação.'
      message.error(msg)
    } finally {
      isSubmitting.value = false
    }
  }

  const handleDelete = () => {
    showConfirmDelete.value = true
  }

  const confirmDelete = async () => {
    if (!props.initialData?.id) return
    showConfirmDelete.value = false
    isSubmitting.value = true
    try {
      await store.deleteITransaction(props.initialData.id)
      message.success(messages.MSG_S_TRANSACTION_DELETED)
      emit('saved')
      emit('close')
    } catch {
      message.error(messages.MSG_E_GENERIC)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    rules,
    isSubmitting,
    showConfirmDelete,
    categoryOptions,
    IWalletOptions,
    activeConfig,
    displayAmount,
    timestampDate,
    handleInputAmount,
    handleTitleInput,
    handleSubmit,
    handleDelete,
    confirmDelete
  }
}
