<template>
  <div class="account-carousel">
    <NCarousel
      v-if="wallets && wallets.length > 0"
      dot-placement="bottom"
      show-arrow
      trigger="hover"
      class="!rounded-3xl overflow-hidden"
    >
      <div v-for="wallet in wallets" :key="wallet.id" class="px-1">
        <BaseCard
          class="!p-0 h-[140px] flex overflow-hidden !bg-white/50 dark:!bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all duration-300 hover:border-violet-500/30"
          clickable
        >
          <div
            class="w-1.5 h-full"
            :style="{ background: getWalletColor(wallet) }"
          ></div>
          <div class="flex-1 p-6 flex flex-col justify-center">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-3">
                <div
                  v-if="wallet.icon"
                  class="w-6 h-6 flex items-center justify-center opacity-80"
                >
                  <img
                    :src="getWalletIcon(wallet)"
                    class="w-full h-full object-contain"
                    @error="handleImageError"
                  />
                </div>
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {{ wallet.name }}
                </span>
              </div>
              <span class="text-[10px] font-bold text-zinc-500 uppercase opacity-60">
                {{ wallet.currency }}
              </span>
            </div>
            <div>
              <h3 class="text-4xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter">
                {{ formatCurrency(wallet.balance) }}
              </h3>
            </div>
          </div>
        </BaseCard>
      </div>
    </NCarousel>

    <BaseCard
      v-else
      class="!p-0 h-[140px] flex flex-col items-center justify-center overflow-hidden !bg-white/50 dark:!bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl mx-1 my-1 text-center"
    >
      <i class="i-lucide-landmark text-3xl mb-3 text-zinc-400 opacity-50"></i>
      <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Nenhuma conta cadastrada
      </p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { NCarousel } from 'naive-ui'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import type { Wallet } from '../../domain/entities/Wallet'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)

defineProps<{
  wallets: Wallet[]
}>()

function getWalletIcon(wallet: Wallet) {
  return assetLoader.sanitize(wallet.icon)
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('wallet')
}

function getWalletColor(wallet: Wallet) {
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  let hash = 0
  for (let i = 0; i < wallet.name.length; i++) {
    hash = wallet.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>
