---
project_name: 'divi-app'
user_name: 'Luan'
date: '2026-04-12'
sections_completed:
  [
    'technology_stack',
    'architecture',
    'financial_precision',
    'reactivity',
    'offline_strategy',
    'security',
    'ui_accessibility',
    'workflow',
    'testing_quality',
  ]
status: 'complete'
rule_count: 29
optimized_for_llm: true
---

# Project Context for AI Agents

_Este arquivo contém regras e padrões críticos que os agentes de IA devem seguir ao implementar código neste projeto. Foco em detalhes não óbvios que os agentes poderiam ignorar._

---

## Technology Stack & Versions

- **Frontend Framework:** Vue 3.5.30 (Composition API)
- **Language:** TypeScript 5.9.3 (Strict Mode)
- **State Management:** Pinia 3.0.4
- **Database (Local):** Dexie 4.4.1 (IndexedDB)
- **Backend/Auth:** Supabase JS 2.102.1
- **Styling:** UnoCSS 66.6.8 + TailwindCSS 4.2.2 + Naive UI 2.44.1
- **Build Tool:** Vite 7.3.1 (PWA support via vite-plugin-pwa)
- **Testing:** Vitest 4.0.18 + Playwright 1.58.2
- **Utilities:** RxJS 7.8.2, VueUse 14.2.1

---

## Critical Implementation Rules

### Arquitetura e Injeção de Dependência (DI)
- **Isolamento de Camadas:** Proibido importar classes da camada `infrastructure` diretamente na camada `ui`. Toda comunicação entre UI e Infra deve ser mediada pela camada `application` e resolvida via DI.
- **Dependency Injection:** O uso do contêiner em `src/core/di.ts` é obrigatório. Componentes Vue devem usar o helper `useService(TOKEN)` para obter instâncias de serviços.
- **Interfaces:** Devem começar com o prefixo `I` (ex: `IAuthService`, `ITransactionRepository`) para facilitar a identificação no DI.
- **Módulos:** Feature-based modules em `src/modules/` com subpastas obrigatórias: `domain`, `application`, `infrastructure`, `ui`. Proibido criar arquivos fora dessa hierarquia.

### Precisão Financeira e Matemática
- **Banimento do Tipo `number` para Dinheiro:** Nunca use o tipo `number` do JavaScript para cálculos financeiros (soma de saldos, etc.). Utilize **BigInt** ou armazene valores em "Minor Units" (ex: centavos como inteiros) para evitar erros de ponto flutuante.
- **Multi-Moeda:** Ao lidar com moedas diferentes, armazene sempre o valor original, a moeda e a taxa de câmbio histórica (snapshot) no momento da transação.
- **Filtros de Data:** Consultas e relatórios devem obrigatoriamente usar intervalos inclusivos (`start <= date <= end`) para garantir que transações nos limites das datas não sejam omitidas.

### Reatividade e Fluxo de Dados
- **Reatividade Híbrida:** Classes de domínio e serviços de aplicação devem usar **RxJS** (`Subject`, `BehaviorSubject`) para fluxos de dados. Na camada de UI, utilize o `@vueuse/rxjs` (ex: `useObservable`) para converter esses fluxos em `computed` ou `refs` do Vue.
- **Proibição de Hooks Vue em Camadas de Lógica:** **Nunca** use `ref`, `reactive`, `watch` ou `computed` do Vue dentro de classes de domínio ou serviços de aplicação.
- **Linguagem Ubíqua:** Use termos do domínio financeiro (ex: `Transaction` para lançamentos, `Wallet` para carteiras/contas).

### Estratégia Offline-First (Dexie + Supabase)
- **Fluxo de Dados:** Siga o padrão *Offline-First*. Toda alteração deve ser persistida no **Dexie** (IndexedDB) imediatamente. O `SyncEngine` (`src/core/sync/`) é responsável por sincronizar esses dados com o **Supabase** de forma assíncrona.
- **Migrações Dexie:** Cada mudança no schema deve ser versionada e testada. Se uma migração falhar, o app deve bloquear a inicialização para evitar corrupção de dados na fila de sincronização.
- **Busca Local Absoluta:** Como os dados podem ser criptografados de ponta a ponta (E2EE), toda a indexação e busca ocorrem 100% no cliente (Dexie), garantindo que o servidor nunca tenha acesso ao conteúdo pesquisado.
- **Índices no Dexie:** Use índices compostos (ex: `[walletId+date]`) para otimizar buscas frequentes em relatórios e dashboards.
- **Feedback de Sincronização:** A UI deve fornecer feedback visual imediato e usar `aria-live='polite'` para atualizar o estado de sincronização para tecnologias assistivas.

### Segurança e Privacidade (Supabase RLS)
- **RLS Obrigatório:** Row Level Security (RLS) ativado por padrão. Nenhuma operação sem política explícita vinculada ao `auth.uid()`.
- **Atomicidade via RPC:** Operações financeiras complexas devem ser implementadas via Funções de Banco de Dados (RPC) para garantir validações no servidor.
- **Privacidade:** Implementar obrigatoriamente funções de "Exportar Dados" e "Apagar Conta" (GDPR/LGPD compliance).

### Estilização, UI e Acessibilidade (a11y)
- **Acessibilidade AAA:** O contraste de cores deve seguir o padrão AAA. Valide via UnoCSS/Tailwind.
- **i18n Real:** Respeite formatos culturais de data (DD/MM vs MM/DD) e separadores decimais (vírgula vs ponto) conforme a localidade do usuário.
- **Naive UI:** Use para componentes complexos. Use UnoCSS apenas para ajustes de layout e espaçamento. Proibido estilos CSS customizados fora do config.
- **Virtualização:** Use técnicas de virtualização para exibir listas longas de transações para manter a performance da UI.

### Fluxo de Trabalho e Git
- **Gitflow Simplificado:** `main` (prod), `develop` (integração), `feature/*` (tasks).
- **Conventional Commits:** Padrão `feat:`, `fix:`, `chore:` obrigatório.
- **Hooks de Commit:** `husky` + `lint-staged` para garantir que o lint e os testes passem antes de cada commit.

### Regras de Teste e Qualidade
- **Localização:** `src/**/__tests__/*.spec.ts`. Cobertura mínima de 90% para `domain` e `application`.
- **Vitest:** Foca na lógica pura nas camadas de `domain` e `application` com mocks estritos (use `vi.mock` e `fake-indexeddb`).
- **Playwright E2E:** Deve obrigatoriamente simular cenários de "Modo Avião" (Airplane Mode) para validar a resiliência do offline e o feedback visual de sincronização.
- **Critério de Aceite:** Sucesso de 100% em todos os testes antes do merge.

---

## Usage Guidelines

**Para Agentes de IA:**
- Leia este arquivo antes de implementar qualquer código.
- Siga TODAS as regras exatamente como documentadas.
- Em caso de dúvida, prefira a opção mais restritiva.
- Atualize este arquivo se novos padrões surgirem.

**Para Humanos:**
- Mantenha este arquivo enxuto e focado nas necessidades dos agentes.
- Atualize quando a stack tecnológica mudar.
- Revise trimestralmente para remover regras que se tornaram óbvias.

Última Atualização: 2026-04-12
