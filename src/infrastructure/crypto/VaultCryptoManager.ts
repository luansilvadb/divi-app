import { KeyDerivationService } from './KeyDerivationService'
import { EncryptionService, type IEncryptedPayload } from './EncryptionService'
import type { IVaultCryptoManager } from '@/modules/auth/core/ports/IVaultCryptoManager'

export class VaultCryptoManager implements IVaultCryptoManager {
  private static instance: VaultCryptoManager
  private currentKey: CryptoKey | null = null
  private readonly SALT_KEY = 'divi_vault_salt'

  constructor() {}

  public static getInstance(): VaultCryptoManager {
    if (!VaultCryptoManager.instance) {
      VaultCryptoManager.instance = new VaultCryptoManager()
    }
    return VaultCryptoManager.instance
  }

  public async initialize(password: string): Promise<void> {
    let salt = this.getStoredSalt()

    if (!salt) {
      salt = KeyDerivationService.generateSalt()
      this.storeSalt(salt)
    }

    this.currentKey = await KeyDerivationService.deriveKey(password, salt)
  }

  public lock(): void {
    this.currentKey = null
  }

  public hasKey(): boolean {
    return this.currentKey !== null
  }

  public async encrypt(plainText: string): Promise<IEncryptedPayload> {
    if (!this.currentKey) {
      throw new Error('Cofre trancado.')
    }
    return EncryptionService.encrypt(plainText, this.currentKey)
  }

  public async decrypt(payload: IEncryptedPayload): Promise<string> {
    if (!this.currentKey) {
      throw new Error('Cofre trancado.')
    }
    return EncryptionService.decrypt(payload, this.currentKey)
  }

  private getStoredSalt(): Uint8Array | null {
    if (typeof localStorage === 'undefined') return null
    const stored = localStorage.getItem(this.SALT_KEY)
    if (!stored) return null

    try {
      const binaryString = atob(stored)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes
    } catch (e) {
      console.error('[VaultCryptoManager] Failed to decode stored salt', e)
      return null
    }
  }

  private storeSalt(salt: Uint8Array): void {
    if (typeof localStorage === 'undefined') return
    let binaryString = ''
    for (let i = 0; i < salt.byteLength; i++) {
      binaryString += String.fromCharCode(salt[i] as number)
    }
    localStorage.setItem(this.SALT_KEY, btoa(binaryString))
  }
}
