# Feature Specification: Standardize UI & Design System

**Feature Branch**: `004-standardize-ui-design-system`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "quero que a tela de orçamentos segue referência e fonte da verdade como design system, atualmente ela está perfeita, quero que as outras telas segue o mesmo design system dado ao tela de orçamentos, a tela de orçamentos é o santo graal da ui/ux desenvolvida para esse projeto, para isso ocorrer precisamos organizar o projeto para seja componentes reutilizados para outras telas."

## Clarifications

### Session 2026-03-29
- Q: Como o layout "Santo Graal" (main/side column) deve se comportar em telas pequenas? → A: Empilhamento vertical (side-column abaixo da main-column).
- Q: Como lidar visualmente com erros de carga em componentes (`BaseCard`)? → A: Erro Inline (ícone + mensagem + tentar novamente).
- Q: Como lidar com o carregamento inicial de dados (Loading States)? → A: Skeleton Screens (shimmer effect).
- Q: Como tratar a acessibilidade em componentes interativos? → A: Acessibilidade total (tabindex, focus ring, ativação por teclado).
- Q: Como lidar com a transição entre temas (Claro/Escuro)? → A: Transição suave de 300ms via CSS.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistência Visual em Todas as Telas (Priority: P1)

Como usuário, desejo que todas as telas do aplicativo (Dashboard, Metas, Empréstimos, etc.) tenham a mesma aparência e comportamento da tela de Orçamentos, para que minha experiência seja fluida e intuitiva.

**Why this priority**: É a essência do pedido do usuário. A consistência visual é fundamental para a percepção de qualidade e profissionalismo do app.

**Independent Test**: Pode ser testado navegando entre as telas Dashboard e Metas e verificando se a estrutura de cabeçalho, orbes de fundo e cards de conteúdo seguem o mesmo padrão visual.

**Acceptance Scenarios**:

1. **Given** que estou na tela de Dashboad, **When** visualizo o cabeçalho, **Then** ele deve conter o título, subtítulo e destaque visual idêntico ao padrão da tela de Orçamentos.
2. **Given** que visualizo qualquer lista de itens, **When** observo os cards, **Then** eles devem utilizar o componente `BaseCard` com efeito de glassmorphism e tipografia consistente.

---

### User Story 2 - Reutilização de Componentes de Layout (Priority: P2)

Como desenvolvedor, desejo utilizar componentes de layout padronizados para construir novas telas rapidamente e garantir que futuras alterações de design sejam aplicadas globalmente.

**Why this priority**: Facilita a manutenção e a escalabilidade do projeto, evitando código duplicado e inconsistências.

**Independent Test**: Pode ser verificado ao refatorar uma tela existente (ex: `LoansView.vue`) substituindo estilos locais por componentes `shared`.

**Acceptance Scenarios**:

1. **Given** uma nova tela sendo criada, **When** utilizo `BaseViewHeader` e `BaseBackgroundOrbs`, **Then** a estrutura básica deve se alinhar automaticamente ao "santo graal".
2. **Given** a necessidade de um resumo lateral, **When** utilizo o padrão `side-column` com `BaseCard`, **Then** o espaçamento e alinhamento devem ser idênticos aos de Orçamentos.

---

### User Story 3 - Feedback Visual e Interatividade Padronizada (Priority: P3)

Como usuário, espero que botões, badges e barras de progresso funcionem e pareçam iguais em todo o sistema, especialmente em estados críticos como "estouro de limite".

**Why this priority**: Melhora a usabilidade e reduz a carga cognitiva do usuário.

**Independent Test**: Verificar se o badge de status em Empréstimos usa as mesmas cores semânticas e estilo do badge em Orçamentos.

**Acceptance Scenarios**:

1. **Given** um item com valor excedido, **When** visualizo o alerta, **Then** ele deve usar a cor `var(--color-error-main)` e o ícone de alerta conforme definido no `BudgetCard`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE utilizar o componente `BaseBackgroundOrbs` em todas as visualizações principais para manter a identidade visual.
- **FR-002**: Todas as telas DEVEM implementar o componente `BaseViewHeader` para títulos e ações principais.
- **FR-003**: O layout de conteúdo DEVE seguir o padrão de grid de duas colunas (`main-column` e `side-column`) definido em `BudgetsView.vue` através de classes utilitárias globais.
- **FR-004**: Cards de informação DEVEM ser implementados exclusivamente através do componente `BaseCard`.
- **FR-005**: Itens de resumo e métricas DEVEM utilizar o componente `BaseSummaryItem`.
- **FR-006**: Estados vazios (Empty States) DEVEM seguir o padrão visual de `BudgetsView.vue` (ícone centralizado, título em negrito e subtítulo explicativo).
- **FR-007**: A paleta de cores DEVE ser estritamente baseada nos tokens CSS definidos no Design System (ex: `primary-main`, `text-primary`).
- **FR-008**: O layout DEVE suportar responsividade, empilhando a `side-column` abaixo da `main-column` em dispositivos móveis.
- **FR-009**: Componentes de dados DEVEM implementar estados de erro inline, permitindo a tentativa de recarga sem afetar o layout global.
- **FR-010**: O sistema DEVE utilizar skeleton loaders para estados de carregamento inicial, garantindo estabilidade visual.
- **FR-011**: Todos os componentes interativos DEVEM ser acessíveis por teclado e leitores de tela.
- **FR-012**: O sistema DEVE aplicar uma transição suave de 300ms para mudanças de propriedades visuais (cores de fundo e texto) durante a troca de tema.

### Key Entities *(include if feature involves data)*

- **Design Tokens**: Conjunto de variáveis CSS que definem cores, tipografia e espaçamentos.
- **Shared Components**: Biblioteca de componentes atômicos e moleculares (Atoms, Molecules, Organisms) reutilizáveis.
- **View Templates**: Estruturas de layout padronizadas para as visualizações de módulo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das telas de módulos principais (Finance) utilizam os componentes `shared` de cabeçalho e fundo.
- **SC-002**: Redução de estilos CSS locais (`<style scoped>`) em componentes de visualização em pelo menos 70%, em favor de componentes reutilizáveis e classes Tailwind.
- **SC-003**: O tempo de carregamento visual inicial (First Contentful Paint) DEVE ser inferior a 1.0s em todas as views principais, garantido pelo reúso de componentes compartilhados leves.
- **SC-004**: Garantir que as telas de Dashboard, Metas, Empréstimos e Subscriptions possuam paridade visual total com a tela de Orçamentos em termos de bordas, sombras e efeitos de vidro.

## Assumptions

- **Assunção sobre a Tela de Orçamentos**: Assume-se que a implementação atual de `BudgetsView.vue` já contém todos os elementos de design desejados e não necessita de alterações estruturais imediatas, servindo apenas como molde.
- **Assunção sobre o Tailwind**: Assume-se que o Tailwind CSS está configurado corretamente com os tokens de cores do projeto.
- **Escopo**: O foco inicial é a camada de UI das telas do módulo `finance`. Refatorações profundas na lógica de negócio (application layer) estão fora de escopo para esta tarefa de padronização visual.
