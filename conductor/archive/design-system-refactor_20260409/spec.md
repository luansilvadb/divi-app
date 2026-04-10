# Spec: Refactor do Design System de Tokens

## Visão Geral
Eliminar o conflito entre os 3 sistemas de cores concorrentes no Divi App, estabelecendo o `diviPreset.ts` (PrimeVue Aura customizado) como a Fonte Única de Verdade (SSoT).

## Requisitos Funcionais
- **Migração de Classes**: Substituir ~300+ ocorrências de classes customizadas (`text-text-primary`, `bg-bg-main`, etc.) por classes do `tailwindcss-primeui` (ex: `text-surface-900`, `bg-surface-100`).
- **Eliminação de Hardcoding**: Substituir ~100+ ocorrências de cores hexadecimais hardcoded nos componentes por tokens semânticos do preset.
- **Limpeza de CSS**: Remover re-exportações de tokens customizados no `main.css` (@theme) e simplificar o `theme.css`.

## Requisitos Não-Funcionais
- **Consistência Visual**: Garantir que o comportamento de Dark Mode continue funcionando através dos mapeamentos do PrimeUI (ex: `bg-surface-0 dark:bg-surface-800`).
- **Especificidade de CSS**: Resolver conflitos onde o PrimeVue nativo perde a batalha de especificidade contra estilos customizados.

## Critérios de Aceite
- [ ] O arquivo `theme.css` contém apenas a paleta de cores base e tokens exclusivos (como glassmorphism).
- [ ] O bloco `@theme` no `main.css` não contém mais referências a tokens duplicados.
- [ ] Todos os componentes (incluindo Modais, Diálogos, etc.) utilizam apenas o sistema unificado.
- [ ] A aplicação mantém a mesma identidade visual atual após a migração técnica.

## Fora de Escopo
- Mudanças na lógica de negócio dos componentes.
- Alteração da biblioteca UI principal (permanece PrimeVue).
