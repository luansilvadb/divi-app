# Plan: Integração Supabase Auth e Sessão Persistente (`auth-supabase_20260408`)

## Fase 1: Setup e Infraestrutura Base [checkpoint: 0b558b7]
- [x] Task: Instalar e configurar dependência do Supabase (0a6f93b)
    - [x] Executar `npm install @supabase/supabase-js`
    - [x] Criar/Configurar variáveis de ambiente (`.env`) para o Supabase URL e Anon Key
- [x] Task: Implementar Singleton do Cliente Supabase (aae53b9)
    - [x] Criar `src/core/supabase.ts` para exportar a instância do cliente
- [x] Task: Conductor - User Manual Verification 'Fase 1: Setup e Infraestrutura Base' (0b558b7)

## Fase 2: Lógica de Autenticação (Infrastructure & Application)
- [ ] Task: Implementar `SupabaseAuth.ts` no módulo de infraestrutura
    - [ ] Escrever testes de unidade para os métodos de login, registro e logout
    - [ ] Implementar `loginWithEmail`, `registerWithEmail`, `loginWithGoogle` e `logout`
- [ ] Task: Integrar com a Store de Autenticação (Pinia/State Management)
    - [ ] Escrever testes para a store de auth refletindo o estado do usuário logado
    - [ ] Implementar integração da store com o `SupabaseAuth.ts`
- [ ] Task: Conductor - User Manual Verification 'Fase 2: Lógica de Autenticação' (Protocol in workflow.md)

## Fase 3: Interface do Usuário (UI)
- [ ] Task: Atualizar `LoginView.vue` com PrimeVue e Tailwind
    - [ ] Criar testes de componente para a view de login (campos de input e botões)
    - [ ] Implementar formulário de e-mail/senha utilizando componentes PrimeVue
    - [ ] Adicionar botão de "Login com Google" com estilos Tailwind
- [ ] Task: Implementar Feedback de Erro e Sucesso (Toast)
    - [ ] Configurar `ToastService` do PrimeVue na View de Login
    - [ ] Validar exibição de mensagens para erros comuns (senha incorreta, e-mail já existe)
- [ ] Task: Conductor - User Manual Verification 'Fase 3: Interface do Usuário' (Protocol in workflow.md)

## Fase 4: Persistência e Navegação
- [ ] Task: Garantir Persistência de Sessão no Boot do App
    - [ ] Escrever teste que verifica se o estado de auth é recuperado ao iniciar o app
    - [ ] Implementar listener `onAuthStateChange` do Supabase no `main.ts` ou `App.vue`
- [ ] Task: Proteção de Rotas (Router Guard)
    - [ ] Implementar guard no `src/router/index.ts` para redirecionar usuários não autenticados
- [ ] Task: Conductor - User Manual Verification 'Fase 4: Persistência e Navegação' (Protocol in workflow.md)
