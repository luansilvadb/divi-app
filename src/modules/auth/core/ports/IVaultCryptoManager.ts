import type { IEncryptedPayload } from '@/infrastructure/crypto/EncryptionService'

export interface IVaultCryptoManager {
  initialize(password: string): Promise<void>
  lock(): void
  hasKey(): boolean
  encrypt(plainText: string): Promise<IEncryptedPayload>
  decrypt(payload: IEncryptedPayload): Promise<string>
}
