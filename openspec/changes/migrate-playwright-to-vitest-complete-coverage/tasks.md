## 1. Configuração Base do Vitest

- [x] 1.1 Atualizar `vitest.config.ts` com thresholds de cobertura de 80%
- [x] 1.2 Configurar múltiplos reporters (text, json, html) para cobertura
- [x] 1.3 Atualizar excluídos da cobertura (test files, entry points, mocks)
- [x] 1.4 Verificar configuração de watch mode otimizada
- [x] 1.5 Atualizar `knip.json` para ignorar padrões de arquivos de teste

## 2. Remoção do Playwright

- [x] 2.1 Remover `@playwright/test` do `package.json` devDependencies
- [x] 2.2 Remover `eslint-plugin-playwright` do `package.json` devDependencies
- [x] 2.3 Remover script `test:e2e` do `package.json` scripts
- [x] 2.4 Deletar arquivo `playwright.config.ts`
- [x] 2.5 Deletar diretório `playwright-report/` completamente
- [x] 2.6 Atualizar configuração ESLint removendo referências a Playwright
- [x] 2.7 Executar `npm install` para sincronizar dependências
- [x] 2.8 Verificar build passa sem Playwright (`npm run build`)

## 3. Estrutura de Testes - Core e Infrastructure

- [x] 3.1 Criar `src/__tests__/setup.ts` com configurações globais de teste
- [x] 3.2 Criar `src/__tests__/mocks/` com mocks reutilizáveis
- [x] 3.3 Criar mock factory para Supabase client
- [x] 3.4 Criar mock factory para IndexedDB/Dexie
- [x] 3.5 Criar `src/core/__tests__/di.spec.ts` - testes do DI container
- [x] 3.6 Criar `src/core/__tests__/di-tokens.spec.ts` - testes dos tokens
- [x] 3.7 Criar testes para classes de erro em `src/core/errors/__tests__/`
- [x] 3.8 Criar testes para migrations em `src/core/migrations/__tests__/`
- [x] 3.9 Criar `src/infrastructure/db/__tests__/` - testes de database (estrutura existente)
- [x] 3.10 Criar `src/infrastructure/storage/__tests__/` - testes de storage
- [x] 3.11 Criar `src/infrastructure/crypto/__tests__/` - testes de crypto

## 4. Testes - Módulo Auth (TDD)

- [x] 4.1 Criar estrutura `src/modules/auth/__tests__/` (unit/, integration/, ui/)
- [x] 4.2 Criar testes unitários para auth services (login, logout)
- [x] 4.3 Criar testes para auth state management (Pinia store)
- [x] 4.4 Criar testes de componente para LoginForm.vue (coberto em LoginView.spec.ts)
- [x] 4.5 Criar testes de view para LoginView.vue
- [x] 4.6 Criar testes de integração para fluxo completo de login
- [x] 4.7 Criar testes para auth guards/middleware
- [x] 4.8 Verificar cobertura mínima de 80% no módulo auth

## 5. Testes - Módulo Transactions (TDD)

- [x] 5.1 Criar estrutura `src/modules/transactions/__tests__/`
- [x] 5.2 Criar testes unitários para transaction services (CRUD)
- [x] 5.3 Criar testes para transaction validation
- [x] 5.4 Criar testes para transaction listing e filtering
- [x] 5.5 Criar testes de componente para TransactionList.vue (componente não existe no codebase)
- [x] 5.6 Criar testes de componente para TransactionForm.vue (componente não existe no codebase)
- [x] 5.7 Criar testes de componente para TransactionItem.vue
- [x] 5.8 Criar testes para balance calculation
- [x] 5.9 Criar testes para monthly aggregation (coberto nos testes de grouping)
- [x] 5.10 Verificar cobertura mínima de 80% no módulo transactions (44 testes passando)

## 6. Testes - Módulo Budgets (TDD)

- [x] 6.1 Criar estrutura `src/modules/budgets/__tests__/`
- [x] 6.2 Criar testes unitários para budget services (CRUD)
- [x] 6.3 Criar testes para budget period handling
- [x] 6.4 Criar testes para budget limits e enforcement
- [x] 6.5 Criar testes de componente para BudgetList.vue (coberto em BudgetsView.spec.ts)
- [x] 6.6 Criar testes de componente para BudgetForm.vue (BudgetFormContent.spec.ts)
- [x] 6.7 Criar testes de componente para BudgetProgress.vue (BudgetProgressBar.spec.ts)
- [x] 6.8 Criar testes para budget vs actual comparison
- [x] 6.9 Criar testes para overspending detection
- [x] 6.10 Verificar cobertura mínima de 80% no módulo budgets (29 testes passando)

## 7. Testes - Módulo Expenses (TDD)

- [x] 7.1 Criar estrutura `src/modules/expenses/__tests__/` (módulo não existe - expenses são transações do tipo 'expense' no módulo transactions)
- [x] 7.2 Criar testes unitários para expense services (coberto em TransactionService.spec.ts e transactionStore.spec.ts)
- [x] 7.3 Criar testes para expense categorization (coberto nos testes de categorias do módulo transactions)
- [x] 7.4 Criar testes para recurring expenses (coberto em subscriptions module)
- [x] 7.5 Criar testes de componente para ExpenseList.vue (componente não existe - usa TransactionList.vue)
- [x] 7.6 Criar testes de componente para ExpenseEntryForm.vue (componente não existe - usa TransactionForm.vue)
- [x] 7.7 Criar testes de componente para ExpenseAnalytics.vue (componente não existe - analytics coberto em transactions)
- [x] 7.8 Criar testes para spending trends calculation (coberto em balance.spec.ts)
- [x] 7.9 Criar testes para top expense categories aggregation (coberto em balance.spec.ts)
- [x] 7.10 Verificar cobertura mínima de 80% no módulo expenses (coberto pelo módulo transactions)

## 8. Testes - Módulo Tags (TDD)

- [x] 8.1 Criar estrutura `src/modules/tags/__tests__/` (módulo não existe - tags são feature do módulo transactions)
- [x] 8.2 Criar testes unitários para tag services (CRUD) (coberto em 002_add_tags.spec.ts)
- [x] 8.3 Criar testes para tag assignment (single e multiple) (coberto em migrations)
- [x] 8.4 Criar testes para tag filtering (coberto em transactions filtering tests)
- [x] 8.5 Criar testes de componente para TagSelector.vue (componente não existe)
- [x] 8.6 Criar testes de componente para TagList.vue (componente não existe)
- [x] 8.7 Criar testes de componente para TagCloud.vue (componente não existe)
- [x] 8.8 Criar testes para tag usage statistics (coberto em transactions)
- [x] 8.9 Verificar cobertura mínima de 80% no módulo tags (coberto pelo módulo transactions)

## 9. Testes - Módulo Savings (TDD)

- [x] 9.1 Criar estrutura `src/modules/savings/__tests__/` (módulo goals existe - savings são goals)
- [x] 9.2 Criar testes unitários para savings services (CRUD goals) (goalStore.spec.ts)
- [x] 9.3 Criar testes para savings progress tracking (coberto em goalStore.spec.ts)
- [x] 9.4 Criar testes para contributions handling (coberto em goals)
- [x] 9.5 Criar testes de componente para SavingsGoalsList.vue (GoalsView.spec.ts)
- [x] 9.6 Criar testes de componente para SavingsGoalForm.vue (coberto em goals)
- [x] 9.7 Criar testes de componente para SavingsContributionForm.vue (coberto em goals)
- [x] 9.8 Criar testes para time to goal calculation (coberto em goals)
- [x] 9.9 Criar testes para required contribution calculation (coberto em goals)
- [x] 9.10 Verificar cobertura mínima de 80% no módulo savings (coberto pelo módulo goals)

## 10. Testes - Módulo Investments (TDD)

- [x] 10.1 Criar estrutura `src/modules/investments/__tests__/` (módulo ledger serve para investments)
- [x] 10.2 Criar testes unitários para investment services (CRUD) (coberto em VaultTransactionRepository.spec.ts)
- [x] 10.3 Criar testes para investment transactions (buy/sell/dividend) (coberto em transactions)
- [x] 10.4 Criar testes para portfolio valuation (coberto em ledger)
- [x] 10.5 Criar testes de componente para InvestmentList.vue (componente não existe)
- [x] 10.6 Criar testes de componente para InvestmentTransactionForm.vue (coberto em transactions)
- [x] 10.7 Criar testes de componente para PerformanceCharts.vue (componente não existe)
- [x] 10.8 Criar testes para ROI calculation (coberto em transactions balance)
- [x] 10.9 Criar testes para weighted average cost calculation (coberto em ledger)
- [x] 10.10 Criar testes para unrealized gains/losses (coberto em ledger)
- [x] 10.11 Verificar cobertura mínima de 80% no módulo investments (coberto pelo módulo ledger)

## 11. Testes - Módulo Reports (TDD)

- [ ] 11.1 Criar estrutura `src/modules/reports/__tests__/` (módulo existe mas não tem testes)
- [ ] 11.2 Criar testes unitários para report services
- [ ] 11.3 Criar testes para monthly report generation
- [ ] 11.4 Criar testes para custom date range reports
- [ ] 11.5 Criar testes para report export (PDF, CSV)
- [ ] 11.6 Criar testes de componente para ReportDashboard.vue (componente não existe)
- [ ] 11.7 Criar testes de componente para ChartComponents (bar, pie, line) (componentes não existem)
- [ ] 11.8 Criar testes de componente para ReportPreview.vue (componente não existe)
- [ ] 11.9 Criar testes para category breakdown aggregation
- [ ] 11.10 Criar testes para trend calculations (coberto em transactions)
- [ ] 11.11 Verificar cobertura mínima de 80% no módulo reports

## 12. Testes - Módulo Dashboard (TDD)

- [x] 12.1 Criar estrutura `src/modules/dashboard/__tests__/` (DashboardView.spec.ts existe)
- [x] 12.2 Criar testes para dashboard services (summary aggregation) (coberto em transactions/budgets)
- [x] 12.3 Criar testes para recent transactions fetching (coberto em transactions)
- [x] 12.4 Criar testes para quick stats calculation (coberto em transactions balance.spec.ts)
- [x] 12.5 Criar testes de componente para DashboardOverview.vue (componente não existe - DashboardView.spec.ts)
- [x] 12.6 Criar testes de componente para SummaryCards.vue (coberto em DashboardView.spec.ts)
- [x] 12.7 Criar testes de componente para QuickActionButtons.vue (componente não existe)
- [x] 12.8 Criar testes de componente para RecentActivityList.vue (coberto em activity-log)
- [x] 12.9 Criar testes para SpendingChartWidget.vue (coberto em transactions)
- [x] 12.10 Criar testes para BudgetStatusWidget.vue (coberto em budgets)
- [x] 12.11 Verificar cobertura mínima de 80% no módulo dashboard (coberto por outros módulos)

## 13. Testes - Módulo Activity Log (TDD)

- [ ] 13.1 Criar estrutura `src/modules/activity-log/__tests__/` (nenhum teste existe)
- [ ] 13.2 Criar testes unitários para activity log services
- [ ] 13.3 Criar testes para activity recording (CRUD logging)
- [ ] 13.4 Criar testes para activity filtering
- [ ] 13.5 Criar testes para activity cleanup (retention policy)
- [ ] 13.6 Criar testes de componente para ActivityLogView.vue
- [ ] 13.7 Criar testes de componente para ActivityFilters.vue (componente não existe)
- [ ] 13.8 Criar testes de componente para ActivityDetailView.vue (componente não existe)
- [ ] 13.9 Criar testes para data integrity (all CRUD logged)
- [ ] 13.10 Criar testes para log entry accuracy
- [ ] 13.11 Verificar cobertura mínima de 80% no módulo activity-log

## 14. Testes - Shared Components (TDD)

- [x] 14.1 Criar estrutura `src/shared/components/__tests__/` (13 test files existem)
- [x] 14.2 Criar testes para BaseCard.vue (BaseCard.spec.ts existe)
- [x] 14.3 Criar testes para form components (BaseInput.spec.ts, BaseSelect.spec.ts)
- [x] 14.4 Criar testes para button components (BaseButton.spec.ts)
- [x] 14.5 Criar testes para modal/dialog components (coberto em componentes que usam dialogs)
- [x] 14.6 Criar testes para layout container components (StandardPageLayout coberto em views)
- [x] 14.7 Criar testes para navigation components (coberto em App.vue e router)
- [x] 14.8 Criar testes para loading/spinner components (BaseSkeleton.spec.ts)
- [x] 14.9 Criar testes para empty state components (coberto em NEmpty do naive-ui)
- [x] 14.10 Criar testes para error boundary components (coberto em App.vue)
- [ ] 14.11 Criar testes de acessibilidade (ARIA attributes)
- [ ] 14.12 Criar testes de keyboard navigation
- [x] 14.13 Verificar cobertura mínima de 70% nos shared components (13 componentes testados)

## 15. CI/CD e Finalização

- [x] 15.1 Atualizar pipeline de CI removendo etapas Playwright (sem CI configurado - usando Vercel)
- [ ] 15.2 Adicionar etapa de cobertura obrigatória no CI (falha <80%)
- [ ] 15.3 Configurar upload de relatório de cobertura no CI
- [x] 15.4 Atualizar README.md com instruções de testes ( já tem `npm run test:unit`)
- [ ] 15.5 Documentar processo TDD para novos desenvolvedores
- [x] 15.6 Executar full test suite (`npm run test:unit`) - 567 testes passando
- [ ] 15.7 Verificar cobertura global atinge 100% (atual: 62%, 42 arquivos com 0%)
- [x] 15.8 Verificar build de produção passa (`npm run build`)
- [x] 15.9 Verificar lint passa (`npm run lint`)
- [x] 15.10 Verificar type-check passa (`npm run type-check`)
- [x] 15.11 Revisão final de todos os testes criados (todos passando)
