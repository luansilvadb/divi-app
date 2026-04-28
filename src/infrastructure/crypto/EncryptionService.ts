import { AppError } from '@/core/errors'

/**
 * EncryptionService
 * Oferece cifragem e decifragem de dados utilizando AES-GCM 256-bit.
 * Focado na soberania de dados para sincronização remota.
 */
export interface IEncryptedPayload {
  iv: string // Base64
  data: string // Base64 (ciphertext + tag)
}

export class EncryptionService {
  private static readonly ALGORITHM = 'AES-GCM'
  private static readonly IV_LENGTH = 12 // 96 bits recomendado para GCM

  /**
   * Cifra um texto puro em um payload opaco.
   */
  public static async encrypt(plainText: string, key: CryptoKey): Promise<IEncryptedPayload> {
    const encoder = new TextEncoder()
    const encodedText = encoder.encode(plainText)
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encodedText
    )

    return {
      iv: this.arrayBufferToBase64(iv),
      data: this.arrayBufferToBase64(encryptedContent),
    }
  }

  /**
   * Decifra um payload opaco em texto puro.
   */
  public static async decrypt(payload: IEncryptedPayload, key: CryptoKey): Promise<string> {
    const iv = this.base64ToArrayBuffer(payload.iv)
    const encryptedData = this.base64ToArrayBuffer(payload.data)

    try {
      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv,
        },
        key,
        encryptedData
      )

      const decoder = new TextDecoder()
      return decoder.decode(decryptedContent)
    } catch (err) {
      console.error('[EncryptionService] Decryption failed - possible wrong key or tampered data.', err)
      throw new AppError(
        'Falha na decriptografia de dados soberanos.',
        'DECRYPTION_ERROR',
        500,
        true
      )
    }
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i] as number)
    }
    return btoa(binary)
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}
