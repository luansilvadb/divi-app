import { describe, it, expect } from 'vitest'
import { KeyDerivationService } from '../KeyDerivationService'

describe('KeyDerivationService', () => {
  it('should derive a key from a password and salt', async () => {
    const password = 'extremely-secret-password'
    const salt = crypto.getRandomValues(new Uint8Array(16))
    
    const key = await KeyDerivationService.deriveKey(password, salt)
    
    expect(key).toBeDefined()
    expect(key.type).toBe('secret')
    expect(key.algorithm.name).toBe('AES-GCM')
  })

  it('should derive the same key for the same password and salt', async () => {
    const password = 'extremely-secret-password'
    const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    
    const key1 = await KeyDerivationService.deriveKey(password, salt)
    const key2 = await KeyDerivationService.deriveKey(password, salt)
    
    const exported1 = await crypto.subtle.exportKey('raw', key1)
    const exported2 = await crypto.subtle.exportKey('raw', key2)
    
    expect(new Uint8Array(exported1)).toEqual(new Uint8Array(exported2))
  })
})
