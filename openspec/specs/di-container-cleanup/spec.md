## ADDED Requirements

### Requirement: DI Container sem logs de debug em produção
O container DI SHALL operar silenciosamente sem console.debug em ambiente de produção.

#### Scenario: Registro de serviço silencioso
- **WHEN** `container.register(token, instance)` é chamado
- **THEN** nenhum output é escrito ao console
- **AND** o serviço é registrado corretamente

#### Scenario: Resolução de serviço silenciosa
- **WHEN** `container.resolve(token)` é chamado
- **THEN** nenhum output é escrito ao console
- **AND** o serviço é retornado corretamente

#### Scenario: Erro de serviço não encontrado mantém mensagem útil
- **WHEN** `container.resolve(tokenInexistente)` é chamado
- **THEN** lança Error com mensagem descritiva `[DI] Service not found: {token}`
- **AND** a mensagem de erro é mantida para debugging

### Requirement: Injeção de dependências para singletons
O sistema SHALL injetar `VaultCryptoManager` e `SyncEngine` via DI em vez de acesso direto a singletons.

#### Scenario: VaultCryptoManager injetável
- **GIVEN** interfaces `IVaultCryptoManager` e `ISyncEngine` definidas
- **WHEN** `container.resolve(DI_TOKENS.VaultCryptoManager)` é chamado
- **THEN** retorna instância implementando `IVaultCryptoManager`
- **AND** não chama `VaultCryptoManager.getInstance()` diretamente

#### Scenario: SyncEngine injetável
- **GIVEN** `ISyncEngine` registrado no container
- **WHEN** `container.resolve(DI_TOKENS.SyncEngine)` é chamado
- **THEN** retorna instância implementando `ISyncEngine`
- **AND** não chama `SyncEngine.getInstance()` diretamente

#### Scenario: AuthStore usa injeção de dependências
- **GIVEN** `authStore.initialize(authService, vaultManager, syncEngine)`
- **WHEN** `purgeAccount` é executado
- **THEN** usa instâncias injetadas em vez de singletons
- **AND** `VaultCryptoManager.getInstance()` não aparece no código

#### Scenario: Testabilidade melhorada
- **GIVEN** mocks de `IVaultCryptoManager` e `ISyncEngine`
- **WHEN** componentes/services usam essas interfaces
- **THEN** mocks podem ser injetados via DI sem alterar código de produção

### Requirement: Lazy initialization para serviços não-críticos
Serviços pesados ou não-críticos no startup SHALL ser registrados com lazy initialization.

#### Scenario: Serviço lazy não é instanciado no startup
- **GIVEN** `PredictionService` marcado como lazy
- **WHEN** aplicação inicia
- **THEN** `PredictionService` não é instanciado
- **AND** é instanciado apenas na primeira resolução

#### Scenario: Serviço crítico é instanciado no startup
- **GIVEN** `AuthService` necessário para proteção de rotas
- **WHEN** aplicação inicia
- **THEN** `AuthService` é instanciado e registrado imediatamente
