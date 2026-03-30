<template>
  <div class="account-carousel">
    <div class="carousel-track-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="wallet in wallets" :key="wallet.id" class="wallet-slide">
          <div class="wallet-card-premium glass-card hover-glow">
            <div class="wallet-accent" :style="{ background: getWalletColor(wallet) }"></div>
            <div class="wallet-body">
              <div class="wallet-meta">
                <span class="wallet-name">{{ wallet.name }}</span>
                <span class="wallet-label">{{ wallet.currency }}</span>
              </div>
              <div class="wallet-main">
                <h3 class="wallet-balance">{{ formatCurrency(wallet.balance) }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="wallets.length > 1" class="carousel-nav">
      <button class="nav-btn prev" @click="prev" :disabled="currentIndex === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="carousel-dots">
        <span 
          v-for="(_, index) in wallets" 
          :key="index" 
          :class="['carousel-dot', { active: index === currentIndex }]"
        ></span>
      </div>
      <button class="nav-btn next" @click="next" :disabled="currentIndex === wallets.length - 1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6 6-6"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Wallet } from '../../domain/entities'

const props = defineProps<{
  wallets: Wallet[]
}>()

const currentIndex = ref(0)

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
  // Simple deterministic color based on name if no color property exists
  const colors = ['var(--color-primary-main)', 'var(--color-secondary-main)', 'var(--color-accent-main)', 'var(--color-info-main)']
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

<style scoped>
.account-carousel {
  position: relative;
  width: 100%;
}

.carousel-track-container {
  overflow: hidden;
  border-radius: 1.25rem;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.wallet-slide {
  min-width: 100%;
  padding: 0.25rem;
}

.wallet-card-premium {
  height: 140px;
  position: relative;
  border-radius: 1.25rem;
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
}

.wallet-accent {
  width: 6px;
  height: 100%;
}

.wallet-body {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wallet-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.wallet-name {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.wallet-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-disabled);
  opacity: 0.8;
}

.wallet-balance {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.25rem;
}

.nav-btn {
  background: var(--color-surface-main);
  border: 1px solid var(--color-border-main);
  color: var(--color-text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-primary-main);
  color: white;
  border-color: var(--color-primary-main);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border-main);
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: var(--color-primary-main);
  width: 20px;
  border-radius: 4px;
}

/* Glass effect redundancy to ensure styles work if BaseCard isn't enough */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}
</style>
