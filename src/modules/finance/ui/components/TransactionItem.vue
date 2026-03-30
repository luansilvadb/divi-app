<template>
  <div class="transaction-item glass-item hover-glow group" @click="$emit('click')">
    <div class="item-left flex items-center gap-4 flex-1 min-w-0">
      <div class="t-icon-container" :class="transaction.type">
        <div class="icon-blur" :style="{ backgroundColor: iconColor + '40' }"></div>
        <div class="icon-wrapper" :style="{ color: iconColor }">
          <component :is="iconComponent" />
        </div>
      </div>

      <div class="t-main min-w-0">
        <div class="t-title-row">
          <span class="t-title">{{ transaction.title }}</span>
          <span class="t-wallet" v-if="walletName">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            {{ walletName }}
          </span>
        </div>
        <div class="t-details-row mt-0.5">
          <div 
            class="category-tag"
            :style="{ 
              '--cat-color': categoryColor,
              backgroundColor: categoryColor + '10',
              color: categoryColor
            }"
          >
            <div class="cat-dot" :style="{ backgroundColor: categoryColor }"></div>
            {{ categoryName }}
          </div>
        </div>
      </div>
    </div>

    <div class="t-meta flex flex-col items-end gap-1 px-2">
      <span class="t-amount" :class="transaction.type">
        {{ transaction.type === 'expense' ? '-' : '+' }} {{ formatCurrency(transaction.amount) }}
      </span>
      <span class="t-time" v-if="showTime">
        {{ formatTime(transaction.date) }}
      </span>
    </div>

    <div class="item-actions pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
      <button class="action-btn delete" title="Excluir" @click.stop="$emit('delete', transaction.id)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h } from 'vue'
import type { Transaction } from '@/modules/finance/domain/entities'

const props = defineProps<{
  transaction: Transaction
  categoryName: string
  categoryColor: string
  walletName?: string
  showTime?: boolean
}>()

defineEmits(['click', 'delete'])

const iconColor = computed(() => {
  return props.transaction.type === 'income' ? 'var(--color-success-main, #10b981)' : 'var(--color-error-main, #ef4444)'
})

const iconComponent = computed(() => {
  return props.transaction.type === 'income' 
    ? defineAsyncComponent(() => Promise.resolve({
        render: () => {
          return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
            h('path', { d: 'M12 19V5M5 12l7-7 7 7' })
          ])
        }
      }))
    : defineAsyncComponent(() => Promise.resolve({
        render: () => {
          return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
            h('path', { d: 'M12 5v14M5 12l7 7 7-7' })
          ])
        }
      }))
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

:is(.dark) .transaction-item {
  border-bottom-color: rgba(255, 255, 255, 0.03);
}

.transaction-item:last-child {
  border-bottom: none;
}

.glass-item:hover {
  background: rgba(var(--color-primary-main-rgb), 0.03);
}

:is(.dark) .glass-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.hover-glow:hover {
  z-index: 2;
  transform: translateX(4px);
}

.t-icon-container {
  width: 42px;
  height: 42px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-blur {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  filter: blur(8px);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.transaction-item:hover .icon-blur {
  opacity: 0.5;
  filter: blur(12px);
}

.icon-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

:is(.dark) .icon-wrapper {
  background: rgba(30, 41, 59, 0.8);
}

.t-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.t-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.t-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.t-wallet {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background: rgba(0, 0, 0, 0.04);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
  flex-shrink: 0;
  opacity: 0.8;
}

:is(.dark) .t-wallet {
  background: rgba(255, 255, 255, 0.06);
}

.category-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.cat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.t-meta {
  min-width: 90px;
}

.t-amount {
  font-weight: 800;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
}

.t-amount.income { color: var(--color-success-main); }
.t-amount.expense { color: var(--color-text-primary); }

.t-time {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-disabled);
  opacity: 0.6;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error-main);
  transform: scale(1.1);
}
</style>
