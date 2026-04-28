<template>
  <StandardPageLayout
    title="Meu Perfil"
    highlight="Perfil"
    subtitle="Gerencie as informações da sua conta."
  >
    <NGrid :cols="'1 768:3'" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
      <!-- User Info Card -->
      <NGridItem>
        <NSpace vertical :size="16">
          <NCard>
            <NSpace vertical align="center" :size="16" class="py-4">
              <div
                class="w-24 h-24 rounded-full bg-[rgba(0,122,255,0.08)] flex items-center justify-center border-4 border-violet-500/5 transition-transform hover:scale-105 duration-500"
              >
                <NText type="primary" strong class="text-3xl">
                  {{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
                </NText>
              </div>
              <NSpace vertical :size="4" align="center">
                <NText strong class="text-xl">
                  {{ authStore.user?.email?.split('@')[0] || 'Usuário' }}
                </NText>
                <NText depth="3" class="text-sm">
                  {{ authStore.user?.email }}
                </NText>
                <NTag type="primary" size="small" round>Premium</NTag>
              </NSpace>
            </NSpace>
          </NCard>

          <NCard title="Preferências & Sistema" size="small">
            <template #header-extra>
              <i class="i-lucide-settings text-lg opacity-20"></i>
            </template>
            <NSpace vertical :size="8">
              <!-- Replicated Theme Toggle -->
              <NButton quaternary block class="!h-12 !px-4 group" @click="toggleTheme">
                <template #icon>
                  <div class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
                    <i :class="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="text-lg"></i>
                  </div>
                </template>
                <span class="flex-1 text-left font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">Mudar Tema</span>
                <NTag size="small" round :type="isDark ? 'warning' : 'info'" quaternary>{{ isDark ? 'Escuro' : 'Claro' }}</NTag>
              </NButton>

              <!-- Replicated Logout -->
              <NButton quaternary block class="!h-12 !px-4 group" @click="handleLogout">
                <template #icon>
                  <div class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 group-hover:bg-red-500/10 transition-colors">
                    <i class="i-lucide-log-out text-lg"></i>
                  </div>
                </template>
                <span class="flex-1 text-left font-bold text-red-500">Encerrar Sessão</span>
              </NButton>
            </NSpace>
          </NCard>

          <!-- ZONA DE PERIGO -->
          <NCard size="small" class="!border-red-500/30">
            <template #header>
              <NSpace align="center" :size="8">
                <i class="i-lucide-triangle-alert text-lg text-red-500"></i>
                <NText strong class="text-red-500 text-sm uppercase tracking-widest">Zona de Perigo</NText>
              </NSpace>
            </template>
            <NSpace vertical :size="8">
              <NText depth="3" class="text-xs leading-relaxed">
                Esta ação é <strong class="text-red-400">irreversível</strong>. Todos os seus dados locais e remotos serão permanentemente excluídos.
              </NText>
              <NButton
                id="btn-delete-account"
                type="error"
                ghost
                block
                :loading="isPurging"
                @click="showPurgeModal = true"
              >
                <template #icon>
                  <i class="i-lucide-skull text-lg"></i>
                </template>
                EXCLUIR CONTA E DADOS
              </NButton>
            </NSpace>
          </NCard>
        </NSpace>
      </NGridItem>

      <NGridItem :span="'0:1 768:2'">
        <NCard>
          <template #header>
            <NSpace align="center" :size="8">
              <i class="i-lucide-user text-lg text-[#007AFF]"></i>
              <NText strong>Dados da Conta</NText>
            </NSpace>
          </template>
          <NEmpty description="Opções para edição de perfil em breve." class="py-8">
            <template #icon>
              <i class="i-lucide-construction text-3xl"></i>
            </template>
          </NEmpty>
        </NCard>
      </NGridItem>
    </NGrid>

    <!-- MODAL DE CONFIRMAÇÃO DESTRUTIVA -->
    <NModal
      v-model:show="showPurgeModal"
      preset="dialog"
      type="error"
      title="⚠️ OPERAÇÃO DESTRUTIVA IRREVERSÍVEL"
      :mask-closable="false"
    >
      <template #default>
        <NSpace vertical :size="16">
          <NText>
            Você está prestes a <strong>destruir permanentemente</strong> toda a sua conta Divi:
          </NText>
          <ul class="text-sm text-zinc-400 space-y-1 list-none pl-0">
            <li>🗄️ Todos os dados locais (IndexedDB) serão apagados</li>
            <li>☁️ Todos os registros remotos no servidor serão deletados</li>
            <li>🔐 As chaves de criptografia serão destruídas</li>
            <li>🚪 Você será desconectado permanentemente</li>
          </ul>
          <NAlert type="error" :show-icon="true">
            Esta ação <strong>NÃO pode ser desfeita</strong>. Não há backup. Não há recuperação.
          </NAlert>
        </NSpace>
      </template>
      <template #action>
        <NSpace :size="8" justify="end">
          <NButton
            id="btn-cancel-purge"
            :disabled="isPurging"
            @click="showPurgeModal = false"
          >
            Cancelar — Manterei minha conta
          </NButton>
          <NButton
            id="btn-confirm-purge"
            type="error"
            :loading="isPurging"
            @click="handlePurgeAccount"
          >
            <template #icon>
              <i class="i-lucide-skull"></i>
            </template>
            CONFIRMAR: DESTRUIR TUDO
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NButton,
  NModal,
  NAlert,
  useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../application/authStore'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import { useTheme } from '@/core/theme'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { IVaultCryptoManager } from '../../domain/contracts/IVaultCryptoManager'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggle: toggleTheme } = useTheme()
const authService = container.resolve<IAuthService>(DI_TOKENS.AuthService)
const vaultCryptoManager = container.resolve<IVaultCryptoManager>(DI_TOKENS.VaultCryptoManager)
const message = useMessage()

const showPurgeModal = ref(false)
const isPurging = ref(false)

async function handleLogout() {
  await authService.signOut()
  router.push({ name: 'login' })
}

async function handlePurgeAccount() {
  isPurging.value = true
  showPurgeModal.value = false

  try {
    await authStore.purgeAccount(authService, vaultCryptoManager)
    message.success('Conta e dados excluídos com sucesso. Até mais.', { duration: 3000 })
    router.push({ name: 'login' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir a conta.'
    message.error(`Falha no purge: ${msg}`)
    isPurging.value = false
  }
}
</script>
