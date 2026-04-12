<template>
  <div class="account-grid">
    <NGrid
      v-if="wallets && wallets.length > 0"
      :x-gap="14"
      :y-gap="14"
      :cols="isMobile ? 1 : 4"
      responsive="screen"
    >
      <NGridItem v-for="wallet in wallets" :key="wallet.id">
        <div
          class="wallet-card group relative flex flex-col rounded-[20px] bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer overflow-hidden"
          @click="handleEditWallet(wallet)"
        >
          <!-- NEUTRAL BRAND HEADER -->
          <div class="p-4 bg-slate-100/70 dark:bg-white/[0.06] border-b border-zinc-100 dark:border-white/5 flex flex-col gap-1 min-w-0">
            <div class="flex justify-between items-center gap-2 h-4 w-full">
              <div class="flex items-center gap-2 min-w-0">
                <!-- Brand Dot as an accent -->
                <div class="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.05)]" :style="{ background: getWalletColor(wallet) }"></div>
                <span class="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate">{{ wallet.name }}</span>
              </div>
              <img v-if="wallet.icon" :src="getWalletIcon(wallet)" class="w-3.5 h-3.5 grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all shrink-0 object-contain" />
            </div>
            <div class="mt-1 min-w-0">
              <span class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tabular-nums tracking-tighter block truncate">
                {{ formatCurrency(wallet.balance) }}
              </span>
            </div>
          </div>

          <!-- ANALYTICS BODY -->
          <div class="p-4 py-4 flex flex-col gap-4 flex-1 min-w-0">
            <div class="space-y-2">
              <div class="relative h-[3px] bg-zinc-100 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-700 rounded-full"
                  :class="getFinancialUsage(wallet.id) > timeProgress ? 'bg-red-500' : 'bg-emerald-500'"
                  :style="{ width: `${Math.min(100, getFinancialUsage(wallet.id))}%` }"
                ></div>
                <div
                  class="absolute inset-y-0 w-[1px] bg-zinc-400/30 z-10"
                  :style="{ left: `${timeProgress}%` }"
                ></div>
              </div>
              <div class="flex justify-between items-center text-[10px] font-medium text-zinc-400 gap-2">
                <span class="tabular-nums whitespace-nowrap">Uso: {{ getFinancialUsage(wallet.id) }}%</span>
                <span class="font-bold uppercase tracking-tighter truncate" :class="getFinancialUsage(wallet.id) > timeProgress ? 'text-red-500' : 'text-emerald-500'">
                   {{ getHealthLabel(wallet.id) }}
                </span>
              </div>
            </div>

            <!-- Minimal Footer Info -->
            <div class="mt-auto pt-2 border-t border-zinc-50 dark:border-white/[0.02] text-[10px] text-zinc-300 dark:text-zinc-700 flex justify-between items-center uppercase font-bold tracking-tighter">
              <span class="truncate pr-2">{{ walletStats(wallet.id)?.totalCount || 0 }} TXs</span>
              <span class="shrink-0">D+{{ remainingDays }}</span>
            </div>
          </div>
        </div>
      </NGridItem>

      <!-- Portal of Creation -->
      <NGridItem>
        <div
          class="group flex flex-col h-[154px] rounded-[20px] border border-dashed border-zinc-200 dark:border-zinc-800/60 items-center justify-center gap-2 transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] cursor-pointer"
          @click="handleNewAccount"
        >
          <div class="w-7 h-7 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-zinc-500 transition-all border border-zinc-200/50 dark:border-white/5">
            <i class="i-lucide-plus text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-tight">Nova Conta</span>
        </div>
      </NGridItem>
    </NGrid>

    <WalletDialog :show="showModal" :wallet="selectedWallet" @close="closeModal" @saved="$emit('saved')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
import type { Wallet } from '../../domain/entities/Wallet'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import WalletDialog from './WalletDialog.vue'

interface WalletStats { income: number; expense: number; totalCount: number; trend: number }

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const isMobile = useIsMobile()
const showModal = ref(false)
const selectedWallet = ref<Wallet | null>(null)
const props = defineProps<{ wallets: Wallet[], statsMap?: Record<string, WalletStats> }>()
const statsMap = computed(() => props.statsMap || {})
const walletStats = (id: string) => statsMap.value[id]
const emit = defineEmits(['saved'])

const now = new Date()
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
const currentDay = now.getDate()
const remainingDays = daysInMonth - currentDay
const timeProgress = Math.round((currentDay / daysInMonth) * 100)

function getFinancialUsage(walletId: string) {
  const stats = walletStats(walletId)
  if (!stats || stats.income === 0) return 0
  return Math.round((stats.expense / stats.income) * 100)
}

function getHealthLabel(walletId: string) {
  const stats = walletStats(walletId)
  if (!stats || stats.totalCount === 0) return "Ativo"
  return getFinancialUsage(walletId) > timeProgress ? 'Atenção' : 'Saudável'
}

function handleNewAccount() { selectedWallet.value = null; showModal.value = true }
function handleEditWallet(w: Wallet) { selectedWallet.value = w; showModal.value = true }
function closeModal() { showModal.value = false; setTimeout(() => { selectedWallet.value = null }, 300) }
function formatCurrency(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v) }
function getWalletIcon(w: Wallet) { return assetLoader.sanitize(w.icon) }
function getWalletColor(w: Wallet) {
  const c: Record<string, string> = { 'Nubank': '#8a05be', 'Inter': '#ff7a00', 'BB': '#fbdf07', 'Mercado Pago': '#00b1ea', 'Itaú': '#ec7000', 'Santander': '#ec0000', 'Bradesco': '#cc092f', 'Bari': '#00d9c0' }
  return c[w.name] || '#6366f1'
}
</script>

<style scoped>
.wallet-card { height: 154px; min-width: 0; }
</style>
