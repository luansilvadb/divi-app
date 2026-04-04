# Diagnóstico Técnico e Soluções (Migração PrimeVue)

## 1. Identificação de Gargalos Arquiteturais

Após analisar o código-fonte existente da aplicação `Divi`, os seguintes gargalos foram identificados na camada de UI:

*   **Fragmentação de UI Components (Custom Atoms):** A aplicação dependia fortemente de componentes primitivos construídos manualmente (`BaseButton`, `BaseInput`, `BaseSelect`). Embora fizessem uso do TailwindCSS para a aparência, eles careciam da robustez necessária para acessibilidade (WAI-ARIA completo), navegação por teclado avançada e extensibilidade (como virtual scrolling em selects grandes).
*   **Boilerplate de Lógica Visual e Acoplamento:** Arquivos como `BaseSelect.vue` continham lógica própria complexa de drop-down, gerenciamento de estado `isOpen` e implementavam diretivas customizadas (como `v-click-outside`), aumentando o tamanho do bundle e a complexidade de manutenção. Este acoplamento visual fere o princípio da Densidade Lógica, dispersando regras estruturais nos átomos invés de focar no negócio.
*   **Gestão de Estado de UI:** Componentes como `BaseInput` também misturavam a validação visual (estados `error`) diretamente na tag iterada da UI.

## 2. Soluções Aplicadas (Refatoração com PrimeVue)

Para maximizar a performance e a coesão sem quebrar a lógica de negócio (retrocompatibilidade nos Organisms e Templates):

*   **Integração do PrimeVue:** Foi configurado o PrimeVue de forma global no `main.ts` utilizando a nova API `primevue/core/config` e o preset de tema `Aura` do `@primeuix/themes`. Esta abordagem moderna substitui a versão obsoleta `@primevue/themes` identificada em tentativas anteriores.
*   **Refatoração do `BaseButton`:** O átomo `BaseButton.vue` foi refatorado para ser um wrapper estrito do `<Button>` nativo do PrimeVue. A interface de propriedades original (`variant`, `loading`, `disabled`) foi mantida integralmente, realizando um _mapping_ para as propriedades `severity`, `outlined` e `text` do PrimeVue. As customizações Tailwind foram injetadas usando a funcionalidade Pass Through (`pt`) do PrimeVue, garantindo as cores de brand existentes no Tailwind (por ex: `bg-primary-main`).
*   **Refatoração do `BaseInput`:** O `BaseInput.vue` agora atua como proxy inteligente que renderiza `<InputText>` ou `<InputNumber>` do PrimeVue dependendo da prop `type`. Isso delega as regras complexas de formatação (ex: spin-buttons, model modifiers) diretamente para a biblioteca C-core do PrimeVue, removendo os pesados `<style scoped>` de resets customizados. O Pass Through (`pt`) manteve a responsividade Tailwind e bordas unificadas.
*   **Refatoração do `BaseSelect`:** Toda a lógica pesada e a diretiva `v-click-outside` do `BaseSelect.vue` foram erradicadas. O componente foi reconstruído em cima do `<Select>` oficial. Props originais de arrays e seleções bidirecionais (`v-model`) mantiveram seu comportamento exato. Graças aos atributos `fluid` e o design headless via `pt`, os Modais complexos (`TransactionFormContent`) que o consumiam sequer perceberam a troca subjacente do DOM, garantindo a **retrocompatibilidade** e conformidade com o princípio "Domínio como Fonte da Verdade (Contratos)" das diretrizes do repositório.

## 3. Impacto e Conclusões

Com estas mudanças, a árvore de DOM final está mais previsível, validada por bibliotecas padrão na indústria e mais leve em termos de scripting nativo. A aderência rigorosa aos contratos pré-existentes provou que as fatias verticais e a infraestrutura de View mantiveram sua coesão e independência.
