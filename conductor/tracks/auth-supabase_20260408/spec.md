# Spec: Integração Supabase Auth e Sessão Persistente (`auth-supabase_20260408`)

## 1. Visão Geral (Overview)
Implementar um sistema de autenticação e gerenciamento de sessão utilizando o Supabase Auth para o aplicativo Divi. Isso permitirá que os usuários criem contas, façam login e mantenham suas sessões ativas entre as visitas ao app.

## 2. Requisitos Funcionais (Functional Requirements)
- **Integração Técnica:** Configurar e instanciar o cliente Supabase (`@supabase/supabase-js`).
- **Módulo de Autenticação:** Implementar `SupabaseAuth.ts` no módulo de infraestrutura (`src/modules/auth/infrastructure/`).
- **Registro de Usuários:** Permitir criação de conta com e-mail/senha.
- **Login e Logout:** Implementar login (e-mail/senha + Google Social Auth) e logout seguro.
- **Sessão Persistente:** Garantir que a sessão do usuário seja mantida de forma persistente através do Supabase SDK.
- **Interface de Login:** Atualizar a `LoginView.vue` para incluir formulários de e-mail/senha e botão de login social com Google.

## 3. Requisitos Não Funcionais (Non-Functional Requirements)
- **Segurança:** Utilizar as melhores práticas de gerenciamento de tokens e comunicação HTTPS.
- **Estética e UI:** Utilizar PrimeVue com o preset de Tailwind configurado no projeto.
- **Feedback Visual:** Implementar feedback imediato via PrimeVue Toast em caso de sucesso ou erro nas operações de auth.

## 4. Critérios de Aceite (Acceptance Criteria)
- [ ] O usuário consegue se registrar com e-mail e senha.
- [ ] O usuário consegue fazer login via Google Social Auth.
- [ ] Ao fechar e reabrir o app, o usuário deve permanecer logado se não tiver feito logout.
- [ ] Em caso de credenciais inválidas, uma mensagem de erro (Toast) deve ser exibida.
- [ ] O código deve seguir os padrões de linting do projeto (oxlint/eslint).

## 5. Fora de Escopo (Out of Scope)
- Sincronização de dados entre instâncias (Sync Engine - a ser tratada em outra track).
- Recuperação de senha "Esqueci minha senha" (adiada para versão posterior).
- MFA (Multi-Factor Authentication).
