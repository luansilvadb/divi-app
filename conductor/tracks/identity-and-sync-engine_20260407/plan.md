# Implementation Plan: Identidade e Sync Engine

## Phase 1: Setup da Identidade e Supabase Auth
- [x] Task: Instalar dependências necessárias para autenticação (`@supabase/supabase-js`, etc). f8f7fd6
- [x] Task: Configurar conexão com o Supabase Auth em `src/modules/auth/infrastructure/SupabaseAuth.ts`. cd30fbe
- [x] Task: Criar o store no Pinia para gerenciar o estado da sessão e os dados do usuário atual. edbbfbd
- [x] Task: Implementar a lógica de registro, login (Email/Senha), e funcionalidade de logout. 2366d67
- [x] Task: Implementar a integração com autenticação via Google OAuth. 2366d67
- [x] Task: Desenvolver a UI (Página/Componente) de Login, Registro e feedback visual (sucesso/falha). 073b4e3f912a6e1023810267770e2d2622b64719
- [x] Task: Atualizar o roteador (vue-router) para implementar guardas nas rotas protegidas. 8c2a895
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup da Identidade e Supabase Auth' (Protocol in workflow.md) d4f34fa

## Phase 2: Estrutura Base do Sync Engine [checkpoint: 48bd5ab]
- [x] Task: Atualizar o esquema do banco local (Dexie) adicionando a propriedade `syncStatus` ('synced', 'pending', 'failed') nas entidades monitoradas. 83757d1
- [x] Task: Desenvolver o módulo central do Sync Engine responsável por consultar o Dexie atrás de registros `pending` ou `failed`. 48cf0fd
- [x] Task: Integrar hooks no Dexie ou Pinia para acionar o processo de sincronização local ao efetuar uma alteração (On Local Write). d849627
- [x] Task: Configurar listener de eventos do navegador sobre estado da rede (`online`/`offline`) para retomar ou pausar a sincronização. 662b550
- [x] Task: Conductor - User Manual Verification 'Phase 2: Estrutura Base do Sync Engine' (Protocol in workflow.md) 48bd5ab

## Phase 3: Comunicação e Lógica Inteligente (CRDT) [checkpoint: 8f219ae]
- [x] Task: Implementar rotinas para transmissão de fila das atualizações pendentes para o banco Supabase. 77526d3
- [x] Task: Configurar estratégia primária para a sincronização inteligente (CRDT ou last-write-wins baseado em timestamp \`updated_at\`). b04ae77
- [x] Task: Validar as respostas do Supabase e retornar a confirmação para atualizar o status do item local para synced. 94e4074
- [x] Task: Lidar apropriadamente com erros (falhas de conexão ou timeouts) mantendo os registros como failed ou pending no banco local. 31b4345
- [x] Task: Conductor - User Manual Verification 'Phase 3: Comunicação e Lógica Inteligente (CRDT)' (Protocol in workflow.md) 8f219ae

## Phase 4: Sincronização na Interface (UI Feedback)
- [ ] Task: Criar componente de Indicador Global na navbar informando o status global da rede e do Sync Engine.
- [ ] Task: Adicionar pequeno indicador visual para os dados em Nível do Item nas listagens da aplicação (Ex: ícone de nuvem sincronizada ou pendente).
- [ ] Task: Construir a seção ou painel de logs de Sync no Perfil/Configurações do usuário mostrando tentativas passadas e status atual.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Sincronização na Interface (UI Feedback)' (Protocol in workflow.md)n workflow.md)