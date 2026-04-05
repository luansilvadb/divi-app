# Track Specification: Melhore a SearchBar

## Overview
Redesenhar a barra de busca na tela de Transações para atingir uma estética minimalista, limpa e moderna, alinhada com as tendências atuais de UI, mantendo a usabilidade e eficiência.

## Goals
1. **Modernização Visual:** Transição para um estilo com linhas limpas, bom uso de espaço em branco (whitespace) e tipografia moderna. Remoção de elementos visuais desnecessários (clutter).
2. **UX Aprimorada:** Melhorar o fluxo de interação ao buscar, filtrar e selecionar sugestões.
3. **Responsividade:** Garantir que o novo design seja totalmente responsivo e ofereça uma excelente experiência em dispositivos móveis.

## Functional Requirements
- **Campo de Busca:**
  - Design limpo e discreto.
  - Estado de foco (focus) visualmente claro e elegante.
  - Ícone de busca integrado e minimalista.
  - Botão de limpar busca (aparece apenas quando há texto).
- **Sugestões/Dropdown:**
  - Design moderno para a lista de sugestões e histórico.
  - Animações suaves de abrir/fechar.
  - Distinção clara entre tipos de sugestões (ex: histórico vs. categorias).
- **Filtros:**
  - Os filtros avançados devem ser acessíveis mas não poluir a visão principal (ex: via botão distinto que expande uma seção limpa ou abre um drawer).

## Non-Functional Requirements
- **Performance:** Animações devem ser suaves e não impactar a performance percebida.
- **Acessibilidade:** Manter ou melhorar a navegação por teclado e suporte a leitores de tela.
- **Consistência:** Utilizar o sistema de design existente (tokens de cores, espaçamento), estendendo-o se necessário para o novo visual.

## Out of Scope
- Alterações na lógica de busca ou backend.
- Adição de novas fontes de dados para a busca.

## Success Criteria
- Design é aprovado como "minimalista, limpo e moderno".
- Toda funcionalidade existente de busca operando corretamente.
- Visualização mobile otimizada.
