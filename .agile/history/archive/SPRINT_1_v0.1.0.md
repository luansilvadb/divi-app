# SPRINT ATUAL: EPIC 1 (Fundação e Núcleo Local-First)

**Meta:** v0.2.0
**Status:** Aguardando Execução
**Tech Lead:** Usuário

> **Aviso ao Tech Lead:**
> Instruções estritas. Qualquer alteração neste arquivo deve ser apenas a marcação de `[x]` nas caixas de seleção. Dúvidas arquiteturais não são admitidas; apenas traduza as especificações abaixo em código. Referencie o arquivo `.agile/spec/TECHNICAL_SPEC_V0.2.0.md` para os detalhes exatos de implementação.

---

## MICRO-RFC: O Motor Local-First

### Tarefa 1: Instalação e Configuração do Dexie

- [x] Instalar as dependências necessárias: `npm install dexie` e `npm install uuid` (para geração segura do UUID universal das entidades).
- [x] Instalar definições de tipos para o uuid: `npm install -D @types/uuid`
- [x] Criar o arquivo `src/infrastructure/db/DexieDB.ts` implementando o modelo `DiviDatabase` conforme seção 2.1 da Especificação.

### Tarefa 2: Implementação da Camada de Domínio e Aplicação

- [x] Criar a interface de domínio em `src/modules/transactions/domain/Transaction.ts` (Sec 3.1).
- [x] Criar a porta do repositório em `src/modules/transactions/application/TransactionRepositoryPort.ts` (Sec 3.2).
- [x] Implementar o adapter Dexie em `src/modules/transactions/infrastructure/DexieTransactionRepository.ts`, que injeta valores defaults sistêmicos (`syncStatus`, datas) e salva no Dexie.

### Tarefa 3: Configuração da Reatividade e Dashboard

- [x] Modificar ou criar a View `src/modules/transactions/ui/views/DashboardView.vue` que atuará como root (`/`).
- [x] Implementar a ligação (binding) reativa entre a listagem de transações no Dashboard e as queries locais do Dexie, exibindo o estado vazio adequadamente conforme os Critérios BDD (Sec 4.1).
