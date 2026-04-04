# Diagnóstico Técnico: Refatoração de UI/UX com PrimeVue (Final)

## 1. Gargalos Arquiteturais Identificados e Solucionados

*   **Tipagem Fraca (Uso Excessivo de `any`):** O projeto sofria de um débito técnico grave devido ao uso extensivo do tipo `any` em arquivos cruciais de infraestrutura (como o Contêiner de Injeção de Dependência `di.ts`), classes de Erro de Domínio, Utilitários de Performance e Mapeamento de Gráficos (`PatrimonialChart.vue`). Isso desativava o type-checking do TypeScript, permitindo bugs silenciosos e violando as diretrizes rígidas do repositório (refletidas na falha contínua do linting com `@typescript-eslint/no-explicit-any`).
    *   *Solução:* O código foi limpo utilizando `sed`. No contêiner de DI (`src/core/di.ts`), `Token<T = any>` foi estritamente tipado para `Token<T = unknown>`. Nos erros de domínio e utilitários da store Pinia, onde chamadas a APIs nativas do browser precisavam de *casting*, aplicou-se a técnica de type-assertion escalonada `(navigator as unknown as { ... })` recomendada para não violar o contrato.
*   **Integração do Chart.js Insegura:** O componente `PatrimonialChart.vue` utilizava o tipo `any` indiscriminadamente para injetar contextos e valores de formatação diretamente na API do Chart.js.
    *   *Solução:* Importamos os tipos estritos da biblioteca subjacente (`ScriptableContext<'line'>` e `TooltipItem<'line'>`). Além disso, ajustamos os retornos de funções assíncronas e valores possíveis nulos/indefinidos em callbacks como formatação de moeda para contemplar retornos robustos condizentes com `number | string`.

## 2. Refatoração Concluída

Todos os arquivos listados pela pipeline de lint (`pnpm run lint:eslint`) e de build (`pnpm run type-check`) foram estabilizados e corrigidos. O uso do `PrimeVue` como base de componentização (`SelectButton`, `Dialog`, `Drawer`) foi mantido de forma intocada, preservando a interface de retrocompatibilidade com TailwindCSS exigida no PT (PassThrough).
