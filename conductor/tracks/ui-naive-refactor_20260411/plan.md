# Implementation Plan: UI Refactor to Naive UI (LobeHub Style)

Este plano detalha a migração completa do PrimeVue para o Naive UI, focando em uma estética moderna estilo LobeHub.

## Phase 1: Infraestrutura e Configuração do Naive UI
- [ ] **Task: Instalação e Configuração Base**
    - [ ] Instalar `naive-ui` e `vfonts`.
    - [ ] Configurar o `NConfigProvider` no `App.vue`.
    - [ ] Criar o arquivo de configuração de tema (`src/core/theme/naiveTheme.ts`) com tokens estilo LobeHub (Glassmorphism, cores modernas).
    - [ ] Configurar suporte a Dark/Light mode integrado com o Naive UI.
    - [ ] Remover dependências do PrimeVue do `package.json`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

## Phase 2: Componentes Compartilhados e Layout Principal
- [ ] **Task: Refatoração de Componentes Shared**
    - [ ] Refatorar componentes em `src/shared/components/` (Botões, Cards, Modais, Inputs).
    - [ ] Implementar efeitos de "Glassmorphism" e "Glow" no layout principal.
    - [ ] Atualizar o `MainLayout` para usar o sistema de menus e navegação do Naive UI.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

## Phase 3: Refatoração dos Módulos Core (Auth e Dashboard)
- [ ] **Task: Módulo de Autenticação (Auth)**
    - [ ] Refatorar telas de Login e Cadastro.
    - [ ] Atualizar modais de configurações de perfil.
- [ ] **Task: Módulo Dashboard**
    - [ ] Refatorar os cards de resumo e gráficos utilizando componentes Naive UI.
    - [ ] Garantir que os gráficos (Chart.js) se integrem visualmente ao novo tema.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**

## Phase 4: Refatoração dos Módulos Operacionais (Transações e Orçamentos)
- [ ] **Task: Módulo de Transações**
    - [ ] Refatorar listagem (Tabelas), formulários de inserção e filtros.
- [ ] **Task: Módulo de Orçamentos**
    - [ ] Refatorar barras de progresso e visualização de categorias.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)**

## Phase 5: Finalização e Polimento Geral
- [ ] **Task: Refatoração dos Módulos Restantes**
    - [ ] Calendário, Metas, Empréstimos, Assinaturas e Relatórios.
- [ ] **Task: Limpeza e Validação Final**
    - [ ] Remover todos os imports residuais do PrimeVue.
    - [ ] Garantir que o Dark Mode esteja impecável em todas as telas.
    - [ ] Realizar build final e testes de regressão em todos os fluxos.
- [ ] **Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)**
