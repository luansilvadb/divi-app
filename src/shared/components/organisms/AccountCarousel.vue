<template>
  <div class="account-carousel">
    <div class="carousel-track-container rounded-[1.25rem] overflow-hidden">
      <div
        class="carousel-track flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div v-for="wallet in wallets" :key="wallet.id" class="wallet-slide min-w-full p-1">
          <BaseCard
            class="wallet-card-premium !p-0 h-[140px] flex overflow-hidden bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            clickable
          >
            <div
              class="wallet-accent w-1.5 h-full"
              :style="{ background: getWalletColor(wallet) }"
            ></div>
            <div class="wallet-body flex-1 p-6 flex flex-col justify-center">
              <div class="wallet-meta flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div
                    v-if="wallet.icon"
                    class="w-5 h-5 flex items-center justify-center opacity-80"
                  >
                    <img
                      :src="getWalletIcon(wallet)"
                      class="w-full h-full object-contain"
                      @error="handleImageError"
                    />
                  </div>
                  <span
                    class="wallet-name text-xs font-bold text-text-secondary uppercase tracking-widest"
                    >{{ wallet.name }}</span
                  >
                </div>
                <span
                  class="wallet-label text-[0.7rem] font-bold text-text-disabled uppercase opacity-80"
                  >{{ wallet.currency }}</span
                >
              </div>
              <div class="wallet-main">
                <h3
                  class="wallet-balance text-4xl font-extrabold text-text-primary tracking-tighter"
                >
                  {{ formatCurrency(wallet.balance) }}
                </h3>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <div v-if="wallets.length > 1" class="carousel-nav flex items-center justify-center gap-6 mt-5">
      <button
        class="nav-btn next bg-surface-main border border-black/5 dark:border-white/5 text-text-secondary w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        @click="prev"
        :disabled="currentIndex === 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="carousel-dots flex gap-2">
        <span
          v-for="(_, index) in wallets"
          :key="index"
          :class="[
            'carousel-dot w-2 h-2 rounded-full bg-border-main transition-all duration-300',
            { 'active !bg-primary-main !w-5 !rounded-lg': index === currentIndex },
          ]"
        ></span>
      </div>
      <button
        class="nav-btn next bg-surface-main border border-white/5 text-text-secondary w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[#1b2234] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        @click="next"
        :disabled="currentIndex === wallets.length - 1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18l6-6 6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import type { Wallet } from '../../domain/entities/Wallet'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)

const props = defineProps<{
  wallets: Wallet[]
}>()

const currentIndex = ref(0)

function getWalletIcon(wallet: Wallet) {
  return assetLoader.sanitize(wallet.icon)
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('wallet')
}

function next() {
  if (currentIndex.value < props.wallets.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
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
