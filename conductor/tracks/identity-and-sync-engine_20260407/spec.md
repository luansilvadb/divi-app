# Specification: Identidade e Sync Engine

## 1. Overview
Esta track tem como objetivo implementar o sistema de identidade do usuário (autenticação via Supabase) e uma engine de sincronização em background (Sync Engine) para garantir que os dados armazenados localmente (via Dexie) sejam sincronizados de maneira resiliente para o backend. Esta fundação permitirá que a aplicação funcione eficientemente offline (local-first) e mantenha os dados atualizados de forma consistente entre dispositivos.

## 2. Functional Requirements
### 2.1 Autenticação e Identidade
- Suportar registro e login de usuários utilizando **Email e Senha**.
- Suportar autenticação via provedor social **Google OAuth**.
- Manter a sessão do usuário de forma persistente e segura localmente.
- Permitir que o usuário realize logout, limpando a sessão local de forma segura.

### 2.2 Sincronização em Background (Sync Engine)
- Acionar a sincronização em background **imediatamente após alterações no banco de dados local**.
- Monitorar entidades no banco de dados local (Dexie.js) que tenham o status de sincronização (`syncStatus`) como 'pending' ou 'failed'.
- Processar filas de transações locais para enviá-las ao Supabase.
- Atualizar o status local da entidade para 'synced' assim que o envio ao servidor for confirmado.
- Detectar transições de estado de rede (offline para online) e retomar as operações de sincronização pendentes automaticamente.

### 2.3 Resolução de Conflitos
- Implementar ou preparar terreno para **Sincronização Inteligente (CRDT)**, visando resolver conflitos de edição simultânea e assíncrona entre cliente e servidor sem intervenção do usuário, preservando a intenção das atualizações.

### 2.4 Interface do Usuário (Status de Sincronização)
- Exibir um indicador global na barra de navegação superior (Cabeçalho Global) detalhando o status atual (online, offline, sincronizando, pendente).
- Exibir painel com histórico e opções de configuração da sincronização na página de Configurações/Perfil do Usuário.
- Mostrar o status específico da sincronização ao lado de itens e transações individuais nas listas e tabelas.
- Implementar telas e componentes de Login interligados com o router e os stores de autenticação.

## 3. Non-Functional Requirements
- A experiência deve ser local-first, sendo as operações da UI baseadas no estado do IndexedDB local com sincronização paralela, para garantir extrema rapidez e resiliência offline.
- Garantir segurança e proteção na transmissão dos dados durante a sincronização.
- O processo de sincronização não pode bloquear ou impactar a fluidez visual da aplicação web.

## 4. Acceptance Criteria
- [ ] O usuário consegue se registrar e fazer login com sucesso usando Email/Senha ou Google OAuth.
- [ ] A sessão persiste mesmo após o fechamento e reabertura do navegador.
- [ ] Qualquer entidade salva localmente adquire a propriedade `syncStatus: pending` e desencadeia a sincronização.
- [ ] Após sucesso no envio ao Supabase, o registro local muda para `syncStatus: synced`.
- [ ] Ao recuperar a conexão com a internet, itens `pending` ou `failed` são processados e enviados.
- [ ] Mecanismos básicos de CRDT garantem que modificações em diferentes clientes não sobrescrevam arbitrariamente campos não relacionados do mesmo registro.
- [ ] A interface atualiza adequadamente para mostrar a indicação global de sync, status do item e logs no painel de configuração.

## 5. Out of Scope
- Funcionalidades complexas de colaboração multi-usuário (ex: planejamento compartilhado do mesmo orçamento em tempo real).
- Outras redes sociais e provedores de autenticação além do Google.
- Histórico de versionamento reverso das transações visível para os usuários finais.