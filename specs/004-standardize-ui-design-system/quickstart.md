# Quickstart - Standardize UI & Design System

## Próximos Passos para Implementação

### 1. Preparação Global
- Abra `src/core/styles/main.css` e adicione as classes globais de layout (`.view-wrapper`, `.view-content-grid`, etc.).
- Verifique se o `BaseViewHeader.vue` suporta a prop `highlight`. Caso não, adicione suporte a um `span` estilizado dentro do título.

### 2. Refatoração de View (Exemplo Dashboard)
- Substitua os containers de layout locais pela nova estrutura:
```html
<template>
  <div class="view-wrapper">
    <BaseBackgroundOrbs />
    <BaseViewHeader title="Meu Dashboard" highlight="Dashboard" />
    <div class="view-content-grid">
      <main class="main-column">
        <!-- Conteúdo principal -->
      </main>
      <aside class="side-column">
        <!-- Resumo lateral -->
      </aside>
    </div>
  </div>
</template>
```

### 3. Ajuste de Componentes Atômicos
- Verifique em `src/shared/components/atoms/` se componentes como `BaseCard` e `BaseButton` estão utilizando as cores semânticas corretas do Tailwind (ex: `bg-error-main` em vez de hexadecimais hardcoded).

### 4. Validação do Modo Escuro
- Teste a alternância de temas e garanta que o contraste das cores semânticas e o efeito de desfoque (glassmorphism) se adaptem corretamente.
