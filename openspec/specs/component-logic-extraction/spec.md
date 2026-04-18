## ADDED Requirements

### Requirement: Lógica de formulário extraída de TransactionFormContent
O componente `TransactionFormContent.vue` SHALL ter sua lógica de negócio extraída para serviços especializados.

#### Scenario: AutoCreateService gerencia criação de categorias/wallets
- **GIVEN** `AutoCreateService` implementado
- **WHEN** `resolveCategory(categoryId, categories)` é chamado
- **THEN** retorna ID existente ou cria nova categoria se não encontrada
- **AND** criação é transparente para o componente

#### Scenario: AutoCreateService para wallets
- **GIVEN** `AutoCreateService` com método `resolveWallet`
- **WHEN** `resolveWallet(walletId, wallets)` é chamado
- **THEN** retorna ID existente ou cria nova wallet se não encontrada
- **AND** mantém comportamento atual de criação automática

#### Scenario: TransactionFormContent delega para serviços
- **GIVEN** `AutoCreateService` injetado no componente
- **WHEN** usuário submete formulário com nova categoria
- **THEN** componente chama `autoCreateService.resolveCategory()`
- **AND** não contém lógica de criação de categoria inline

#### Scenario: Função handleSubmit reduzida
- **GIVEN** refatoração concluída
- **WHEN** `handleSubmit` em `TransactionFormContent.vue` é analisada
- **THEN** contém menos de 30 linhas de código
- **AND** possui apenas 1 nível de abstração (coordenação de serviços)

#### Scenario: Validação extraída para composable
- **GIVEN** `useTransactionValidation()` composable criado
- **WHEN** formulário é validado
- **THEN** regras de validação estão no composable
- **AND** componente apenas chama `validate(formData)`

### Requirement: Eliminação de duplicação em componentes
Lógica comum entre componentes SHALL ser extraída para composables reutilizáveis.

#### Scenario: useEntityResolver composable
- **GIVEN** múltiplos formulários precisam resolver entidades por nome/ID
- **WHEN** `useEntityResolver()` é usado
- **THEN** fornece métodos genéricos para busca/criação de entidades
- **AND** elimina duplicação entre formulários

#### Scenario: useFormSubmit composable
- **GIVEN** padrão comum de submit (validar → transformar → persistir → feedback)
- **WHEN** `useFormSubmit(submitFn, options)` é usado
- **THEN** gerencia estado de loading, erros, e notificações automaticamente
