<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Feature-Driven Clean Architecture (Vertical Slicing)
  - [PRINCIPLE_2_NAME] → II. Domínio como Fonte da Verdade (Contratos)
  - [PRINCIPLE_3_NAME] → III. Infraestrutura e Padrão Repositório
  - [PRINCIPLE_4_NAME] → IV. Injeção de Dependência (DI) e Acoplamento Zero
  - [PRINCIPLE_5_NAME] → V. Atomic Design e Shared Resources
- Added sections:
  - Tecnologias e Padrões de Implementação
  - Fluxo de Desenvolvimento e Qualidade
- Removed sections: None (Placeholder sections replaced)
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# Arquitetura Divi Constitution

## Core Principles

### I. Feature-Driven Clean Architecture (Vertical Slicing)

O projeto é fatiado primariamente por domínios/features de negócio em `src/modules/<feature>/`. Internamente, cada feature é autossuficiente e possui suas próprias camadas estritas de Clean Arch: `domain` (entidades e contratos), `application` (casos de uso/stores), `infrastructure` (implementações) e `ui` (componentes específicos).
**Rationale**: Garante isolamento total, facilita a manutenção por IAs e permite que cada feature seja testada e evoluída sem afetar o restante do sistema (Zero Handoffs Cognitivos).

### II. Domínio como Fonte da Verdade (Contratos)

A camada `domain` dita as regras de negócio e os contratos (Interfaces). Nenhuma camada externa deve influenciar o domínio. Os Repositórios são definidos como interfaces no domínio.
**Rationale**: Desacopla a lógica de negócio das ferramentas externas (como Supabase), permitindo trocas tecnológicas com impacto mínimo.

### III. Infraestrutura e Padrão Repositório

A camada `infrastructure` implementa o acesso a dados utilizando o SDK do Supabase ou chamadas RPC. É estritamente proibido o uso de camadas horizontais globais como `src/services` na raiz para lógica de feature.
**Rationale**: Mantém a coesão da feature e garante que detalhes de implementação de persistência fiquem confinados à infraestrutura.

### IV. Injeção de Dependência (DI) e Acoplamento Zero

A Injeção de Dependência (DI) é usada para conectar as camadas, eliminando a necessidade de padrões complexos como Unit of Work no frontend. As dependências são resolvidas em tempo de execução/configuração global.
**Rationale**: Facilita a criação de mocks para testes unitários e garante que as camadas não dependam de implementações concretas umas das outras.

### V. Atomic Design e Shared Resources

Componentes genéricos e reutilizáveis devem seguir o Atomic Design e residir em `src/shared/`. A infraestrutura global (registro de DI, temas, configurações base) reside em `src/core/`.
**Rationale**: Promove o reuso de código UI e organiza o que é transversal ao sistema de forma clara e separada das regras de negócio.

## Tecnologias e Padrões de Implementação

### Stack Tecnológica Base

O projeto deve utilizar obrigatoriamente: Vue 3 (Composition API), TypeScript (Strict Mode), Pinia (State Management), Tailwindcss, Supabase (Backend-as-a-Service) e Vite (Build Tool).
**Rationale**: Define um ambiente previsível e de alto desempenho, alinhado com as melhores práticas atuais do ecossistema Vue.

## Fluxo de Desenvolvimento e Qualidade

### Regra Estrutural de Ouro

É estritamente proibido criar pastas de serviços ou repositórios globais que atendam múltiplas features de forma genérica se a lógica pertencer a um domínio específico. O isolamento deve ser mantido em `src/modules/`.
**Rationale**: Evita o "código espaguete" e o acoplamento excessivo que dificulta a refatoração e o entendimento por agentes de IA.

## Governance

Esta constituição prevalece sobre qualquer prática ad-hoc. Mudanças nos princípios exigem atualização deste documento e incremento de versão semântica. O não cumprimento dos princípios em PRs é motivo para rejeição imediata.

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
