/**
 * KeyDerivationService
 * Responsável pela derivação de chaves criptográficas a partir de senhas de usuário.
 * Utiliza o algoritmo PBKDF2 conforme recomendado pelas melhores práticas de 2026.
 */
export class KeyDerivationService {
  private static readonly ITERATIONS = 600000 // Elevado para 600k conforme spec
  private static readonly HASH = 'SHA-256'

  /**
   * Deriva uma CryptoKey (AES-GCM 256) a partir de uma senha e salt.
   */
  public static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    // 1. Importar a senha bruta como uma 'base key'
    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    )

    // 2. Derivar a chave final AES-GCM 256
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(salt),
        iterations: this.ITERATIONS,
        hash: this.HASH,
      },
      baseKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // Permitir exportação para testes de igualdade
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Gera um salt aleatório criptograficamente seguro.
   */
  public static generateSalt(length = 32): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length))
  }
}
