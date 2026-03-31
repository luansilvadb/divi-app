# Data Model: Assets & Icons

## Entities

### Asset
Representa um recurso visual dinâmico ou estático utilizado na interface.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `type` | `string` | 'data' \| 'static' \| 'icon' | Obrigatório |
| `value` | `string` | A URI de dados ou o caminho do arquivo | Máx 128KB para Data URIs |
| `fallback` | `string` | Caminho para um recurso alternativo seguro | Deve ser um ativo estático válido |
| `metadata` | `object` | Informações extras (mime-type, size) | Opcional |

## Relationships

- **Category** (src/shared/domain/entities/Category.ts): Cada categoria possui um `icon` que deve ser processado como um `Asset`.
- **Wallet** (src/shared/domain/entities/Wallet.ts): Cada carteira possui um `icon` (opcional) que deve ser processado como um `Asset`.

## Validation Rules

1. **Data URI Limit**: Qualquer string começando com `data:image/` deve ter menos de 131.072 caracteres (128KB).
2. **Sanitization**: Deve-se remover qualquer prefixo inesperado (como `:1` malformado) e garantir que a string base64 seja válida.
3. **Safe Protocol**: Apenas os protocolos `data:` e caminhos relativos (começando com `/`) são permitidos. URLs externas (`http(s)`) devem ser marcadas para auditoria ou sanitizadas se não forem permitidas explicitamente.
