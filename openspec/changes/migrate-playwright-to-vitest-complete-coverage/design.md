## Context

### Estado Atual

O projeto DIVI possui uma configuração híbrida de testes:

**Vitest (Unit Tests)**
- Configurado em `vitest.config.ts`
- Usa `@vitest/coverage-v8` para cobertura
- Scripts: `test:unit`
- Localização: `src/__tests__/`

**Playwright (E2E Tests)**
- Configurado em `playwright.config.ts`
- Localização: `playwright-report/`
- Scripts: `test:e2e`
- Dependências: `@playwright/test`, `eslint-plugin-playwright`

**Problemas Identificados**
1. Testes existentes são mínimos (apenas 5 arquivos de teste básicos)
2. Cobertura atual está abaixo de 20%
3. Não há estrutura padronizada por módulos
4. Playwright adiciona complexidade sem benefícios proporcionais para o escopo atual

### Arquitetura do Projeto

O projeto segue arquitetura modular com 11 módulos principais:
- activity-log, auth, budgets, dashboard, expenses, investments, reports, savings, tags, transactions
- shared: componentes e utilitários compartilhados
- core: infraestrutura central (DI, errors, migrations)
- infrastructure: camada de persistência e criptografia

## Goals / Non-Goals

**Goals:**
1. **Unificar stack de testes** em Vitest exclusivo
2. **Alcançar 80% de cobertura** em toda a base de código
3. **Remover completamente** Playwright e suas dependências
4. **Padronizar estrutura** de testes por módulo seguindo TDD
5. **Configurar cobertura obrigatória** no CI/CD (falha abaixo de 80%)

**Non-Goals:**
1. Não migrar testes E2E existentes (não há testes E2E significativos)
2. Não modificar funcionalidade de negócio (apenas adicionar testes)
3. Não alterar arquitetura do projeto (apenas organizar testes)
4. Não criar testes de performance ou carga

## Decisions

### 1. Abordagem TDD (Test Driven Development)

**Decisão:** Adotar TDD completo para todos os novos testes.

**Rationale:**
- Garante que testes são escritos antes/paralelo ao código
- Melhora qualidade do design do código
- Facilita refactoring com segurança
- Documentação viva do comportamento esperado

**Fluxo TDD por Módulo:**
```
1. Identificar componentes/serviços do módulo
2. Escrever teste falhando (Red)
3. Implementar código mínimo (Green)
4. Refactor mantendo testes verdes (Refactor)
5. Repetir até cobertura ≥80%
```

### 2. Estrutura de Diretórios de Testes

**Decisão:** Co-localizar testes próximos ao código (não em diretório separado no topo).

**Rationale:**
- Facilita navegação entre código e testes
- Encoraja manutenção conjunta
- Evita import paths complexos
- Padrão comum na comunidade Vue/Vitest

**Estrutura por Módulo:**
```
modules/{module}/
├── __tests__/
│   ├── unit/           # Testes unitários puros
│   ├── integration/    # Testes de integração entre partes
│   └── ui/             # Testes de componentes Vue
│       ├── components/
│       └── views/
├── services/
├── ui/
└── ...
```

### 3. Configuração de Cobertura

**Decisão:** Configurar `@vitest/coverage-v8` com thresholds obrigatórios.

**Configuração:**
```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  exclude: [
    'node_modules/',
    'src/__tests__/',
    '**/*.d.ts',
    '**/*.spec.ts',
    'src/main.ts',
    'src/sw.ts'
  ]
}
```

### 4. Mock Strategy

**Decisão:** Usar mocks centralizados e fáctory functions.

**Estratégia:**
- **Mocar:** Serviços externos (Supabase), storage, crypto
- **Não mocar:** Lógica de negócio pura, utilitários internos
- **Fáctory:** Criar factories para entidades comuns

**Localização de Mocks:**
- `src/__tests__/mocks/` - Mocks globais reutilizáveis
- `modules/{module}/__tests__/mocks/` - Mocks específicos do módulo

### 5. Remoção do Playwright

**Decisão:** Remover completamente sem migração de testes.

**Rationale:**
- Não há testes E2E valiosos para migrar
- Playwright adiciona ~50MB de dependências
- Vitest com jsdom cobre necessidades de UI testing
- Simplifica CI/CD

**Passos de Remoção:**
1. Remover dependências do `package.json`
2. Deletar `playwright.config.ts`
3. Remover script `test:e2e`
4. Deletar diretório `playwright-report/`
5. Remover plugin ESLint relacionado

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Cobertura 80% pode ser rigorosa demais** | Alto | Começar com 60%, aumentar gradualmente; focar em código crítico primeiro |
| **Tempo de implementação longo** | Médio | Dividir em fases por módulos; priorizar módulos core (auth, transactions) |
| **Mocks complexos para Supabase** | Médio | Criar mock utilities reutilizáveis; usar fake-indexeddb já presente |
| **Refatoração em massa pode introduzir bugs** | Alto | Fazer commits atômicos; manter testes verdes; revisão cuidadosa |
| **Resistência da equipe a TDD** | Baixo | Documentar benefícios; demonstrar na prática; manter flexibilidade inicial |

**Trade-offs Aceitos:**
1. **Vitest vs Playwright:** Perder capacidade de testar em navegadores reais, mas ganhar simplicidade
2. **Co-localização vs Diretório único:** Maior dispersão de arquivos, mas melhor organização
3. **Cobertura 80% vs 100%:** 80% é suficiente para garantir qualidade sem diminishing returns

## Migration Plan

### Fase 1: Configuração Base (1-2 dias)
1. Atualizar `vitest.config.ts` com thresholds
2. Configurar `knip.json` para ignorar padrões de teste
3. Criar estrutura base de diretórios
4. Preparar mocks globais

### Fase 2: Remoção Playwright (0.5 dia)
1. Remover dependências do `package.json`
2. Deletar arquivos de configuração
3. Atualizar scripts
4. Verificar build passa

### Fase 3: Testes por Módulo (2-3 semanas)
Prioridade:
1. **Core/Infrastructure** (fundamentos)
2. **Auth** (segurança crítica)
3. **Transactions** (dados financeiros)
4. **Budgets/Expenses** (funcionalidade principal)
5. **Demais módulos** (features específicas)
6. **Shared components** (UI reutilizável)

### Fase 4: CI/CD e Finalização (1-2 dias)
1. Atualizar pipeline de CI
2. Configurar falha em cobertura <80%
3. Documentar processo TDD
4. Revisão final e merge

### Rollback Strategy
- Manter branch `feature/vitest-migration` separada até aprovação
- Playwright pode ser reinstalado rapidamente se necessário
- Commits atômicos permitem revert específico

## Open Questions

1. **Estratégia de mocks para Supabase:** Usar mock manual ou @supabase/supabase-js mock utilities?
2. **Testes de componentes Vue:** Usar `mount` ou `shallowMount` como padrão?
3. **Snapshot testing:** Adotar para componentes UI ou evitar fragilidade?
4. **Testes paralelos:** Configurar workers no Vitest para speed?
