## ADDED Requirements

### Requirement: formatCurrency SHALL have a single implementation
The application SHALL export `formatCurrency` from exactly one module (`src/shared/utils/formatters.ts`). The file `src/shared/utils/currency-formatter.ts` SHALL be removed. All consumers SHALL import `formatCurrency` and `formatCurrencySign` from `formatters.ts`.

#### Scenario: currency-formatter.ts is removed
- **WHEN** the project is searched for `currency-formatter.ts`
- **THEN** the file does not exist

#### Scenario: All formatCurrency consumers import from formatters.ts
- **WHEN** the project is searched for imports of `formatCurrency`
- **THEN** all imports resolve to `src/shared/utils/formatters.ts`

### Requirement: BigInt conversion SHALL be consolidated in BigIntAdapter
The methods `toMinorUnits` and `fromMinorUnits` SHALL exist as static methods on `BigIntAdapter` in `src/shared/utils/bigint-adapter.ts`. The duplicate implementations in `TransactionService` SHALL be removed. `TransactionService` SHALL delegate to `BigIntAdapter.toMinorUnits` and `BigIntAdapter.fromMinorUnits`.

#### Scenario: TransactionService uses BigIntAdapter for conversion
- **WHEN** `TransactionService` needs to convert a decimal value to minor units
- **THEN** it calls `BigIntAdapter.toMinorUnits(value)` instead of a local implementation

#### Scenario: BigIntAdapter exposes toMinorUnits and fromMinorUnits
- **WHEN** `BigIntAdapter.toMinorUnits(123.45)` is called
- **THEN** it returns `12345n`

#### Scenario: BigIntAdapter fromMinorUnits converts correctly
- **WHEN** `BigIntAdapter.fromMinorUnits(12345n)` is called
- **THEN** it returns `"123,45"` (pt-BR formatted string)

### Requirement: Error hierarchy SHALL be unified under AppError
The application SHALL use a single error hierarchy rooted at `AppError` in `src/core/errors/`. The file `src/shared/domain/errors/InfrastructureError.ts` SHALL be removed. Any code that previously used `InfrastructureError` SHALL use `AppError` or an appropriate subclass instead.

#### Scenario: InfrastructureError.ts is removed
- **WHEN** the project is searched for `InfrastructureError.ts`
- **THEN** the file does not exist in `src/shared/domain/errors/`

#### Scenario: No imports of InfrastructureError remain
- **WHEN** the project is searched for imports of `InfrastructureError`
- **THEN** no results are found

### Requirement: DI tokens SHALL be centralized in DI_TOKENS
All DI registrations SHALL use tokens from the `DI_TOKENS` constant. String literals for DI tokens (e.g., `'VaultTransactionRepository'`, `'LedgerTransactionService'`) SHALL be added to `DI_TOKENS` and referenced from there.

#### Scenario: VaultTransactionRepository uses DI_TOKENS
- **WHEN** `VaultTransactionRepository` is registered in the DI container
- **THEN** it uses `DI_TOKENS.VaultTransactionRepository` instead of the raw string `'VaultTransactionRepository'`

#### Scenario: LedgerTransactionService uses DI_TOKENS
- **WHEN** `LedgerTransactionService` is registered in the DI container
- **THEN** it uses `DI_TOKENS.LedgerTransactionService` instead of the raw string `'LedgerTransactionService'`

### Requirement: AssetLoader.getFallback SHALL be simplified
The `getFallback` method SHALL return `'/assets/placeholder.svg'` unconditionally. The `type` parameter SHALL be removed as all branches return the same value.

#### Scenario: getFallback returns placeholder without type parameter
- **WHEN** `assetLoader.getFallback()` is called
- **THEN** it returns `'/assets/placeholder.svg'`

#### Scenario: Existing callers with type parameter still work
- **WHEN** existing code that passed a type parameter is updated to call `getFallback()` without arguments
- **THEN** the behavior is identical to before

### Requirement: Remoção de comentários JSDoc redundantes
Funções com nomes autoexplicativos SHALL não ter comentários JSDoc que apenas repetem o nome.

#### Scenario: Validators sem comentários redundantes
- **GIVEN** funções em `validators.ts`
- **WHEN** analisadas após refatoração
- **THEN** não possuem comentários JSDoc que apenas descrevem o "quê"
- **AND** mantêm comentários que explicam o "porquê" (regras de negócio, algoritmos)

#### Scenario: Parsers sem comentários redundantes
- **GIVEN** funções em `parsers.ts` como `parseDate`, `parseNumber`
- **WHEN** analisadas após refatoração
- **THEN** não possuem blocos JSDoc
- **AND** comportamento permanece idêntico

#### Scenario: Formatters mantêm apenas comentários de contexto
- **GIVEN** funções em `formatters.ts`
- **WHEN** analisadas após refatoração
- **THEN** apenas comentários explicando convenções brasileiras (pt-BR) são mantidos
- **AND** comentários como "Formats a number as BRL currency" são removidos

### Requirement: Código mais denso sem perder legibilidade
Funções SHALL ser expressivas com mínimo de linhas necessárias.

#### Scenario: Early returns em vez de nesting
- **GIVEN** funções com múltiplos níveis de if/else
- **WHEN** refatoradas
- **THEN** usam early returns (guard clauses)
- **AND** nesting não excede 2 níveis

#### Scenario: Expressões declarativas preferidas
- **GIVEN** loops imperativos que podem ser substituídos
- **WHEN** performance não é impactada
- **THEN** usam métodos de array (filter, map, reduce)
- **AND** código é mais denso e legível

#### Scenario: Funções pequenas e focadas
- **GIVEN** funções com mais de 20 linhas
- **WHEN** analisadas
- **THEN** são candidatas à decomposição
- **AND** após refatoração têm menos de 20 linhas

### Requirement: Preservação de comportamento
Todas as mudanças de densificação SHALL preservar comportamento observável idêntico.

#### Scenario: Testes existentes passam
- **GIVEN** suite de testes existente para utilities
- **WHEN** `npm run test:unit` é executado
- **THEN** 100% dos testes passam
- **AND** nenhum teste é modificado (prova de que comportamento é idêntico)

#### Scenario: Assinaturas de função preservadas
- **GIVEN** exports públicos de utilities
- **WHEN** analisados após refatoração
- **THEN** todas as assinaturas de função permanecem idênticas
- **AND** nomes de parâmetros são mantidos para compatibilidade

#### Scenario: Valores de retorno idênticos
- **GIVEN** inputs de teste para funções refatoradas
- **WHEN** funções são chamadas
- **THEN** retornam exatamente os mesmos valores
- **AND** edge cases são preservados
