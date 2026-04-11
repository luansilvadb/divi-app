<template>
  <div class="account-carousel">
    <!-- Exibe o Carrossel do PrimeVue apenas se tivermos contas na lista -->
    <Carousel
      v-if="wallets && wallets.length > 0"
      :value="wallets"
      :numVisible="1"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      class="rounded-[1.25rem] overflow-hidden"
    >
      <template #item="slotProps">
        <div class="wallet-slide min-w-full p-1">
          <BaseCard
            class="wallet-card-premium !p-0 h-[140px] flex overflow-hidden bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-200/10 shadow-2xl transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            clickable
          >
            <div
              class="wallet-accent w-1.5 h-full"
              :style="{ background: getWalletColor(slotProps.data) }"
            ></div>
            <div class="wallet-body flex-1 p-6 flex flex-col justify-center">
              <div class="wallet-meta flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div
                    v-if="slotProps.data.icon"
                    class="w-5 h-5 flex items-center justify-center opacity-80"
                  >
                    <img
                      :src="getWalletIcon(slotProps.data)"
                      class="w-full h-full object-contain"
                      @error="handleImageError"
                    />
                  </div>
                  <span
                    class="wallet-name text-xs font-bold text-surface-600 dark:text-surface-200 uppercase tracking-widest"
                    >{{ slotProps.data.name }}</span
                  >
                </div>
                <span
                  class="wallet-label text-[0.7rem] font-bold text-surface-400 dark:text-surface-400 uppercase opacity-80"
                  >{{ slotProps.data.currency }}</span
                >
              </div>
              <div class="wallet-main">
                <h3
                  class="wallet-balance text-4xl font-extrabold text-surface-800 dark:text-surface-50 tracking-tighter"
                >
                  {{ formatCurrency(slotProps.data.balance) }}
                </h3>
              </div>
            </div>
          </BaseCard>
        </div>
      </template>
    </Carousel>

    <!-- Nosso próprio design para quando não houver contas e remover aquela mensagem padrão -->
    <BaseCard
      v-else
      class="!p-0 h-[140px] flex flex-col items-center justify-center overflow-hidden bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-200/10 shadow-2xl mx-1 my-1 text-center"
    >
      <span class="text-2xl mb-3 opacity-50">🏦</span>
      <p
        class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface-600 dark:text-surface-200 opacity-60"
      >
        Nenhuma conta cadastrada
      </p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Carousel from 'primevue/carousel'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import type { Wallet } from '../../domain/entities/Wallet'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)

defineProps<{
  wallets: Wallet[]
}>()

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1,
  },
])

function getWalletIcon(wallet: Wallet) {
  return assetLoader.sanitize(wallet.icon)
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('wallet')
}

function getWalletColor(wallet: Wallet) {
  const colors = [
    'var(--color-primary-main)',
    'var(--color-secondary-main)',
    'var(--color-accent-main)',
    'var(--color-info-main)',
  ]
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
