<template>
  <div class="account-carousel">
    <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="wallet in wallets" :key="wallet.id" class="wallet-card">
        <BaseCard class="inner-card" :style="{ borderLeft: '4px solid #10b981' }">
          <div class="wallet-info">
            <span class="wallet-name">{{ wallet.name }}</span>
            <span class="wallet-balance">{{ formatCurrency(wallet.balance) }}</span>
            <span class="wallet-currency">{{ wallet.currency }}</span>
          </div>
        </BaseCard>
      </div>
    </div>
    
    <div v-if="wallets.length > 1" class="carousel-controls">
      <button @click="prev" :disabled="currentIndex === 0">&lt;</button>
      <div class="dots">
        <span 
          v-for="(_, index) in wallets" 
          :key="index" 
          :class="['dot', { active: index === currentIndex }]"
        ></span>
      </div>
      <button @click="next" :disabled="currentIndex === wallets.length - 1">&gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Wallet } from '../../domain/entities'
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'

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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>

<style scoped>
.account-carousel {
  overflow: hidden;
  position: relative;
}
.carousel-container {
  display: flex;
  transition: transform 0.3s ease;
}
.wallet-card {
  min-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
.inner-card {
  height: 120px;
  display: flex;
  align-items: center;
}
.wallet-info {
  display: flex;
  flex-direction: column;
}
.wallet-name {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.wallet-balance {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0.25rem 0;
}
.wallet-currency {
  font-size: 0.75rem;
  color: #9ca3af;
}
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.carousel-controls button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
}
.carousel-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.dots {
  display: flex;
  gap: 0.5rem;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
}
.dot.active {
  background: #10b981;
}
</style>
