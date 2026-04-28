import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUser } from '../core/entities/IUser'
import type { IAuthService } from '../core/ports/IAuthService'
import type { IVaultCryptoManager } from '../core/ports/IVaultCryptoManager'
import type { ISyncEngine } from '@/core/sync/ports/ISyncEngine'
import { vaultDb } from '@/infrastructure/storage/VaultDatabase'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(newUser: IUser) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  async function initialize() {
    const authService = container.resolve<IAuthService>(DI_TOKENS.IAuthService)
    const vaultCryptoManager = container.resolve<IVaultCryptoManager>(DI_TOKENS.IVaultCryptoManager)
    const syncEngine = container.resolve<ISyncEngine>(DI_TOKENS.ISyncEngine)

    // Set initial user
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
    }

    // Listen for auth changes
    authService.onAuthStateChange((newUser: IUser | null) => {
      user.value = newUser
      if (!newUser) {
        // SECURITY: Clear keys on logout
        vaultCryptoManager.lock()
      } else {
        // Disparar sincronização ao autenticar
        syncEngine.trigger()
      }
    })
  }

  /**
   * Inicializa o cofre de criptografia soberana.
   */
  async function initializeVault(password: string) {
    const vaultCryptoManager = container.resolve<IVaultCryptoManager>(DI_TOKENS.IVaultCryptoManager)
    const syncEngine = container.resolve<ISyncEngine>(DI_TOKENS.ISyncEngine)

    await vaultCryptoManager.initialize(password)
    // Sincronizar após liberar o cofre para permitir push/pull de dados criptografados
    syncEngine.trigger()
  }

  /**
   * ACCOUNT PURGE — Ação destrutiva e irreversível.
   * Sequência: deleteAccountData (remoto) → clearAllData (local) → lock (crypto) → signOut
   * O router push para /login é responsabilidade do chamador (UI).
   */
  async function purgeAccount(): Promise<void> {
    const authService = container.resolve<IAuthService>(DI_TOKENS.IAuthService)
    const vaultCryptoManager = container.resolve<IVaultCryptoManager>(DI_TOKENS.IVaultCryptoManager)

    // 1. Deletar dados remotos via Supabase (RLS garante escopo do usuário)
    await authService.deleteAccountData()

    // 2. Limpar banco local (IndexedDB) — todas as tabelas
    await vaultDb.clearAllData()

    // 3. Travar o cofre criptográfico (zerar chaves da memória)
    vaultCryptoManager.lock()

    // 4. Deslogar da sessão Supabase
    await authService.signOut()

    // 5. Limpar estado Pinia
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
    initialize,
    initializeVault,
    purgeAccount,
  }
})
