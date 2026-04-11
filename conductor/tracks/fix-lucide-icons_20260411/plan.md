# Implementation Plan: Fix Lucide Icons Rendering

Este plano detalha a correção do problema de renderização dos ícones Lucide integrados via UnoCSS.

## Phase 1: Diagnóstico e Pesquisa
- [ ] **Task: Investigar configuração do UnoCSS e Iconify**
    - [ ] Verificar `uno.config.ts` ou `vite.config.ts`.
    - [ ] Auditar padrões de uso dos ícones nos componentes atuais.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

## Phase 2: Correção da Configuração
- [ ] **Task: Corrigir presets e transformers do UnoCSS**
    - [ ] Garantir que o preset `presetIcons` está configurado corretamente para Lucide.
    - [ ] Verificar se as classes dinâmicas (ex: `i-lucide-${icon}`) estão sendo detectadas (safelist se necessário).
- [ ] **Task: Validar instalação de pacotes iconify**
    - [ ] Verificar `@iconify-json/lucide` no `package.json`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

## Phase 3: Verificação e Polimento
- [ ] **Task: Validar renderização em todos os módulos**
    - [ ] Verificar Sidebar, Botões, Cards e Diálogos.
    - [ ] Garantir que o dimensionamento e cores estão corretos.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**
