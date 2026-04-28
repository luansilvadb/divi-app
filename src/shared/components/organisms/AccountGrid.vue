<template>
  <div class="account-grid">
    <NGrid
      v-if="wallets && wallets.length > 0"
      :x-gap="12"
      :y-gap="12"
      :cols="isMobile ? 1 : 4"
      responsive="screen"
    >
      <!-- IWallet Cards -->
      <NGridItem v-for="IWallet in wallets" :key="IWallet.id">
        <div
          class="IWallet-card group relative flex flex-col rounded-xl overflow-hidden transition-all duration-150 ease-out cursor-pointer bg-surface-primary border border-separator hover:shadow-md"
          @click="handleEditIWallet(IWallet)"
        >
          <!-- Top accent bar (brand color) -->
          <div
            class="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-150 ease-out"
            :style="{ background: getIWalletColor(IWallet) }"
          ></div>

          <!-- Header: Name + Balance -->
          <div class="pt-5 px-4 pb-3">
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="flex items-center gap-2 min-w-0">
                <div
                  class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  :style="{ background: getIWalletColor(IWallet) + '18' }"
                >
                  <div
                    class="w-2 h-2 rounded-full"
                    :style="{ background: getIWalletColor(IWallet) }"
                  ></div>
                </div>
                <span
                  class="text-[11px] font-semibold uppercase tracking-wider truncate text-tertiary"
                >{{ IWallet.name }}</span>
              </div>
              <img
                v-if="IWallet.icon"
                :src="getIWalletIcon(IWallet)"
                class="w-4 h-4 grayscale opacity-20 group-hover:opacity-60 group-hover:grayscale-0 transition-all shrink-0 object-contain mt-0.5"
              />
            </div>

            <p
              class="text-xl font-bold tracking-tight tabular-nums text-label"
            >
              {{ formatCurrency(IWallet.balance) }}
            </p>
          </div>

          <!-- Divider -->
          <div class="h-px bg-separator"></div>

          <!-- Analytics Footer -->
          <div class="px-4 py-3 flex flex-col gap-2">
            <!-- Usage Progress -->
            <div class="relative h-1 rounded-full overflow-hidden bg-surface-secondary">
              <div
                class="h-full rounded-full transition-all duration-150 ease-out"
                :style="{
                  width: `${Math.min(100, getFinancialUsage(IWallet.id))}%`,
                  background: getFinancialUsage(IWallet.id) > timeProgress
                    ? 'var(--color-error)'
                    : 'var(--color-success)'
                }"
              ></div>
              <!-- Time marker -->
              <div
                class="absolute inset-y-0 w-px z-10"
                :style="{ left: `${timeProgress}%`, background: 'var(--text-quaternary)' }"
              ></div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-[10px] text-tertiary">
                {{ walletstats(IWallet.id)?.totalCount || 0 }} transações
              </span>
              <span
                class="text-[10px] font-semibold"
                :style="{ color: getFinancialUsage(IWallet.id) > timeProgress ? 'var(--color-error)' : 'var(--color-success)' }"
              >
                {{ getHealthLabel(IWallet.id) }}
              </span>
            </div>
          </div>
        </div>
      </NGridItem>

      <!-- Add New Account -->
      <NGridItem>
        <div
          class="group flex flex-col rounded-xl items-center justify-center gap-2 transition-all duration-200 cursor-pointer h-[117px] border border-dashed border-separator bg-transparent hover:bg-surface-secondary hover:border-quaternary"
          @click="handleNewAccount"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-surface-secondary border border-separator"
          >
            <i class="i-lucide-plus text-sm text-tertiary"></i>
          </div>
          <span class="text-[11px] font-medium text-tertiary">Nova Conta</span>
        </div>
      </NGridItem>
    </NGrid>

    <IWalletDialog :show="showModal" :IWallet="selectedIWallet" @close="closeModal" @saved="$emit('saved')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import IWalletDialog from './IWalletDialog.vue'

interface walletstats { income: number; expense: number; totalCount: number; trend: number }

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.IAssetLoader)
const isMobile = useIsMobile()
const showModal = ref(false)
const selectedIWallet = ref<IWallet | null>(null)
const props = defineProps<{ wallets: IWallet[], statsMap?: Record<string, walletstats> }>()
const statsMap = computed(() => props.statsMap || {})
const walletstats = (id: string) => statsMap.value[id]

defineEmits(['saved'])

const now = new Date()
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
const currentDay = now.getDate()
const timeProgress = Math.round((currentDay / daysInMonth) * 100)

function getFinancialUsage(IWalletId: string) {
  const stats = walletstats(IWalletId)
  if (!stats || stats.income === 0) return 0
  return Math.round((stats.expense / stats.income) * 100)
}

function getHealthLabel(IWalletId: string) {
  const stats = walletstats(IWalletId)
  if (!stats || stats.totalCount === 0) return 'Ativo'
  return getFinancialUsage(IWalletId) > timeProgress ? 'Atenção' : 'Saudável'
}

function handleNewAccount() { selectedIWallet.value = null; showModal.value = true }
function handleEditIWallet(w: IWallet) { selectedIWallet.value = w; showModal.value = true }
function closeModal() { showModal.value = false; setTimeout(() => { selectedIWallet.value = null }, 300) }

function formatCurrency(v: number | bigint) {
  const num = typeof v === 'bigint' ? Number(v) / 100 : v
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(num)
}

function getIWalletIcon(w: IWallet) { return assetLoader.sanitize(w.icon) }

function getIWalletColor(w: IWallet) {
  const c: Record<string, string> = {
    'Nubank': '#8205BE',
    'Inter': '#FF7A00',
    'BB': '#F5C400',
    'Mercado Pago': '#00B1EA',
    'Itaú': '#EC7000',
    'Santander': '#EC0000',
    'Bradesco': '#CC092F',
    'Bari': '#00D9C0',
    'C6 Bank': '#232323',
    'XP': '#1A1A2E',
    'Caixa': '#216FB4',
  }
  return c[w.name] || '#007AFF'
}
</script>

<style scoped>
.IWallet-card { height: 117px; min-width: 0; }
</style>
