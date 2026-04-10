# Plan: Design System Refactor (PrimeVue + Tailwind PrimeUI)

## Fase 1: Análise e Mapeamento
- [x] Tarefa: Mapear todas as ocorrências de tokens customizados (`text-text-primary`, `bg-bg-main`, `bg-primary-main`, etc.) em arquivos `.vue` e `.ts`.
- [x] Tarefa: Identificar cores hardcoded (`dark:bg-[#...]`, `bg-black/`, etc.) que podem ser substituídas por tokens do preset.
- [x] Tarefa: Conductor - User Manual Verification 'Fase 1: Análise e Mapeamento' (Protocol in workflow.md)

## Fase 2: Configuração da SSoT (Fonte Única de Verdade)
- [x] Tarefa: Revisar o `diviPreset.ts` para garantir que cobre todos os requisitos semânticos de cores identificados. 855e8ad
- [x] Tarefa: Atualizar `main.css` (@theme) para remover os blocos de re-exportação de tokens antigos. e75f782
- [x] Tarefa: Limpar `theme.css` e deixar apenas a paleta base (tokens de cor hex). e75f782
- [x] Tarefa: Conductor - User Manual Verification 'Fase 2: Configuração da SSoT' (Protocol in workflow.md)

## Fase 3: Migração de Componentes (Bulk Refactor)
- [x] Tarefa: Substituir classes customizadas por equivalentes `tailwindcss-primeui` seguindo a Tabela de Migração definida no diagnóstico. 958d593
- [x] Tarefa: Converter cores hardcoded para classes semânticas. 958d593
- [x] Tarefa: Corrigir problemas de especificidade em componentes nativos PrimeVue (Dialog, Select, Button). 958d593
- [x] Tarefa: Conductor - User Manual Verification 'Fase 3: Migração de Componentes' (Protocol in workflow.md)

## Fase 4: Validação e Testes
- [x] Tarefa: Verificar consistência visual nos temas Light e Dark. 1065b6d
- [x] Tarefa: Executar testes de UI para garantir que não houve quebra de layout ou perda de estilos. 1065b6d
- [x] Tarefa: Conductor - User Manual Verification 'Fase 4: Validação e Testes' (Protocol in workflow.md)
