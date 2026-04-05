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

O projeto é fatiado primariamente por domínios/features de negócio diretamente em `src/modules/<feature>/` (sem prefixos, nomes limpos e idiomáticos). Internamente, cada feature é autossuficiente e possui suas próprias camadas estritas de Clean Arch: `domain` (entidades e contratos), `application` (casos de uso/stores), `infrastructure` (implementações) e `ui` (componentes específicos e views).
**Rationale**: Garante isolamento total, facilita a manutenção por IAs e permite que cada feature seja testada e evoluída sem afetar o restante do sistema (Zero Handoffs Cognitivos).

### II. Domínio como Fonte da Verdade (Contratos)

A camada `domain` dita as regras de negócio e os contratos (Interfaces). Nenhuma camada externa deve influenciar o domínio. Os Repositórios e Serviços externos são definidos como interfaces puras no domínio.
**Rationale**: Desacopla a lógica de negócio das ferramentas externas, permitindo trocas tecnológicas com impacto mínimo e garantindo a inversão de dependência real.

### III. Infraestrutura, Padrão Repositório e Sincronização

A camada `infrastructure` implementa o acesso a dados utilizando o SDK do Supabase ou chamadas RPC. Cada repositório de infraestrutura deve gerenciar sua própria lógica de sincronização interna (ex: Dexie/Supabase). É estritamente proibido o uso de camadas horizontais globais como `src/services` na raiz para lógica de feature.
**Rationale**: Mantém a coesão da feature, garantindo que detalhes de implementação de persistência e funcionamento offline fiquem confinados à infraestrutura correspondente.

### IV. Injeção de Dependência (DI), Acoplamento Zero e Fail-Fast

A Injeção de Dependência (DI) é usada para conectar as camadas, centralizada no `src/core/di` durante a inicialização da aplicação. O sistema deve aplicar o princípio **Fail-Fast**: tentativas de resolver contratos não registrados devem resultar em um erro fatal (Exception) imediato.
**Rationale**: Facilita a criação de mocks para testes, garante que as camadas não dependam de implementações concretas e dá visibilidade imediata a erros de configuração durante o desenvolvimento, evitando falhas silenciosas em produção.

### V. Atomic Design, Templates e Shared Resources

Componentes genéricos e reutilizáveis devem seguir o Atomic Design e residir em `src/shared/components`. É **obrigatório** o consumo de componentes base (Skeleton, BaseError) para estados de carregamento e erro, bem como o uso de Templates padronizados para o layout visual das Views.
**Rationale**: Promove o reuso de código UI, organiza o que é transversal e garante que a interface não pareça fragmentada durante falhas de rede ou carregamentos.

### VI. Composição e Orquestração Cross-Módulo

Nenhuma View ou Componente de um módulo deve acessar diretamente a lógica de outro. Quando um módulo (ex: Dashboard) depender de dados de múltiplos módulos, ele deve utilizar um agregador próprio (UseCase ou Store local na camada `application`) que consome os contratos dos outros módulos via DI.
**Rationale**: Previne o acoplamento circular entre funcionalidades de negócio, mantendo o isolamento arquitetural das fatias verticais.

---

## Tecnologias e Padrões de Implementação

### Stack Tecnológica Base

O projeto deve utilizar obrigatoriamente: Vue 3 (Composition API), TypeScript (Strict Mode), Pinia (State Management), TailwindCSS, motion.dev, Supabase (Backend-as-a-Service, SDK/RPC) e Vite (Build Tool).
**Rationale**: Define um ambiente previsível e de alto desempenho, alinhado com as melhores práticas atuais do ecossistema Vue.

---

## Fluxo de Desenvolvimento e Qualidade

### Regra Estrutural de Ouro

É estritamente proibido criar pastas de serviços ou repositórios globais que atendam múltiplas features de forma genérica se a lógica pertencer a um domínio específico. O isolamento deve ser mantido em `src/modules/`. Componentes de UI que pertencem a uma feature específica **devem** residir em `src/modules/<feature>/ui/components`.

### Shared Kernel de Domínio

Entidades e contratos de domínio que são intrinsecamente compartilhados por mais de um módulo de negócio devem ser centralizados em `src/shared/domain` (ex: `src/shared/domain/entities`).
**Rationale**: Evita a duplicação de conceitos fundamentais do negócio (DRY) sem quebrar o isolamento dos módulos de aplicação.

### Estratégia de Testes Direcionada (Shift-Left Testing)

É mandatória a implementação de **Testes de Unidade** nos `UseCases` e **Testes de Componente** nas `Views` para garantir a paridade funcional em qualquer refatoração ou nova feature.
**Rationale**: Garante que a lógica de aplicação orquestre corretamente as dependências e que a interface renderize os estados adequadamente, assegurando que o comportamento para o usuário final permaneça intacto.

---

## Governance

Esta constituição prevalece sobre qualquer prática ad-hoc. Mudanças nos princípios exigem atualização deste documento e incremento de versão semântica. O não cumprimento dos princípios, das regras de DI ou da ausência de testes em PRs é motivo para rejeição imediata.

**Version**: 1.1.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-30
