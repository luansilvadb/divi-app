import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ISubscriptionRepository } from '@/shared/domain/contracts/ISubscriptionRepository'
import type { Subscription } from '@/shared/domain/entities/Subscription'

export const useSubscriptionStore = defineStore('subscriptions', () => {
  const subscriptionRepo = container.resolve<ISubscriptionRepository>(
    DI_TOKENS.SubscriptionRepository,
  )

  const subscriptions = ref<Subscription[]>([])
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

  const saveSubscription = async (subscription: Subscription) => {
    await subscriptionRepo.save(subscription)
    await fetchSubscriptions()
  }

  const deleteSubscription = async (id: string) => {
    await subscriptionRepo.delete(id)
    await fetchSubscriptions()
  }

  const totalMonthlyCost = computed(() =>
    subscriptions.value
      .filter((s) => s.frequency === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0),
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

