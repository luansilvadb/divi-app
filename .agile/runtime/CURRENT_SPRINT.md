# SPRINT ATUAL: EPIC 2 (Identidade e o Cordão Umbilical)

**Meta:** v0.3.0
**Status:** Aguardando Execução
**Tech Lead:** Usuário

> **Aviso ao Tech Lead:**
> Instruções estritas. Qualquer alteração neste arquivo deve ser apenas a marcação de `[x]` nas caixas de seleção. Dúvidas arquiteturais não são admitidas; apenas traduza as especificações abaixo em código. Referencie o arquivo `.agile/spec/TECHNICAL_SPEC_V0.3.0.md` para os detalhes exatos de implementação.

---

## MICRO-RFC: Identidade e Sync Engine

### Tarefa 1: Integração Supabase Auth e Sessão Persistente

- [ ] Instalar cliente do Supabase (`@supabase/supabase-js`) se não estiver instalado.
- [ ] Configurar conexão com o Supabase Auth em um módulo de auth (`src/modules/auth/infrastructure/SupabaseAuth.ts`).
- [ ] Implementar a lógica de registro, login (com email/senha ou social auth) e logout, garantindo persistência da sessão.
- [ ] Construir/atualizar a view de Login e interligá-la ao roteador e store de autenticação.

### Tarefa 2: Padrão de Sincronização em Background (Sync Engine)

- [ ] Criar a estrutura para o Sync Engine que monitora o Dexie buscando entidades com `syncStatus` 'pending' ou 'failed'.
- [ ] Implementar integração do Sync Engine com o backend (Supabase ou chamadas de API), processando as transações na fila.
- [ ] Atualizar o status das entidades no Dexie para 'synced' em caso de sucesso.
- [ ] Lidar adequadamente com conexões offline-to-online, retomando a sincronização em background quando houver rede.
