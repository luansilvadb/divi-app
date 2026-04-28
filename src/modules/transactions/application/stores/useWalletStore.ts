import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { WalletService } from '@/modules/wallets/application/services/WalletService'
import type { Wallet } from '@/shared/domain/entities/Wallet'

export const useWalletStore = defineStore('wallets', () => {
  const walletService = container.resolve<WalletService>(DI_TOKENS.WalletService)

  const wallets = shallowRef<Wallet[]>([])
  const walletMap = shallowRef<Record<string, Wallet>>({})

  async function fetchWallets() {
    await walletService.loadWallets()
    const w = walletService.walletsSubject.getValue()
    wallets.value = w
    const map: Record<string, Wallet> = {}
    for (let i = 0, len = w.length; i < len; i++) {
      const item = w[i]!
      map[item.id] = item
    }
    walletMap.value = map
  }

  return {
    wallets,
    walletMap,
    fetchWallets,
  }
})
