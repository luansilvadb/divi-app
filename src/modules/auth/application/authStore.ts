import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../domain/entities/User'
import type { IAuthService } from '../domain/contracts/IAuthService'
import type { IVaultCryptoManager } from '../domain/contracts/IVaultCryptoManager'
import type { ISyncEngine } from '@/core/sync/contracts/ISyncEngine'
import { vaultDb } from '@/infrastructure/storage/VaultDatabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(newUser: User) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  async function initialize(
    authService: IAuthService,
    vaultCryptoManager: IVaultCryptoManager,
    syncEngine: ISyncEngine,
  ) {
    // Set initial user
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
    }

    // Listen for auth changes
    authService.onAuthStateChange((newUser: User | null) => {
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
  async function initializeVault(
    password: string,
    vaultCryptoManager: IVaultCryptoManager,
    syncEngine: ISyncEngine,
  ) {
    await vaultCryptoManager.initialize(password)
    // Sincronizar após liberar o cofre para permitir push/pull de dados criptografados
    syncEngine.trigger()
  }

  /**
   * ACCOUNT PURGE — Ação destrutiva e irreversível.
   * Sequência: deleteAccountData (remoto) → clearAllData (local) → lock (crypto) → signOut
   * O router push para /login é responsabilidade do chamador (UI).
   */
  async function purgeAccount(
    authService: IAuthService,
    vaultCryptoManager: IVaultCryptoManager,
  ): Promise<void> {
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
