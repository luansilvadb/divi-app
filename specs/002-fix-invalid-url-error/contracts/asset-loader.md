# Contract: Asset Loader Utility

## Interface

```typescript
/**
 * Utilitário para carregamento, validação e sanitização de ativos visuais.
 */
export interface IAssetLoader {
  /**
   * Sanitiza e valida uma URL de ativo (Data URI ou Static Path).
   * Retorna a URL sanitizada ou um fallback seguro.
   */
  sanitize(url: string | undefined): string;

  /**
   * Verifica se uma Data URI excede o limite de tamanho permitido.
   */
  isValidSize(dataUri: string): boolean;

  /**
   * Obtém um fallback padrão baseado no tipo de recurso.
   */
  getFallback(type?: 'category' | 'wallet' | 'generic'): string;
}
```

## Implementation Details (Proposed)

O `AssetLoader` será um utilitário puro em `src/shared/utils/asset-loader.ts`.

- **Sanitize**:
  1. Remove espaços em branco nas extremidades.
  2. Remove sufixos de depuração (ex: `:1`).
  3. Verifica se a Data URI é válida (regex baseada em mime-type e encoding).
  4. Verifica o tamanho (FR-005).
  5. Retorna o fallback se qualquer validação falhar.

- **Activity Logging**:
  Se uma falha de sanitização ocorrer, deve invocar o `ActivityLogService.logActivity` com o tipo `warning` ou `error`. (FR-006).
