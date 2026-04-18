import { describe, it, expect } from 'vitest'
import { EncryptionService } from '../EncryptionService'
import { KeyDerivationService } from '../KeyDerivationService'

describe('EncryptionService', () => {
  it('should encrypt and decrypt a string correctly', async () => {
    const password = 'extremely-secret-password'
    const salt = KeyDerivationService.generateSalt()
    const key = await KeyDerivationService.deriveKey(password, salt)
    
    const plainText = 'Hello, this is a secret financial record!'
    
    const encrypted = await EncryptionService.encrypt(plainText, key)
    
    expect(encrypted).toBeDefined()
    expect(encrypted.iv).toHaveLength(16) // Base64 encoded 12 bytes is 16 chars
    expect(encrypted.data).not.toBe(plainText)
    
    const decrypted = await EncryptionService.decrypt(encrypted, key)
    
    expect(decrypted).toBe(plainText)
  })

  it('should throw error if decryption fails (wrong key)', async () => {
    const salt = KeyDerivationService.generateSalt()
    const key1 = await KeyDerivationService.deriveKey('pass1', salt)
    const key2 = await KeyDerivationService.deriveKey('pass2', salt)
    
    const plainText = 'Secret data'
    const encrypted = await EncryptionService.encrypt(plainText, key1)
    
    await expect(EncryptionService.decrypt(encrypted, key2)).rejects.toThrow()
  })
})
