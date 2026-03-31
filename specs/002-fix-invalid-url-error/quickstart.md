# Quickstart: Working with Assets & Avoiding Invalid URLs

## Introduction
Este guia fornece orientações rápidas sobre como utilizar ícones, placeholders e imagens de forma segura para evitar erros de rede (`net::ERR_INVALID_URL`) no console do navegador durante a inicialização das stores.

## Standard Practices

### 1. Static Assets (Icons & Graphics)
Sempre prefira arquivos físicos na pasta `/public/assets` ao invés de strings Base64 gigantescas embutidas no código.
- **Good**: `<img src="/assets/icons/category-food.svg" />`
- **Bad**: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAy..." />`

### 2. Using Base64 (Data URIs)
Se você **precisar** usar Base64 para pequenos ativos (ruído, texturas leves):
- Verifique se a string está completa e não foi truncada.
- Tente usar SVGs inline (`<svg>...</svg>`) ao invés de embuti-los no `background-image` do CSS se a string for complexa.

### 3. Usando o Utilitário AssetLoader (Recomendado)
Para maior segurança, utilize o utilitário global para sanitizar qualquer URL dinâmica:
```typescript
import { assetLoader } from '@/shared/utils/asset-loader'

// Na store ou componente
const safeIcon = assetLoader.sanitize(category.icon)
```
O `AssetLoader` cuida automaticamente de:
- Remoção de sufixos malformados (ex: `:1`).
- Validação de limite de 128KB (FR-005).
- Fallback para ativos padrão em `/public/assets`.
- Registro de erros no log de atividades (FR-006).

### 4. Component Error Handling
Sempre utilize o evento `@error` em tags `<img>` para aplicar um fallback silencioso:
```vue
<img :src="imageUrl" @error="handleImageError" />

<script setup>
function handleImageError(e) {
  e.target.src = '/assets/placeholders/fallback.png'
}
</script>
```

---
