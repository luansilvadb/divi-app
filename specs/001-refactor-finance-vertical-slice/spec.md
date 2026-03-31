# Feature Specification: Refatoração do Módulo Finance para Fatiamento Vertical

**Feature Branch**: `001-refactor-finance-vertical-slice`  
**Created**: 30/03/2026
**Status**: Draft  
**Input**: User description: "Refatore o módulo monolítico 'finance' para uma arquitetura de fatiamento vertical. Desacople a UI e crie um módulo independente para cada tela dentro de src/modules/, respeitando estritamente a divisão de responsabilidades entre as camadas domain, application, infrastructure e ui, conforme a estrutura de diretórios fornecida. src/ ├── core/ # Infraestrutura global e configurações base │ ├── config/ # Configurações do Vite, Supabase, etc. │ ├── di/ # Registro global de Injeção de Dependência (DI) │ └── theme/ # Configurações globais de tema (Tailwindcss) │ ├── shared/ # Recursos compartilhados e UI Genérica │ ├── components/ # Componentes base seguindo Atomic Design │ │ ├── atoms/ # Botões, Inputs, Tipografia │ │ ├── molecules/ # Formulários simples, Cards de informação │ │ ├── organisms/ # Cabeçalhos, Rodapés, Menus complexos │ │ └── templates/ # Estruturas de layout de página │ ├── composables/ # Hooks Vue/Composition API genéricos │ └── utils/ # Funções utilitárias globais │ └── modules/ # Fatiamento vertical por features de negócio ├── example_feature/ # Exemplo de um módulo autossuficiente │ ├── domain/ # Fonte da verdade do negócio │ │ ├── entities/ # Modelos de domínio │ │ └── contracts/ # Interfaces de repositórios e serviços │ │ │ ├── application/ # Orquestração e estado │ │ ├── useCases/ # Lógica de aplicação (Casos de uso) │ │ └── stores/ # Gerenciamento de estado específico (Pinia) │ │ │ ├── infrastructure/ # Acesso a dados e integrações │ │ └── repositories/ # Implementação dos contratos (Supabase SDK/RPC) │ │ │ └── ui/ # Interface do usuário específica da feature │ ├── components/ # Componentes que pertencem apenas a esta feature │ └── views/ # Páginas/Telas principais da feature │ └── another_feature/ # Estrutura idêntica para outras features ├── domain/ ├── application/ ├── infrastructure/ └── ui/"

## Clarifications

### Session 2026-03-30

- Q: Qual o padrão de arquitetura preferido para comunicação entre módulos? → A: Um módulo consome o `Service` ou `UseCase` de outro via Injeção de Dependência na camada `application`.
- Q: Como as dependências de infraestrutura (Supabase) devem ser registradas no contêiner de DI? → A: Registro centralizado no `src/core/di` durante a inicialização da aplicação.
- Q: Os módulos devem implementar seus próprios componentes de "Loading" e "Error" ou consumir componentes padronizados? → A: Consumo obrigatório de componentes base (Skeleton, BaseError) de `src/shared/components`.
- Q: Qual o tipo de teste deve ser mandatório para garantir a paridade funcional após a refatoração? → A: Testes de Unidade nos `UseCases` e Testes de Componente nas `Views`.
- Q: Como o sistema deve lidar com falhas de injeção de dependência se um contrato não estiver registrado? → A: Erro fatal (Exception) imediato ao tentar resolver uma dependência inexistente.
- Q: Qual a abordagem para orquestrar dados de múltiplos módulos em uma View (ex: Dashboard)? → A: O módulo consumidor possui seu próprio `UseCase` ou `Store` que coordena as dependências dos outros módulos.
- Q: Como a lógica de sincronização (Dexie/Supabase) deve ser organizada? → A: Cada repositório de infraestrutura gerencia sua própria lógica de sincronização interna.
- Q: Onde deve residir a lógica de domínio compartilhada entre submódulos de finanças? → A: Submódulo `src/modules/finance/shared` para contratos e utilitários específicos do domínio financeiro.
- Q: Como as views dos submódulos devem estruturar seu layout visual? → A: Uso obrigatório de Templates padronizados definidos em `src/shared/components/templates`.
- Q: Qual deve ser a estrutura final dos diretórios para as funcionalidades que hoje compõem o módulo financeiro? → A: Estrutura Plana: Módulos diretamente em `src/modules/` (ex: `src/modules/transactions`).
- Q: Onde devem residir as interfaces de domínio e entidades que são compartilhadas por mais de um módulo de negócio? → A: Centralizadas em `src/shared/domain` (ex: `src/shared/domain/entities`).
- Q: Qual a estratégia para mover os componentes de UI que hoje são locais ao módulo `finance`? → A: Mover para a pasta `ui/components` de cada novo módulo independente.
- Q: Devemos usar um prefixo nos nomes das pastas dos módulos (ex: `finance-transactions`)? → A: Sem prefixo. Nomes limpos e idiomáticos (ex: `transactions`, `budgets`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegação e Acesso às Funcionalidades de Finanças (Priority: P1)

O usuário deve conseguir acessar cada tela específica de finanças (Dashboard, Transações, Orçamentos, Metas, Empréstimos, Assinaturas, Calendário, Relatórios, Log de Atividade) de forma independente, sem que uma tela dependa de componentes ou lógica de outra funcionalidade de finanças de forma direta.

**Why this priority**: Crucial para manter a paridade funcional após a refatoração. O usuário final não deve perceber mudanças no comportamento das telas, apenas na organização interna do código.

**Independent Test**: Cada tela pode ser carregada e testada de forma isolada, garantindo que os dados correspondentes sejam exibidos corretamente e as ações de usuário (como salvar ou deletar) funcionem conforme o esperado.

**Acceptance Scenarios**:

1. **Given** o usuário está logado, **When** clica em "Dashboard", **Then** vê o dashboard com gráficos patrimoniais e painéis de resumo.
2. **Given** o usuário está na tela de "Transações", **When** adiciona uma nova transação, **Then** a transação é persistida e exibida na lista.
3. **Given** o usuário acessa o "Calendário", **When** navega pelos meses, **Then** visualiza os eventos financeiros corretamente.

---

### User Story 2 - Isolamento de Lógica e Contratos (Priority: P2)

Como desenvolvedor, desejo que cada sub-módulo (ex: Orçamentos, Empréstimos) tenha suas próprias entidades, casos de uso e contratos de repositório, facilitando a manutenção e testes sem efeitos colaterais em outros módulos.

**Why this priority**: Objetivo central da refatoração arquitetural para garantir escalabilidade e manutenibilidade.

**Independent Test**: Modificar a implementação de infraestrutura de um módulo (ex: Loans) e verificar que o módulo de Budgets continua funcionando sem alterações ou erros de compilação relacionados.

**Acceptance Scenarios**:

1. **Given** uma alteração na implementação do `LoanRepository`, **When** a aplicação é compilada, **Then** apenas as funcionalidades de empréstimos são impactadas.

---

### Edge Cases

- **Comunicação Cross-Módulo**: Quando um módulo (ex: Dashboard) depende de dados de outros, ele DEVE utilizar um agregador (UseCase ou Store local) que consome os contratos dos outros módulos via DI.
- **Consistência de Estados UI**: Todos os módulos DEVEM usar os componentes padronizados de carregamento e erro para garantir que a interface não pareça fragmentada durante falhas de rede ou carregamento.
- **Falha de DI**: Tentativas de resolver contratos não registrados DEVEM resultar em erro fatal (Crash-fast) para garantir visibilidade de erros de configuração durante o desenvolvimento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE possuir módulos independentes para cada funcionalidade de negócio diretamente em `src/modules/[feature]/` sem prefixos (ex: `transactions`, `budgets`, `dashboard`).
- **FR-002**: Cada módulo DEVE seguir rigorosamente a separação de camadas: `domain` (entidades e contratos), `application` (stores e casos de uso), `infrastructure` (implementações concreta de repositório) e `ui` (componentes e views).
- **FR-003**: O sistema DEVE utilizar Injeção de Dependência (DI) centralizada em `src/core/di` para registrar e resolver as implementações dos contratos de repositório durante a inicialização.
- **FR-004**: Componentes genéricos (átomos, moléculas, organismos) DEVEM ser movidos para `src/shared/components`.
- **FR-005**: Todas as funcionalidades existentes no módulo monolítico `finance` DEVEM ser mantidas inalteradas em termos de comportamento para o usuário final.
- **FR-006**: Os módulos DEVEM obrigatoriamente consumir componentes base (ex: Skeleton, BaseError) de `src/shared/components` para estados de carregamento e erro.
- **FR-007**: Cada módulo migrado DEVE possuir testes de unidade para seus `UseCases` e testes de componente para suas `Views`, garantindo a cobertura das lógicas migradas.
- **FR-008**: O sistema DEVE centralizar entidades e contratos de domínio compartilhados no diretório `src/shared/domain`.
- **FR-009**: Todas as Views de módulos DEVEM utilizar templates padronizados de `src/shared/components/templates`.
- **FR-010**: Componentes de UI específicos de uma funcionalidade DEVEM residir na pasta `ui/components` de seu respectivo módulo.

### Key Entities

- **Transaction**: Representa um movimento financeiro (receita/despesa).
- **Budget**: Define limites financeiros por categoria ou período.
- **Goal**: Representa objetivos financeiros de longo prazo.
- **Loan**: Registro de dívidas ou créditos com terceiros.
- **Subscription**: Pagamentos recorrentes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O diretório `src/modules/finance` é completamente removido.
- **SC-002**: Zero importações diretas de classes de infraestrutura (SDK do Supabase) nas camadas de UI e Application (verificável via linting).
- **SC-003**: Redução de acoplamento circular entre funcionalidades de negócio para zero.
- **SC-004**: Todas as dependências externas de cada módulo são declaradas via interfaces/contratos em `domain/`.
- **SC-005**: Passagem de 100% dos testes de unidade e de componente após a migração de cada módulo.

## Assumptions

- O Supabase continuará sendo o provedor de infraestrutura principal para persistência de dados.
- O sistema de Injeção de Dependência global (`src/core/di`) será utilizado para prover as instâncias dos repositórios.
- Não haverá adição de novas regras de negócio durante esta refatoração.
- O design system (TailwindCSS) permanecerá o mesmo para as novas visualizações.
