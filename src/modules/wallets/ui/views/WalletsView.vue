<template>
  <StandardPageLayout
    title="Minhas Carteiras"
    highlight="Carteiras"
    subtitle="Governança de patrimônio e saldo detalhado."
  >
    <template #action>
      <div class="flex items-center gap-3">
        <AppleButton variant="primary" size="medium" @click="showAddModal = true" id="btn-create-wallet">
          Nova Carteira
        </AppleButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main class="lg:col-span-2 space-y-6">
        <NEmpty
          v-if="!wallets || wallets.length === 0"
          description="Nenhuma carteira configurada."
          class="py-24"
        >
          <template #icon>
            <i class="i-lucide-wallet text-5xl text-[rgba(0,122,255,0.3)] dark:text-[rgba(10,132,255,0.3)]"></i>
          </template>
        </NEmpty>

        <NGrid
          v-else
          cols="1 1024:2"
          :x-gap="20"
          :y-gap="20"
          responsive="screen"
          item-responsive
        >
          <NGridItem v-for="wallet in wallets" :key="wallet.id">
            <NCard size="medium" hoverable class="h-full">
              <template #header>
                <div class="flex items-center gap-3">
                  <i :class="getWalletIcon(wallet.type)" class="text-xl text-primary-400"></i>
                  <span class="font-inter font-semibold">{{ wallet.name }}</span>
                </div>
              </template>
              <div class="mt-4">
                <NText depth="3" class="text-xs uppercase tracking-wider block mb-1">Saldo Atual</NText>
                <div class="font-jetbrains text-2xl font-semibold tracking-tight tabular-nums">
                  {{ formatCurrency(Number(wallet.balance) / 100) }}
                </div>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </main>

      <aside class="side-column">
        <NCard>
          <template #header><NText strong>Total do Patrimônio</NText></template>
          <div class="font-jetbrains text-3xl font-bold tabular-nums text-primary-400">
            {{ formatCurrency(totalPatrimony) }}
          </div>
        </NCard>
      </aside>
    </div>

    <NModal v-model:show="showAddModal" preset="card" title="Nova Carteira" style="width: 400px">
      <NForm ref="formRef" :model="formModel" :rules="formRules" @submit.prevent="handleSaveWallet">
        <NFormItem label="Nome" path="name">
          <NInput v-model:value="formModel.name" id="input-wallet-name" placeholder="Ex: NuBank, Dinheiro, Reserva..." />
        </NFormItem>

        <NFormItem label="Tipo" path="type">
          <NSelect v-model:value="formModel.type" :options="typeOptions" id="select-wallet-type" />
        </NFormItem>

        <NFormItem label="Saldo Inicial" path="balance">
          <NInputNumber
            v-model:value="formModel.balance"
            :precision="2"
            :step="0.01"
            id="input-wallet-balance"
            class="w-full"
          >
            <template #prefix>R$</template>
          </NInputNumber>
        </NFormItem>

        <div class="flex justify-end gap-3 mt-6">
          <NButton @click="showAddModal = false">Cancelar</NButton>
          <NButton type="primary" attr-type="submit" :loading="isSaving" id="btn-save-wallet">
            Salvar
          </NButton>
        </div>
      </NForm>
    </NModal>

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="showAddModal = true"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NCard, NText, NEmpty, NGrid, NGridItem, NModal, NForm, NFormItem, NInput, NSelect, NInputNumber, useMessage
} from 'naive-ui'
import { useObservable } from '@vueuse/rxjs'
import { useService } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import type { WalletService } from '../../application/services/WalletService'

const message = useMessage()
const walletService = useService<WalletService>(DI_TOKENS.WalletService)
const isMobile = useIsMobile()

// Subscribe to RxJS subject
const wallets = useObservable(walletService.wallets$)

onMounted(() => {
  walletService.loadWallets()
})

const totalPatrimony = computed(() => {
  if (!wallets.value) return 0
  const sumMinorUnits = wallets.value.reduce((acc, w) => acc + Number(w.balance), 0)
  return sumMinorUnits / 100
})

const showAddModal = ref(false)
const isSaving = ref(false)

const formModel = ref({
  name: '',
  type: 'checking',
  balance: 0
})

const formRules = {
  name: { required: true, message: 'O nome é obrigatório' },
  type: { required: true, message: 'O tipo é obrigatório' },
}

const typeOptions = [
  { label: 'Corrente', value: 'checking' },
  { label: 'Investimento', value: 'investment' },
  { label: 'Dinheiro Físico', value: 'cash' },
]

function getWalletIcon(type: string) {
  switch (type) {
    case 'cash': return 'i-lucide-coins'
    case 'investment': return 'i-lucide-line-chart'
    default: return 'i-lucide-credit-card'
  }
}

async function handleSaveWallet() {
  if (!formModel.value.name) return
  isSaving.value = true
  try {
    await walletService.createWallet({
      name: formModel.value.name,
      type: formModel.value.type as any,
      currency: 'BRL',
      balance: formModel.value.balance
    })
    message.success('Carteira criada com sucesso!')
    showAddModal.value = false
    formModel.value = { name: '', type: 'checking', balance: 0 }
  } catch (err) {
    console.error(err)
    message.error('Erro ao criar carteira.')
  } finally {
    isSaving.value = false
  }
}
</script>
