import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IWalletService } from '@/modules/wallets/core/ports/IWalletService'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'

export const useWalletStore = defineStore('wallets', () => {
  const walletService = container.resolve<IWalletService>(DI_TOKENS.IWalletService)

  const wallets = shallowRef<IWallet[]>([])
  const IWalletMap = shallowRef<Record<string, IWallet>>({})

  async function fetchwallets() {
    await walletService.loadwallets()
    const w = walletService.walletsSubject.getValue()
    wallets.value = w
    const map: Record<string, IWallet> = {}
    for (let i = 0, len = w.length; i < len; i++) {
      const item = w[i]!
      map[item.id] = item
    }
    IWalletMap.value = map
  }

  async function saveIWallet(IWalletData: Partial<IWallet> & { name: string; balanceNum?: number; currency?: string }) {
    const isUpdate = !!IWalletData.id

    if (isUpdate && IWalletData.id) {
      const existing = IWalletMap.value[IWalletData.id]
      if (!existing) throw new Error('IWallet not found')

      await walletService.updateIWallet(IWalletData.id, {
        ...IWalletData,
        balance: IWalletData.balanceNum !== undefined
          ? BigInt(Math.round(IWalletData.balanceNum * 100))
          : existing.balance,
        currency: IWalletData.currency || existing.currency,
      })
    } else {
      await walletService.createIWallet({
        name: IWalletData.name,
        type: IWalletData.type || 'checking',
        currency: IWalletData.currency || 'BRL',
        icon: IWalletData.icon || 'IWallet',
        balance: IWalletData.balanceNum || 0,
      })
    }
    await fetchwallets()
  }

  return {
    wallets,
    IWalletMap,
    fetchwallets,
    saveIWallet,
  }
})
