## Why

O projeto DIVI atualmente utiliza **dois frameworks de teste** diferentes: Vitest para testes unitários e Playwright para testes E2E. Esta dualidade cria:

1. **Complexidade de manutenção**: Duas configurações, duas formas de escrever testes, duas dependências
2. **Overhead de CI/CD**: Tempos de build mais longos e mais recursos necessários
3. **Curva de aprendizado**: Desenvolvedores precisam conhecer duas ferramentas diferentes
4. **Inconsistência de cobertura**: Métricas de cobertura separadas dificultam o tracking real de qualidade

A migração para **Vitest exclusivo** simplifica a stack, unifica a cobertura de testes e permite uma abordagem **TDD (Test Driven Development)** mais eficiente, onde todos os testes (unitários, de integração e componentes) utilizam a mesma sintaxe e ferramentas.

## What Changes

### **BREAKING**: Remoção do Playwright

- Remover `@playwright/test` das dependências
- Remover `eslint-plugin-playwright` das dependências
- Remover script `test:e2e` do `package.json`
- Deletar diretório `playwright-report/`
- Deletar arquivos de configuração `playwright.config.ts`

### Nova Configuração de Testes

- **Vitest** será a ferramenta única de teste
- Configurar cobertura completa com `@vitest/coverage-v8`
- Estabelecer mínimo de 80% de cobertura obrigatório
- Criar estrutura organizada de testes seguindo padrões TDD

### Reorganização da Estrutura de Testes

```
src/
├── __tests__/                    # Testes existentes (manter)
│   ├── setup.ts                  # Configuração global
│   ├── global.spec.ts            # Testes globais
│   └── ...
├── core/__tests__/               # Testes de infraestrutura
│   ├── di.spec.ts
│   ├── errors/
│   └── migrations/
├── modules/
│   ├── activity-log/
│   │   └── __tests__/            # Testes do módulo
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── services/         # Testes de serviço (TDD)
│   │   │   ├── ui/
│   │   │   │   ├── components/   # Testes de componentes
│   │   │   │   └── views/        # Testes de views
│   │   │   └── integration/      # Testes de integração
│   ├── budgets/
│   └── ... (demais módulos)
└── shared/
    └── __tests__/                # Testes de componentes compartilhados
        └── components/
```

### Testes a serem criados seguindo TDD

Para cada módulo, seguir o ciclo TDD:
1. **Red**: Escrever teste falhando
2. **Green**: Implementar código mínimo para passar
3. **Refactor**: Melhorar código mantendo testes verdes

## Capabilities

### New Capabilities

- `vitest-complete-setup`: Configuração unificada e otimizada do Vitest com cobertura mínima 80%
- `test-structure-organization`: Estrutura padronizada de organização de testes por módulos
- `module-test-coverage-activity-log`: Cobertura completa de testes para módulo activity-log
- `module-test-coverage-auth`: Cobertura completa de testes para módulo auth (serviços, UI, integração)
- `module-test-coverage-budgets`: Cobertura completa de testes para módulo budgets
- `module-test-coverage-dashboard`: Cobertura completa de testes para módulo dashboard
- `module-test-coverage-expenses`: Cobertura completa de testes para módulo expenses
- `module-test-coverage-investments`: Cobertura completa de testes para módulo investments
- `module-test-coverage-reports`: Cobertura completa de testes para módulo reports
- `module-test-coverage-savings`: Cobertura completa de testes para módulo savings
- `module-test-coverage-tags`: Cobertura completa de testes para módulo tags
- `module-test-coverage-transactions`: Cobertura completa de testes para módulo transactions
- `shared-components-tests`: Testes para todos os componentes compartilhados
- `infrastructure-tests`: Testes para camada de infraestrutura (DB, storage, crypto)
- `core-tests`: Testes para sistema central (DI, errors, migrations)
- `playwright-removal`: Remoção completa do Playwright e suas dependências

### Modified Capabilities

- *(Nenhuma modificação de capabilities existentes - apenas implementação)*

## Impact

### Dependências Removidas
- `@playwright/test` - Framework de testes E2E
- `eslint-plugin-playwright` - Plugin ESLint para Playwright

### Scripts Modificados
- `package.json`: Remover `test:e2e`, manter apenas `test:unit` (renomear para `test`)

### Configurações Atualizadas
- `vitest.config.ts`: Otimizar configuração para cobertura completa
- `knip.json`: Atualizar regras de dead code detection para nova estrutura de testes

### Cobertura Esperada
- Código de negócio: **80% mínimo**
- Componentes de UI: **70% mínimo**
- Infraestrutura/Utilitários: **90% mínimo**

### CI/CD
- Remover etapas de teste Playwright
- Adicionar verificação de cobertura nos checks
- Simplificar pipeline de testes

### Desenvolvimento
- Desenvolvedores usarão apenas `npm run test` para todos os testes
- Hot reload de testes via Vitest UI/Watch mode
- Relatório de cobertura gerado automaticamente
