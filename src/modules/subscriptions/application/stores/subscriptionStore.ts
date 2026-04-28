import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ISubscriptionRepository } from '../../core/ports/ISubscriptionRepository'
import type { ISubscription } from '@/modules/subscriptions/core/entities/ISubscription'

export const useSubscriptionStore = defineStore('subscriptions', () => {
  const subscriptionRepo = container.resolve<ISubscriptionRepository>(
    DI_TOKENS.ISubscriptionRepository,
  )

  const subscriptions = ref<ISubscription[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')

  const fetchSubscriptions = async () => {
    isLoading.value = true
    try {
      subscriptions.value = await subscriptionRepo.getAll()
    } finally {
      isLoading.value = false
    }
  }

  const saveSubscription = async (subscription: ISubscription) => {
    await subscriptionRepo.save(subscription)
    await fetchSubscriptions()
  }

  const deleteSubscription = async (id: string) => {
    await subscriptionRepo.delete(id)
    await fetchSubscriptions()
  }

  const totalMonthlyCost = computed(() =>
    Number(subscriptions.value
      .filter((s) => s.frequency === 'monthly')
      .reduce((sum, s) => sum + BigInt(s.amount), 0n))
  )

  return {
    subscriptions,
    isLoading,
    searchQuery,
    fetchSubscriptions,
    saveSubscription,
    deleteSubscription,
    totalMonthlyCost,
  }
})
