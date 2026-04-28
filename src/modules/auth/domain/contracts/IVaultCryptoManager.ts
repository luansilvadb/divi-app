import type { EncryptedPayload } from '@/infrastructure/crypto/EncryptionService'

export interface IVaultCryptoManager {
  initialize(password: string): Promise<void>
  lock(): void
  hasKey(): boolean
  encrypt(plainText: string): Promise<EncryptedPayload>
  decrypt(payload: EncryptedPayload): Promise<string>
}
