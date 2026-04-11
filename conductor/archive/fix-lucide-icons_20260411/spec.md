# Specification: Fix Lucide Icons Rendering

## Overview
Esta track visa corrigir a falha global de renderização dos ícones Lucide no aplicativo **divi**. Atualmente, os ícones integrados via **UnoCSS + Iconify** não estão sendo exibidos, resultando em espaços vazios na interface do usuário, apesar da ausência de erros no console do navegador.

## Requisitos Funcionais
- **Restauração de Visibilidade:** Garantir que todos os ícones Lucide referenciados no código (ex: `i-lucide-layout-dashboard`) sejam renderizados corretamente.
- **Compatibilidade Naive UI:** Assegurar que os ícones funcionem perfeitamente dentro de componentes do Naive UI (como `NButton`, `NIcon`, `NMenu`) e em elementos HTML puros.
- **Configuração de Build:** Verificar e ajustar a configuração do Vite/UnoCSS para garantir que os ícones sejam incluídos no bundle final.

## Requisitos Não Funcionais
- **Performance:** Manter o carregamento sob demanda (on-demand) dos ícones para evitar aumento desnecessário do tamanho do bundle.
- **Consistência:** Garantir que o estilo visual (tamanho, cor) dos ícones esteja alinhado com o design system LobeHub.

## Critérios de Aceite
- [ ] Ícones visíveis na Sidebar e menus de navegação.
- [ ] Ícones visíveis em botões, cards e diálogos.
- [ ] Comando de build (`npm run build`) gera o CSS necessário para os ícones utilizados.
- [ ] Ausência de avisos ou erros relacionados a ícones no console de desenvolvimento.

## Fora de Escopo
- Substituição da biblioteca de ícones (Lucide).
- Refatoração de lógica de negócio ou estados do Pinia.
- Mudanças estruturais no layout.
