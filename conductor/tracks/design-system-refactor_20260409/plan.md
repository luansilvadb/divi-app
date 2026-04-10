# Plan: Design System Refactor (PrimeVue + Tailwind PrimeUI)

## Fase 1: Análise e Mapeamento
- [x] Tarefa: Mapear todas as ocorrências de tokens customizados (`text-text-primary`, `bg-bg-main`, `bg-primary-main`, etc.) em arquivos `.vue` e `.ts`.
- [x] Tarefa: Identificar cores hardcoded (`dark:bg-[#...]`, `bg-black/`, etc.) que podem ser substituídas por tokens do preset.
- [x] Tarefa: Conductor - User Manual Verification 'Fase 1: Análise e Mapeamento' (Protocol in workflow.md)

## Fase 2: Configuração da SSoT (Fonte Única de Verdade)
- [~] Tarefa: Revisar o `diviPreset.ts` para garantir que cobre todos os requisitos semânticos de cores identificados.
- [ ] Tarefa: Atualizar `main.css` (@theme) para remover os blocos de re-exportação de tokens antigos.
- [ ] Tarefa: Limpar `theme.css` e deixar apenas a paleta base (tokens de cor hex).
- [ ] Tarefa: Conductor - User Manual Verification 'Fase 2: Configuração da SSoT' (Protocol in workflow.md)

## Fase 3: Migração de Componentes (Bulk Refactor)
- [ ] Tarefa: Substituir classes customizadas por equivalentes `tailwindcss-primeui` seguindo a Tabela de Migração definida no diagnóstico.
- [ ] Tarefa: Converter cores hardcoded para classes semânticas.
- [ ] Tarefa: Corrigir problemas de especificidade em componentes nativos PrimeVue (Dialog, Select, Button).
- [ ] Tarefa: Conductor - User Manual Verification 'Fase 3: Migração de Componentes' (Protocol in workflow.md)

## Fase 4: Validação e Testes
- [ ] Tarefa: Verificar consistência visual nos temas Light e Dark.
- [ ] Tarefa: Executar testes de UI para garantir que não houve quebra de layout ou perda de estilos.
- [ ] Tarefa: Conductor - User Manual Verification 'Fase 4: Validação e Testes' (Protocol in workflow.md)
